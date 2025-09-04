import * as React from 'react';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Dialog
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import Logo from '@/components/Logo';

const theme = createTheme();

export default function ResendVerification() {
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const [searchParams] = useSearchParams();
  React.useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/resend-verification-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`A new verification email has been sent to ${email}.`);
      } else {
        setError(data.message || 'An error occurred.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ minHeight: '100vh' }}>
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
            <Box sx={{ mb: 2, cursor: 'pointer' }} onClick={() => (window.location.href = '/')}>
              <Logo style={{ width: '120px', height: '60px' }} />
            </Box>
            <Typography component="h1" variant="h5">
              Resend Verification Email
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              {message ? (
                <Typography variant="h6" color="success.main" sx={{ mb: 2 }}>
                  {message}
                </Typography>
              ) : (
                <>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {error && (
                    <Typography color="error" variant="body2">
                      {error}
                    </Typography>
                  )}
                  {loading ? (
                    <CircularProgress sx={{ mt: 2 }} />
                  ) : (
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                      Resend Verification Email
                    </Button>
                  )}
                  <Grid container justifyContent="flex-end">
                    <Grid item>
                      <Link href="/SignIn" variant="body2">
                        Back to Sign In
                      </Link>
                    </Grid>
                  </Grid>
                </>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
