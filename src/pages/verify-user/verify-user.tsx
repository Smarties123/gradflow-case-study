import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Alert, CircularProgress } from '@mui/material';

const VerifyUser = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get('token');
      const email = searchParams.get('email');

      if (!token || !email) {
        setError('Invalid or missing verification details.');
        setVerifying(false);
        return;
      }

      try {
        console.log(email);
        console.log(token);
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
        setError(err.message);
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
    </Container>
  );
};

export default VerifyUser;
