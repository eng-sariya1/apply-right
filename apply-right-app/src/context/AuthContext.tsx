import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithCredential,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  GoogleAuthProvider,
  getIdToken,
  type User,
} from 'firebase/auth';
import { doc, getDoc, setDoc, writeBatch } from 'firebase/firestore';
import { auth, db } from '../firebase';

export type UserRole = 'admin' | 'user' | null;
export type UserStatus = 'active' | 'blocked' | null;

interface AuthContextType {
  currentUser: User | null;
  userRole: UserRole;
  userStatus: UserStatus;
  token: string | null;
  signup: (email: string, password: string, name: string) => Promise<UserRole>;
  login: (email: string, password: string) => Promise<UserRole>;
  loginWithGoogle: (idToken: string) => Promise<UserRole>;
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

async function fetchUserData(user: User, displayName?: string): Promise<{ role: UserRole; status: UserStatus }> {
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
    displayName: displayName ?? user.displayName ?? null,
    role: 'user',
    status: 'active',
    createdAt: new Date().toISOString(),
  });
  return { role: 'user', status: 'active' };
}

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
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setProfileVersion] = useState(0);
  const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const googleSigningInRef = useRef(false);

  async function handleTokenRefresh(user: User) {
    const freshToken = await getIdToken(user, true);
    setToken(freshToken);
  }

  async function signup(email: string, password: string, name: string): Promise<UserRole> {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(credential.user);
    await updateProfile(credential.user, { displayName: name });
    await setDoc(doc(db, 'usernames', usernameKey(name)), {
      uid: credential.user.uid,
      email: credential.user.email ?? email,
    });
    if (auth.currentUser) {
      const freshToken = await getIdToken(auth.currentUser, true);
      setToken(freshToken);
    }
    const { role, status } = await fetchUserData(credential.user, name);
    setUserRole(role);
    setUserStatus(status);
    return role;
  }

  async function login(email: string, password: string): Promise<UserRole> {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    if (auth.currentUser) {
      const freshToken = await getIdToken(auth.currentUser, true);
      setToken(freshToken);
    }
    const { role, status } = await fetchUserData(credential.user);
    setUserRole(role);
    setUserStatus(status);
    return role;
  }

  async function loginWithGoogle(idToken: string): Promise<UserRole> {
    googleSigningInRef.current = true;
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      const result = await signInWithCredential(auth, credential);
      if (auth.currentUser) {
        const freshToken = await getIdToken(auth.currentUser, true);
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

  async function logout() {
    await signOut(auth);
    setUserRole(null);
    setUserStatus(null);
    setToken(null);
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

  async function reloadAndRefresh(): Promise<boolean> {
    if (!auth.currentUser) return false;
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
    if (!user) throw new Error('No signed-in user');
    const newKey = usernameKey(name);
    const newSnap = await getDoc(doc(db, 'usernames', newKey));
    if (newSnap.exists() && (newSnap.data().uid as string) !== user.uid) {
      throw new Error('name-taken');
    }
    let oldKey: string | null = null;
    if (user.displayName) {
      try { oldKey = usernameKey(user.displayName); } catch { oldKey = null; }
    }
    const batch = writeBatch(db);
    batch.set(doc(db, 'usernames', newKey), { uid: user.uid, email: user.email ?? '' });
    if (oldKey && oldKey !== newKey) {
      const oldSnap = await getDoc(doc(db, 'usernames', oldKey));
      if (oldSnap.exists() && (oldSnap.data().uid as string) === user.uid) {
        batch.delete(doc(db, 'usernames', oldKey));
      }
    }
    batch.set(doc(db, 'users', user.uid), { displayName: name }, { merge: true });
    await batch.commit();
    await updateProfile(user, { displayName: name });
    await user.reload();
    setProfileVersion((v) => v + 1);
  }

  async function changePassword(currentPassword: string, newPassword: string) {
    const user = auth.currentUser;
    if (!user || !user.email) throw new Error('No signed-in user');
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const freshToken = await getIdToken(user, true);
          setToken(freshToken);
        } catch {
          setToken(null);
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
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

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
