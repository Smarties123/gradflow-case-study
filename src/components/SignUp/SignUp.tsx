import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material'; // For responsive layout
import SchoolIcon from '@mui/icons-material/School'; // University icon
import FeedbackButton from '../FeedbackButton/FeedbackButton'; // Feedback button
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';

import GoogleSignUpButton from './OtherSignUp'; // Adjust the path based on the folder structure

import { useUser } from '../../components/User/UserContext'; // User context
import Dialog from '@mui/material/Dialog';
import ComingSoonSignUp from './ComingSoonSignUp'; // Adjust path as needed
import { analytics, logEvent } from '../../../firebaseConfig'; // Adjust the path as needed


// Google SVG icon using official colors
function GoogleIcon() {
  return (
    <svg width="20px" height="20px" viewBox="0 0 48 48">
      <path
        fill="#EA4335"
        d="M24 46c5.4 0 10.3-1.8 14.1-4.8l-7.4-5.8c-2.2 1.4-4.9 2.3-7.7 2.3-6.6 0-12-4.5-14-10.7l-6.6 5.2C6.6 40.2 14.4 46 24 46z"
      />
      <path
        fill="#4285F4"
        d="M24 9.5c3.5 0 5.9 1.5 7.3 2.8l5.4-5.4C33.7 4.5 29.4 3 24 3 14.4 3 6.6 9.8 3.5 18.5l6.6 5.2C12 15 17.4 9.5 24 9.5z"
      />
      <path
        fill="#34A853"
        d="M46.5 24.5c0-1.7-.2-3.5-.6-5.2H24v10h12.7c-.5 2.7-2.3 5-4.7 6.5l7.4 5.8C43.6 37.7 46.5 31.7 46.5 24.5z"
      />
      <path
        fill="#FBBC05"
        d="M10.1 29.6c-1-2.7-1-5.6 0-8.2l-6.6-5.2c-2.8 5.6-2.8 12.3 0 17.9l6.6-5.2z"
      />
    </svg>
  );
}

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" target="_blank" rel="noopener noreferrer">
        HAD TECHNOLOGIES LTD
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignUp() {
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false); // Loading state
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [nameError, setNameError] = React.useState<string | null>(null);
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const [showPassword, setShowPassword] = React.useState(false);
  const [isComingSoonOpen, setIsComingSoonOpen] = React.useState(false);

  const { setUser } = useUser();  // Assuming you are using user context


  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6; // Password must be at least 6 characters
  };


  const checkIfUserExists = async (email: string, username: string) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/check-exists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username }),
      });
      const result = await response.json();
      return result; // Return an object { emailExists: boolean, usernameExists: boolean }
    } catch (error) {
      console.error('Error checking existing user:', error);
      return { emailExists: false, usernameExists: false };
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get('Name') as string;
    const email = data.get('email') as string;
    const password = data.get('password') as string;

    // Client-side validation
    let valid = true;
    if (!username) {
      setNameError('Name is required');
      valid = false;
    } else {
      setNameError(null);
    }

    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Invalid email format');
      valid = false;
    } else {
      setEmailError(null);
    }

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else {
      setPasswordError(null);
    }

    if (!valid) return;

    // Check if email or username already exists
    const { emailExists, usernameExists } = await checkIfUserExists(email, username);

    if (emailExists) {
      setEmailError('Email already exists.');
      return;
    }

    if (usernameExists) {
      setNameError('Username already exists.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem('authToken', result.token);
        setUser({
          email: result.user.email,
          token: result.token,
          username: result.user.username
        });
        localStorage.setItem('isNewUser', 'true');
        logEvent(analytics, 'sign_up', { method: 'Email' });
        window.location.href = '/main';
      } else {
        const errorMessage = await response.json(); // Parse the JSON error
        setError(errorMessage.message); // Show the exact message from the backend
      }
    } catch (err) {
      setError('An error occurred during signup. Please try again later.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ minHeight: '100vh', height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          component={Paper}
          elevation={6}
          square
          sx={{
            background: 'linear-gradient(to bottom, #FF6200, #000000)',
            display: isSmallScreen ? 'none' : 'block'
          }}
        />
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={6}
          square
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '100vh'
          }}
        >
          <Box
            sx={{
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign Up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              {loading ? ( // Show loading spinner
                <CircularProgress sx={{ m: 2 }} />
              ) : (
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        autoComplete="name"
                        name="Name"
                        required
                        fullWidth
                        id="Name"
                        label="Name"
                        autoFocus
                        error={!!nameError}
                        helperText={nameError}
                      />

                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        error={!!emailError}
                        helperText={emailError}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? "text" : "password"} // Conditionally toggle type
                        id="password"
                        autoComplete="new-password"
                        error={!!passwordError}
                        helperText={passwordError}
                        InputProps={{
                          endAdornment: (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)} // Toggle visibility
                              edge="end"
                            >
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          )
                        }}
                      />


                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={<Checkbox value="allowExtraEmails" color="primary" />}
                        label="I want to receive inspiration, marketing promotions and updates via email."
                      />
                    </Grid>
                  </Grid>
                  {error && (
                    <Typography color="error" variant="body2">
                      {error}
                    </Typography>
                  )}
                  <Grid item xs={12}>
                    <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                      By signing up, you agree to our{' '}
                      <Link href="/terms-and-conditions" target="_blank" rel="noopener noreferrer">
                        Terms and Conditions
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy-policy-GDPR" target="_blank" rel="noopener noreferrer">
                        Privacy Policy
                      </Link>.
                    </Typography>
                  </Grid>
                  <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                    Sign Up
                  </Button>
                  <Grid container spacing={2} justifyContent="center" sx={{ mt: 1 }}>
                    <Grid item>
                      {/* <Button
                        variant="outlined"
                        startIcon={<GoogleIcon />}
                        sx={{
                          width: '200px',
                          borderRadius: '10px',
                          padding: '10px 0px',
                          textTransform: 'none',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      >
                        Sign up with Google
                      </Button> */}
                      <GoogleSignUpButton setUser={setUser} setError={setError} setLoading={setLoading} />  {/* Pass setLoading, setError, setUser */}

                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        startIcon={<SchoolIcon sx={{ color: 'purple' }} />}
                        sx={{
                          width: '200px',
                          borderRadius: '10px',
                          padding: '10px 0px',
                          textTransform: 'none',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                        onClick={() => setIsComingSoonOpen(true)} // Open popup
                      >
                        Sign in with University
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
                    <Grid item>
                      <Link href="/SignIn" variant="body2">
                        Already have an account? Sign in
                      </Link>
                    </Grid>
                  </Grid>
                </>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
      {/* <FeedbackButton /> */}
      <Dialog open={isComingSoonOpen} onClose={() => setIsComingSoonOpen(false)} fullWidth maxWidth="sm">
        <ComingSoonSignUp />
      </Dialog>
    </ThemeProvider>
  );
}
