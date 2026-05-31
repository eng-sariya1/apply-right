import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, GoogleAuthProvider, type Auth } from 'firebase/auth';
import { initializeFirestore, type Firestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAq_8kgNEjehBsaFrcZTLGewy192UZLBHA',
  authDomain: 'cv-builder1-f5560.firebaseapp.com',
  projectId: 'cv-builder1-f5560',
  storageBucket: 'cv-builder1-f5560.firebasestorage.app',
  messagingSenderId: '281924958406',
  appId: '1:281924958406:web:33ad5839bc38bb23943fc7',
  measurementId: 'G-FZ8XH15FNE',
};

const app = initializeApp(firebaseConfig);

export const auth: Auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db: Firestore = initializeFirestore(app, {
  ignoreUndefinedProperties: true,
});

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
