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

// Google SVG icon using official colors
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

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignUp() {
  const [error, setError] = React.useState<string | null>(null);
  const isSmallScreen = useMediaQuery('(max-width:600px)'); // Media query for small screens

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userData = {
      username: data.get('Name'),
      email: data.get('email'),
      password: data.get('password'),
    };

    try {
      const response = await fetch('http://localhost:3001/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Signup successful:', result);
        window.location.href = '/main'; // Redirect to main page upon successful signup
      } else {
        const errorMessage = await response.text();
        setError(errorMessage);
        console.error('Signup failed:', errorMessage);
      }
    } catch (err) {
      setError('An error occurred during signup. Please try again later.');
      console.error('Signup error:', err);
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
            display: isSmallScreen ? 'none' : 'block', // Hide on small screens
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
          <Box
            sx={{
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
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
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
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
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container spacing={2} justifyContent="center" sx={{ mt: 1 }}>
                <Grid item>
                  <Button
                    variant="outlined"
                    startIcon={<GoogleIcon />} // Custom Google Icon
                    sx={{
                      width: '200px',
                      borderRadius: '10px',
                      padding: '10px 0px',
                      textTransform: 'none',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                  >
                    Sign up with Google
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    startIcon={<SchoolIcon sx={{ color: 'purple' }} />} // Purple School Icon
                    sx={{
                      width: '200px',
                      borderRadius: '10px',
                      padding: '10px 0px',
                      textTransform: 'none',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                  >
                    Sign up with University
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
            </Box>
          </Box>
        </Grid>
      </Grid>
      <FeedbackButton />
    </ThemeProvider>
  );
}
