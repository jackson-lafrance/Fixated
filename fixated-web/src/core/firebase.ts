import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDLRLQcrtGcggkfc2YA-f5FgWonCZouCRM",
  authDomain: "fixated-47de3.firebaseapp.com",
  projectId: "fixated-47de3",
  storageBucket: "fixated-47de3.firebasestorage.app",
  messagingSenderId: "988883657339",
  appId: "1:988883657339:web:606471aad7b02060ee38de",
  measurementId: "G-D09YDPY073"
};

const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const auth = getAuth(app);
export const db = getFirestore(app);

