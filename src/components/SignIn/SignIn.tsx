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
import { useMediaQuery } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import FeedbackButton from '../FeedbackButton/FeedbackButton';
import { useUser } from '../../components/User/UserContext'; // User context
import { auth, provider } from '../../../firebaseConfig'; // Import your Firebase config
import { signInWithPopup } from 'firebase/auth';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress

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
      <Link color="inherit" href="/terms-and-conditions" target="_blank" rel="noopener noreferrer">
        HADinc
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignInSide() {
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false); // Loading state
  const { setUser } = useUser(); // Accessing the user context
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const handleGoogleSignIn = async () => {
    setLoading(true); // Start loading
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      const response = await fetch(`${process.env.REACT_APP_API_URL}/google-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });

      if (response.ok) {
        const result = await response.json();
        setUser({
          email: result.user.email,
          token: result.token,
          username: result.user.username
        });
        window.location.href = '/main';
      } else {
        setError('Google sign-in failed.');
      }
    } catch (error) {
      setError('Google sign-in failed.');
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userData = {
      email: data.get('email'),
      password: data.get('password')
    };
    setLoading(true); // Start loading

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        const result = await response.json();
        const { token, user } = result;

        setUser({
          email: user.email as string,
          token: token,
          username: user.id
        });
        window.location.href = '/main';
      } else {
        const errorMessage = await response.text();
        setError(errorMessage);
      }
    } catch (err) {
      setError('An error occurred during login. Please try again later.');
    } finally {
      setLoading(false); // End loading
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
              Sign in
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
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
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
                  <Button
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
                  </Button>
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
      <FeedbackButton />
    </ThemeProvider>
  );
}
