// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAq_8kgNEjehBsaFrcZTLGewy192UZLBHA",
    authDomain: "cv-builder1-f5560.firebaseapp.com",
    projectId: "cv-builder1-f5560",
    storageBucket: "cv-builder1-f5560.firebasestorage.app",
    messagingSenderId: "281924958406",
    appId: "1:281924958406:web:33ad5839bc38bb23943fc7",
    measurementId: "G-FZ8XH15FNE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });