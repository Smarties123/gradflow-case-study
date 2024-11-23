import * as React from 'react';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  Paper,
  IconButton,
  CircularProgress,
  Dialog,
} from '@mui/material';
import { createTheme, ThemeProvider, useMediaQuery } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import SchoolIcon from '@mui/icons-material/School';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import FeedbackButton from '../FeedbackButton/FeedbackButton';
import GoogleSignUpButton from './OtherSignUp';
import { useUser } from '../../components/User/UserContext';
import ComingSoonSignUp from './ComingSoonSignUp';
import { analytics, logEvent } from '../../../firebaseConfig';

function GoogleIcon() {
  return (
    <svg width="20px" height="20px" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 46c5.4 0 10.3-1.8 14.1-4.8l-7.4-5.8c-2.2 1.4-4.9 2.3-7.7 2.3-6.6 0-12-4.5-14-10.7l-6.6 5.2C6.6 40.2 14.4 46 24 46z" />
      <path fill="#4285F4" d="M24 9.5c3.5 0 5.9 1.5 7.3 2.8l5.4-5.4C33.7 4.5 29.4 3 24 3 14.4 3 6.6 9.8 3.5 18.5l6.6 5.2C12 15 17.4 9.5 24 9.5z" />
      <path fill="#34A853" d="M46.5 24.5c0-1.7-.2-3.5-.6-5.2H24v10h12.7c-.5 2.7-2.3 5-4.7 6.5l7.4 5.8C43.6 37.7 46.5 31.7 46.5 24.5z" />
      <path fill="#FBBC05" d="M10.1 29.6c-1-2.7-1-5.6 0-8.2l-6.6-5.2c-2.8 5.6-2.8 12.3 0 17.9l6.6-5.2z" />
    </svg>
  );
}

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link
        color="inherit"
        href="https://find-and-update.company-information.service.gov.uk/company/16020364"
        target="_blank"
        rel="noopener noreferrer"
      >
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
  const [loading, setLoading] = React.useState<boolean>(false);
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [infoMessage, setInfoMessage] = React.useState<string | null>(null);
  const [nameError, setNameError] = React.useState<string | null>(null);
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isComingSoonOpen, setIsComingSoonOpen] = React.useState(false);
  const { setUser } = useUser();

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password: string) => password.length >= 6;

  const checkIfUserExists = async (email: string, username: string) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/check-exists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username }),
      });
      return await response.json();
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
        setUser({ email: result.user.email, token: result.token, username: result.user.username });
        localStorage.setItem('isNewUser', 'true');
        setInfoMessage('Signup successful! Please check your email to verify your account.');
        logEvent(analytics, 'sign_up', { method: 'Email' });
      } else {
        const errorMessage = await response.json();
        setError(errorMessage.message);
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
            display: isSmallScreen ? 'none' : 'block',
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
            minHeight: '100vh',
          }}
        >
          <Box sx={{ mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign Up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              {loading ? (
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
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="new-password"
                        error={!!passwordError}
                        helperText={passwordError}
                        InputProps={{
                          endAdornment: (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={<Checkbox value="allowExtraEmails" color="primary" />}
                        label="I want to receive inspiration, marketing promotions and updates via email."
                      />
                    </Grid>
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
                  </Grid>
                  {infoMessage && (
                    <Typography color="primary" variant="body2" sx={{ mt: 2 }}>
                      {infoMessage}
                    </Typography>
                  )}
                  {error && (
                    <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                      {error}
                    </Typography>
                  )}
                  <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                    Sign Up
                  </Button>
                  <Grid container spacing={2} justifyContent="center" sx={{ mt: 1 }}>
                    <Grid item>
                      <GoogleSignUpButton setUser={setUser} setError={setError} setLoading={setLoading} />
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
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        }}
                        onClick={() => setIsComingSoonOpen(true)}
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
      <Dialog open={isComingSoonOpen} onClose={() => setIsComingSoonOpen(false)} fullWidth maxWidth="sm">
        <ComingSoonSignUp />
      </Dialog>
    </ThemeProvider>
  );
}
