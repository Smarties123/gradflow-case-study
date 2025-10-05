import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Link from '@mui/material/Link';
import { Container, Typography, Box, Alert, CircularProgress } from '@mui/material';

const VerifyUser = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [verificationError, setVerificationError] = React.useState<string | null>(null);
  const [verifying, setVerifying] = useState(true);

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    const verify = async () => {


      if (!token || !email) {
        setError('Invalid or missing verification details.');
        setVerifying(false);
        return;
      }

      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/verify-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token, email }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Verification failed.');
        }

        setMessage(data.message || 'Account verified successfully!');
        localStorage.setItem('isNewUser', 'true');
        setTimeout(() => navigate('/SignIn'), 2000);
      } catch (err) {
         setVerificationError('not_verified');

      } finally {
        setVerifying(false);
      }
    };

    verify();
  }, [searchParams, navigate]);

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Email Verification
      </Typography>

      {verifying ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      ) : (
        <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>
      )}
      {verificationError === 'not_verified' && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          Your Account Is Still Not Verified. THe link provided earlier may have expired.
          <Link href={`/resend-verification?email=${encodeURIComponent(email ?? '')}`} sx={{ color: '#1976d2' }}>
            Please click here to receive a verification email
          </Link>.
        </Typography>
      )}
    </Container>
  );
};

export default VerifyUser;
