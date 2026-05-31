import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    signInWithPopup,
    sendEmailVerification,
    sendPasswordResetEmail,
    updateProfile,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
    getIdToken,
    type User
} from 'firebase/auth';
import { doc, getDoc, setDoc, writeBatch } from 'firebase/firestore';
import { auth, db, googleProvider } from './firebase';

export type UserRole = 'admin' | 'user' | null;
export type UserStatus = 'active' | 'blocked' | null;

interface AuthContextType {
    currentUser: User | null;
    userRole: UserRole;
    userStatus: UserStatus;
    token: string | null;
    signup: (email: string, password: string, name: string) => Promise<UserRole>;
    login: (email: string, password: string) => Promise<UserRole>;
    loginWithGoogle: () => Promise<UserRole>;
    lookupUsername: (name: string) => Promise<{ uid: string; email: string } | null>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<void>;
    sendVerificationEmail: () => Promise<void>;
    reloadAndRefresh: () => Promise<boolean>;
    resetPassword: (email: string) => Promise<void>;
    updateDisplayName: (name: string) => Promise<void>;
    changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}

async function fetchUserData(
    user: User,
    displayName?: string,
): Promise<{ role: UserRole; status: UserStatus }> {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        const data = userDoc.data();
        return {
            role: data.role as UserRole,
            status: (data.status || 'active') as UserStatus,
        };
    }
    await setDoc(userDocRef, {
        email: user.email,
        // For email/password signup we pass the Full Name explicitly; for
        // Google sign-in we fall back to the Google-provided displayName.
        displayName: displayName ?? user.displayName ?? null,
        role: 'user',
        status: 'active',
        createdAt: new Date().toISOString(),
    });
    return { role: 'user', status: 'active' };
}

