// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

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

// Get Auth and Provider instances
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
