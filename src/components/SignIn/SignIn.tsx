import * as React from 'react';
import { Modal } from 'rsuite';
// import { useState } from 'react'; // Import useState here
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
import { useMediaQuery } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import { useUser } from '../../components/User/UserContext'; // User context
import CircularProgress from '@mui/material/CircularProgress';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';

import GoogleSignInButton from './OtherSignIn';
import ComingSoonSignIn from './ComingSoonSignIn';
import { analytics, logEvent } from '../../../firebaseConfig';
import Logo from '../Logo';
// import OnDemandFeedbackPopup from '../Feedback/OnDemandFeedback';


// Google SVG icon
function GoogleIcon() {
  return (
    <svg width="20px" height="20px" viewBox="0 0 48 48">
      {/* SVG paths */}
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


const defaultTheme = createTheme(); // This line is missing

export default function SignInSide() {
  const [error, setError] = React.useState<string | null>(null);
  const [emailError, setEmailError] = React.useState<string | null>(null); // Email validation error
  const [passwordError, setPasswordError] = React.useState<string | null>(null); // Password validation error
  const [loading, setLoading] = React.useState(false);
  const { setUser } = useUser();
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isComingSoonOpen, setIsComingSoonOpen] = React.useState(false);

  // const [isFeedbackPopupOpen, setFeedbackPopupOpen] = useState(false);



  // Email format validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // // Google sign-in
  // const handleGoogleSignIn = async () => {
  //   setLoading(true);
  //   try {
  //     const result = await signInWithPopup(auth, provider);
  //     const user = result.user;
  //     const token = await user.getIdToken();

  //     const response = await fetch(`${process.env.REACT_APP_API_URL}/google-login`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ token })
  //     });

  //     if (response.ok) {
  //       const result = await response.json();
  //       setUser({
  //         email: result.user.email,
  //         token: result.token,
  //         username: result.user.username
  //       });
  //       window.location.href = '/main';
  //     } else {
  //       setError('Google sign-in failed.');
  //     }
  //   } catch (error) {
  //     setError('Google sign-in failed.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Form submission and validation
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email') as string;
    const password = data.get('password') as string;

    // Validate input fields
    let valid = true;
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

    if (!valid) return; // Stop form submission if validation fails

    setLoading(true); // Start loading

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const result = await response.json();
        setUser({
          email: result.user.email,
          token: result.token,
          username: result.user.username,
          id: result.user.id
        });

        // if (result.user.feedbackTrigger) {
        //   setFeedbackPopupOpen(true); // Trigger the feedback popup
        //   await fetch(`${process.env.REACT_APP_API_URL}/api/users/disable-feedback`, {
        //     method: 'POST',
        //     headers: {
        //       'Content-Type': 'application/json',
        //       'Authorization': `Bearer ${result.token}`
        //     },
        //     body: JSON.stringify({ userId: result.user.id, feedbackTrigger: false })
        //   });
        // }



        logEvent(analytics, 'login', { method: 'Email' }); // Log the login event

        const plan = localStorage.getItem("pendingPlan");
        if (plan) {
          console.log("Pending Plan being passthrough", localStorage.getItem("pendingPlan"));
          window.location.href = `/checkout?plan=${plan}&email=${email}`;
          localStorage.removeItem("pendingPlan")
        } else {
          window.location.href = '/main';

        }
      } else {
        const errorMessage = await response.text();
        if (errorMessage.includes('Google account')) {
          setError('This email is associated with a Google account. Please sign in using Google.');
        } else {
          setError('Account not recognised. Please try again or sign up.');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ minHeight: '100vh', height: '100vh' }}>
        <CssBaseline />
        <Grid
          xs={false}
          sm={4}
          md={7}
          component={Paper}
          elevation={6}
          square
          sx={{
            background: 'linear-gradient(to bottom, #FF6200, #000000)',
            display: isSmallScreen ? 'none' : 'block',
            position: 'relative'
          }}
        >
        </Grid>

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
            <Box
              sx={{ mb: 2, cursor: 'pointer' }}
              onClick={() => { window.location.href = '/'; }}
            >
              <Logo
                style={{
                  width: '8vw',
                  height: '10vh'
                }}
              />
            </Box>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign In
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    error={!!emailError}
                    helperText={emailError}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 1,
                      px: 1,
                      py: 0.5,
                      backgroundColor: 'rgba(0,0,0,0.04)',
                      borderRadius: '6px',
                      color: 'text.secondary',
                      fontStyle: 'italic'
                    }}
                  >
                    📧 Email addresses are case sensitive
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"} // Conditionally toggle type
                    id="password"
                    autoComplete="current-password"
                    error={!!passwordError}
                    helperText={passwordError}
                    InputProps={{
                      endAdornment: (
                        <IconButton className="bar-icon-button"
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
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                  />
                  <Link href="/ForgotPassword" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
              </Grid>
              {error && (
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading} // Disable button while loading
              >
                {loading ? <CircularProgress size={24} /> : 'Sign In'}
              </Button>
              <Grid container spacing={2} justifyContent="center" sx={{ mt: 1 }}>
                <Grid item>
                  {/* <Button
                    variant="outlined"
                    startIcon={<GoogleIcon />}
                    onClick={handleGoogleSignIn}
                    sx={{
                      width: '200px',
                      borderRadius: '10px',
                      padding: '10px 0px',
                      textTransform: 'none',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                    disabled={loading} // Disable button while loading
                  >
                    {loading ? <CircularProgress size={24} /> : 'Sign in with Google'}
                  </Button> */}
                  <GoogleSignInButton setUser={setUser} setError={setError} setLoading={setLoading} /> {/* Add Google Sign-in Button */}

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
                  <Link href="/SignUp" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
      {/* <FeedbackButton /> */}
      <Modal
        open={isComingSoonOpen}
        onClose={() => setIsComingSoonOpen(false)}
        size="sm"
        className="custom-modal"

      >
        <Modal.Body>
          <ComingSoonSignIn onClose={() => setIsComingSoonOpen(false)} />
        </Modal.Body>
      </Modal>

      {/* <OnDemandFeedbackPopup
        show={isFeedbackPopupOpen}
        onClose={() => setFeedbackPopupOpen(false)}
      /> */}

    </ThemeProvider >
  );
}
