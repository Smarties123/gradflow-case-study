// OtherSignIn.tsx
import { auth, provider } from '../../../firebaseConfig';
import { signInWithPopup } from "firebase/auth";
import React from 'react';
import Button from '@mui/material/Button';
import GoogleIcon from '@mui/icons-material/Google';

const sendUserDataToBackend = async (user: any) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/google-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        firebaseUid: user.uid,
        profilePicture: user.photoURL
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send user data to backend');
    }

    return await response.json(); // Return response to handle in frontend
  } catch (err) {
    console.error('Error sending user data to backend:', err);
    throw err;
  }
};

// Google sign-in handler
export const handleGoogleSignin = async (setUser: any, setError: any, setLoading: any) => {
  setLoading(true);
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const backendResult = await sendUserDataToBackend(user);

    if (backendResult && backendResult.token) {
      setUser({
        email: backendResult.user.email,
        token: backendResult.token,
        username: backendResult.user.username,
      });
      window.location.href = '/main';
    }
  } catch (error) {
    setError('Google sign-in failed. Please try again.');
  } finally {
    setLoading(false);
  }
};

// GoogleSignInButton Component
const GoogleSignInButton = ({ setUser, setError, setLoading }) => {
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
      onClick={() => handleGoogleSignin(setUser, setError, setLoading)}
    >
      Sign in with Google
    </Button>
  );
};

export default GoogleSignInButton;
