import { auth, provider } from '../../../firebaseConfig'; // Adjust path as needed
import { signInWithPopup } from "firebase/auth";
import React from 'react';
import Button from '@mui/material/Button';
import GoogleIcon from '@mui/icons-material/Google';
import { analytics, logEvent } from '../../../firebaseConfig'; // Adjust the path as needed


// Function to send user data to AWS backend
// Function to send user data to AWS backend
const sendUserDataToBackend = async (user: any) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/google-signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: user.displayName,
        email: user.email,
        firebaseUid: user.uid,
        profilePicture: user.photoURL
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send user data to backend');
    }

    // Return the response as JSON (assume it contains the JWT token)
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error sending user data to backend:', err);
    throw err;
  }
};


// Google sign-up handler
// Google sign-up handler
// Google sign-up handler
export const handleGoogleSignup = async (setUser, setError, setLoading) => {
  setLoading(true);  // Start loading
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Send user data to the backend and get the token
    const backendResult = await sendUserDataToBackend(user);

    if (backendResult && backendResult.token) {
      // Store the token in localStorage or wherever you prefer
      localStorage.setItem('token', backendResult.token);

      // Update the user state in your application
      setUser({
        email: user.email,
        username: user.displayName,
        token: backendResult.token,
      });
      // for tutorial purposes
      localStorage.setItem('isNewUser', 'true');


      // Redirect to the main page
      logEvent(analytics, 'sign_up', { method: 'Google' }); // Log Google sign-up event
      logEvent(analytics, 'login', { method: 'Google' }); // Log Google login event
      window.location.href = '/main';
    }
  } catch (error) {
    setError('Google sign-up failed. Please try again.');
  } finally {
    setLoading(false);  // Stop loading
  }
};




// GoogleSignUpButton Component
const GoogleSignUpButton = ({ setUser, setError, setLoading }) => {
  return (
    <Button
      variant="outlined"
      startIcon={<GoogleIcon />}
      sx={{
        width: '200px',
        borderRadius: '10px',
        padding: '10px 0px',
        textTransform: 'none',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
      onClick={() => handleGoogleSignup(setUser, setError, setLoading)}  // Pass the props to handleGoogleSignup
    >
      Sign up with Google
    </Button>
  );
};

export default GoogleSignUpButton;
