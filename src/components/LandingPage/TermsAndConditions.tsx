import React from 'react';
import { Box, Container, Typography, Stack } from '@mui/material';

const TermsAndConditions = () => {
  return (
    <Box sx={{ bgcolor: '#101319', color: 'white', py: 5 }}>
      <Container maxWidth="md">
        <Typography variant="h3" align="center" gutterBottom sx={{ color: '#ff6200' }}>
          Terms and Conditions
        </Typography>

        <Typography variant="body1" paragraph>
          Last Updated: 23/09/2024
        </Typography>

        <Typography variant="body1" paragraph>
          Welcome to GradFlow! By using our website, located at&nbsp;
          <a href="http://gradflow.org/" style={{ color: '#ff6200' }}>
            gradflow.org
          </a>, you agree to these Terms and Conditions.
        </Typography>

        <Stack spacing={2}>
          <Typography variant="h6">1. Introduction</Typography>
          <Typography variant="body1">
            These Terms and Conditions govern your use of GradFlow and our subscription services. By accessing or using our website and services, you agree to abide by these terms. If you disagree with any part of the terms, you must discontinue use of the site. GradFlow is solely owned and operated by <strong>HAD TECHNOLOGIES LTD</strong>.
          </Typography>

          <Typography variant="h6">2. Subscription Service</Typography>
          <Typography variant="body1">
            GradFlow offers a subscription service that provides enhanced functionality and features for managing your application process. The subscription fees, terms, and conditions for accessing these services will be provided at the time of your subscription.
          </Typography>

          <Typography variant="h6">3. Prohibited Activities</Typography>
          <Typography variant="body1">
            You agree not to engage in the following activities:
          </Typography>
          <Typography variant="body1" sx={{ ml: 2 }}>
            • <strong>Use of Services for Advertising:</strong> You may not use GradFlow to advertise or offer to sell any goods or services.
          </Typography>
          <Typography variant="body1" sx={{ ml: 2 }}>
            • <strong>Transfer or Sale of Profile:</strong> You are prohibited from selling or otherwise transferring your profile or account to another party.
          </Typography>

          <Typography variant="h6">4. Account and Registration</Typography>
          <Typography variant="body1">
            You are responsible for ensuring that the information you provide during registration is accurate and up-to-date. You are also responsible for safeguarding your account credentials and for all activity under your account.
          </Typography>

          <Typography variant="h6">5. Dispute Resolution</Typography>
          <Typography variant="body1">
            Any disputes arising under these Terms will first be attempted to be resolved through <strong>informal negotiations</strong>. If a resolution cannot be reached within 30 days, the dispute will be settled by <strong>arbitration</strong> in the <strong>United Kingdom</strong>. Both parties agree to the 30-day negotiation period before initiating arbitration proceedings.
          </Typography>

          <Typography variant="h6">6. Governing Law</Typography>
          <Typography variant="body1">
            These Terms and Conditions, and any disputes relating to the services provided by GradFlow, are governed by the laws of the <strong>United Kingdom</strong>. You agree that UK law will apply to the interpretation and enforcement of these Terms.
          </Typography>

          <Typography variant="h6">7. Limitation of Liability</Typography>
          <Typography variant="body1">
            GradFlow, including its employees, directors, and affiliates, is not liable for any indirect, incidental, or consequential damages arising from your use of our service.
          </Typography>

          <Typography variant="h6">8. Modifications to Terms</Typography>
          <Typography variant="body1">
            We reserve the right to modify these terms at any time. When we do, we will revise the date at the top of the page. It is your responsibility to check these terms periodically for updates.
          </Typography>

          <Typography variant="h6">9. Termination</Typography>
          <Typography variant="body1">
            We reserve the right to suspend or terminate your account at any time, with or without cause, including for violations of these Terms.
          </Typography>

          <Typography variant="h6">10. No SMS Service</Typography>
          <Typography variant="body1">
            GradFlow does not use SMS for communication or notifications. Any official communication will be carried out through email or other digital means.
          </Typography>

          <Typography variant="h6">11. Contact Us</Typography>
          <Typography variant="body1">
            If you have any questions or concerns about these Terms and Conditions, please contact us at <a href="mailto:gradflowinc@gmail.com" style={{ color: '#ff6200' }}>gradflowinc@gmail.com</a>.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default TermsAndConditions;
