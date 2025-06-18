import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDMsb29F0QXrwAhGQsjX4hNRMbCNB80UjA",
  authDomain: "organizador-norma.firebaseapp.com",
  projectId: "organizador-norma",
  storageBucket: "organizador-norma.firebasestorage.app",
  messagingSenderId: "76160276766",
  appId: "1:76160276766:web:4d55fdeb5248e44279110f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, signInWithPopup, db };
