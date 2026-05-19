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
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from './firebase';

export type UserRole = 'admin' | 'user' | null;
export type UserStatus = 'active' | 'blocked' | null;

interface AuthContextType {
    currentUser: User | null;
    userRole: UserRole;
    userStatus: UserStatus;
    token: string | null;
    signup: (email: string, password: string) => Promise<UserRole>;
    login: (email: string, password: string) => Promise<UserRole>;
    loginWithGoogle: () => Promise<UserRole>;
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

async function fetchUserData(user: User): Promise<{ role: UserRole; status: UserStatus }> {
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
        displayName: user.displayName || null,
        role: 'user',
        status: 'active',
        createdAt: new Date().toISOString(),
    });
    return { role: 'user', status: 'active' };
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

    async function handleTokenRefresh(user: User) {
        const freshToken = await getIdToken(user, true);
        setToken(freshToken);
        localStorage.setItem('authToken', freshToken);
    }

    async function signup(email: string, password: string): Promise<UserRole> {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        // Prove the email belongs to the user before they can access the app.
        await sendEmailVerification(credential.user);
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
        const result = await signInWithPopup(auth, googleProvider);
        if (auth.currentUser){
            const freshToken = await getIdToken(auth?.currentUser, true);
            localStorage.setItem('authToken', freshToken);
            setToken(freshToken);
        }
        const { role, status } = await fetchUserData(result.user);
        setUserRole(role);
        setUserStatus(status);
        return role;
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
        await updateProfile(user, { displayName: name });
        // Refresh the in-memory user, then force a re-render so the sidebar
        // reflects the new name immediately. This must happen before the
        // Firestore write so a Firestore hiccup can't block the UI update.
        await user.reload();
        setProfileVersion((v) => v + 1);
        // Mirror into Firestore for the admin view — best-effort, non-fatal
        // (the sidebar reads the Auth profile, not this doc).
        try {
            await setDoc(doc(db, 'users', user.uid), { displayName: name }, { merge: true });
        } catch (err) {
            console.error('Failed to mirror displayName to Firestore:', err);
        }
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

                try {
                    const { role, status } = await fetchUserData(user);
                    setUserRole(role);
                    setUserStatus(status);
                } catch (err) {
                    console.error('Failed to fetch user data:', err);
                    setUserRole(null);
                    setUserStatus(null);
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
