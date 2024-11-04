import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const token = new URLSearchParams(location.search).get('token');

  useEffect(() => {
    async function verifyUser() {
      if (!token) {
        setStatusMessage("Invalid or missing token.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/confirm-signup/${token}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          setStatusMessage("Your email has been verified successfully! You will be redirected shortly.");
          setTimeout(() => navigate('/signin'), 3000); // Redirect after 3 seconds
        } else {
          const result = await response.json();
          setStatusMessage(result.message || "Verification failed. Please try again.");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatusMessage("An error occurred. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    verifyUser();
  }, [token, navigate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Typography variant="h6" color={statusMessage.includes("successfully") ? "primary" : "error"}>
            {statusMessage}
          </Typography>
          {statusMessage.includes("successfully") && (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              If you are not redirected, click <Link to="/signin">here</Link> to proceed to the login page.
            </Typography>
          )}
        </>
      )}
    </div>
  );
}

export default VerifyEmail;