// Normalize a free-form name into a Firestore doc ID for /usernames lookup.
// Collapses whitespace, lowercases, and replaces '/' (forbidden in doc IDs)
// with a space. Throws on empty / reserved IDs ('.', '..', '__*__').
function usernameKey(s: string): string {
    const k = s.replace(/\s+/g, ' ').replace(/\//g, ' ').trim().toLowerCase();
    if (!k || k === '.' || k === '..' || /^__.*__$/.test(k)) {
        throw new Error('Invalid name');
    }
    return k;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<UserRole>(null);
    const [userStatus, setUserStatus] = useState<UserStatus>(null);
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken'));
    const [loading, setLoading] = useState(true);
    // Bumped after a profile edit to force consumers (e.g. the sidebar) to
    // re-read the in-place-mutated Firebase user object.
    const [, setProfileVersion] = useState(0);
    const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    // Prevents onAuthStateChanged from racing with loginWithGoogle to create
    // the Firestore user doc — only the explicit call should do it.
    const googleSigningInRef = useRef(false);

    async function handleTokenRefresh(user: User) {
        const freshToken = await getIdToken(user, true);
        setToken(freshToken);
        localStorage.setItem('authToken', freshToken);
    }

    async function signup(email: string, password: string, name: string): Promise<UserRole> {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        // Prove the email belongs to the user before they can access the app.
        await sendEmailVerification(credential.user);
        // The signup field IS the user's displayed name AND their login handle.
        // Set the Auth profile so the rest of the app (Sidebar, ProfilePage,
        // admin views) sees it consistently from this point on.
        await updateProfile(credential.user, { displayName: name });
        // Reserve the name -> {uid, email} mapping under the normalized key.
        // Rules enforce uniqueness atomically — a second user's claim would
        // become an update op that fails the ownership check.
        await setDoc(doc(db, 'usernames', usernameKey(name)), {
            uid: credential.user.uid,
            email: credential.user.email ?? email,
        });
        if (auth.currentUser){
            const freshToken = await getIdToken(auth?.currentUser, true);
            localStorage.setItem('authToken', freshToken);
            setToken(freshToken);
        }
        const { role, status } = await fetchUserData(credential.user, name);
        setUserRole(role);
        setUserStatus(status);
        return role;
    }

    async function login(email: string, password: string): Promise<UserRole> {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        if (auth.currentUser){
            const freshToken = await getIdToken(auth?.currentUser, true);
            localStorage.setItem('authToken', freshToken);
            setToken(freshToken);
        }
        const { role, status } = await fetchUserData(credential.user);
        setUserRole(role);
        setUserStatus(status);
        return role;
    }

    async function loginWithGoogle(): Promise<UserRole> {
        googleSigningInRef.current = true;
        try {
            const result = await signInWithPopup(auth, googleProvider);
            if (auth.currentUser) {
                const freshToken = await getIdToken(auth.currentUser, true);
                localStorage.setItem('authToken', freshToken);
                setToken(freshToken);
            }
            const { role, status } = await fetchUserData(result.user);
            setUserRole(role);
            setUserStatus(status);
            return role;
        } finally {
            googleSigningInRef.current = false;
        }
    }

    async function lookupUsername(name: string): Promise<{ uid: string; email: string } | null> {
        // Normalize internally so the raw login input "Sariya Jabr",
        // "sariya  jabr", or "  SARIYA jabr  " all resolve to the same doc ID.
        // Invalid input -> no match (the Login form falls through to its
        // "not found" branch cleanly).
        let key: string;
        try {
            key = usernameKey(name);
        } catch {
            return null;
        }
        const snap = await getDoc(doc(db, 'usernames', key));
        if (!snap.exists()) {
            return null;
        }
        const data = snap.data();
        return { uid: data.uid as string, email: data.email as string };
    }

    async function logout() {
        await signOut(auth);
        setUserRole(null);
        setUserStatus(null);
        setToken(null);
        localStorage.removeItem('authToken');
    }

    async function refreshToken() {
        if (currentUser) {
            await handleTokenRefresh(currentUser);
        }
    }

    async function sendVerificationEmail() {
        if (!auth.currentUser) {
            throw new Error('No signed-in user to verify');
        }
        await sendEmailVerification(auth.currentUser);
    }

    // Re-checks verification after the user clicks the email link. Returns true
    // once verified. The ID token still carries the old email_verified claim
    // until force-refreshed, so refresh it before any Firestore access.
    async function reloadAndRefresh(): Promise<boolean> {
        if (!auth.currentUser) {
            return false;
        }
        await auth.currentUser.reload();
        const user = auth.currentUser;
        if (user && user.emailVerified) {
            await handleTokenRefresh(user);
            setCurrentUser(user);
            return true;
        }
        return false;
    }

    async function resetPassword(email: string) {
        await sendPasswordResetEmail(auth, email);
    }

    async function updateDisplayName(name: string) {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('No signed-in user');
        }
        // Throws 'Invalid name' on empty/reserved input — ProfilePage maps it.
        const newKey = usernameKey(name);

        // Friendly uniqueness pre-check. Rules enforce the real guarantee (a
        // second user's claim becomes an `update` op that fails because they
        // are not the current owner), but checking up front gives a clean
        // error without leaving the Auth profile half-updated.
        const newSnap = await getDoc(doc(db, 'usernames', newKey));
        if (newSnap.exists() && (newSnap.data().uid as string) !== user.uid) {
            throw new Error('name-taken');
        }

        // Best-effort: derive the old key so we can release it on rename. If
        // the user's current displayName is itself invalid, don't block.
        let oldKey: string | null = null;
        if (user.displayName) {
            try {
                oldKey = usernameKey(user.displayName);
            } catch {
                oldKey = null;
            }
        }

        const batch = writeBatch(db);
        batch.set(doc(db, 'usernames', newKey), {
            uid: user.uid,
            email: user.email ?? '',
        });
        if (oldKey && oldKey !== newKey) {
            // Only include the delete if the old doc actually exists and we
            // own it — otherwise the rule evaluates against a null resource
            // and aborts the whole batch.
            const oldSnap = await getDoc(doc(db, 'usernames', oldKey));
            if (oldSnap.exists() && (oldSnap.data().uid as string) === user.uid) {
                batch.delete(doc(db, 'usernames', oldKey));
            }
        }
        // Mirror into the user profile doc in the same atomic commit. If the
        // rules layer rejects the mapping, this rolls back too — so the admin
        // view never shows a name the public mapping disagrees with.
        batch.set(
            doc(db, 'users', user.uid),
            { displayName: name },
            { merge: true },
        );
        await batch.commit();

        // Only update the Auth profile once the Firestore claim succeeded;
        // that way a lost race never leaves the in-memory profile ahead of
        // the source of truth.
        await updateProfile(user, { displayName: name });
        await user.reload();
        setProfileVersion((v) => v + 1);
    }

    async function changePassword(currentPassword: string, newPassword: string) {
        const user = auth.currentUser;
        if (!user || !user.email) {
            throw new Error('No signed-in user');
        }
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
    }

    // Listen to auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                // Handle token separately so a role-fetch failure doesn't wipe the token
                try {
                    const freshToken = await getIdToken(user, true);
                    setToken(freshToken);
                    localStorage.setItem('authToken', freshToken);
                } catch {
                    setToken(null);
                    localStorage.removeItem('authToken');
                }

                if (!googleSigningInRef.current) {
                    try {
                        const { role, status } = await fetchUserData(user);
                        setUserRole(role);
                        setUserStatus(status);
                    } catch (err) {
                        console.error('Failed to fetch user data:', err);
                        setUserRole(null);
                        setUserStatus(null);
                    }
                }
            } else {
                setUserRole(null);
                setUserStatus(null);
                setToken(null);
                localStorage.removeItem('authToken');
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    // Silent token refresh every 55 minutes
    useEffect(() => {
        if (currentUser) {
            refreshIntervalRef.current = setInterval(() => {
                handleTokenRefresh(currentUser).catch(() => {});
            }, 55 * 60 * 1000);
        }

        return () => {
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
                refreshIntervalRef.current = null;
            }
        };
    }, [currentUser]);

    const value: AuthContextType = {
        currentUser,
        userRole,
        userStatus,
        token,
        signup,
        login,
        loginWithGoogle,
        lookupUsername,
        logout,
        refreshToken,
        sendVerificationEmail,
        reloadAndRefresh,
        resetPassword,
        updateDisplayName,
        changePassword,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
