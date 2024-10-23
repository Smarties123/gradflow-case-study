// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics, logEvent } from "firebase/analytics"; // Import analytics

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC-G_U_O0-HSEoYOfRymXd9pxIPaivI5NQ",
    authDomain: "gradflow2-a74cd.firebaseapp.com",
    projectId: "gradflow2-a74cd",
    storageBucket: "gradflow2-a74cd.appspot.com",
    messagingSenderId: "83557003613",
    appId: "1:83557003613:web:1d47e2fcf4633b102bb8b4",
    measurementId: "G-FSC58746EQ"
};

// Initialize Firebase once
const app = initializeApp(firebaseConfig);

// Initialize Analytics
const analytics = getAnalytics(app);

// Get Auth and Provider instances
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Optional: Log an initial event (e.g., app_open)
logEvent(analytics, 'app_open');

export { auth, provider, analytics, logEvent }; // Export analytics
