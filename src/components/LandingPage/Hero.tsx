import * as React from 'react';
import { alpha, keyframes } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';

// Define keyframes for the animation
const fadeSlideIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

export default function Hero() {
  const text = 'Your one-stop platform to manage, track and succeed in all your applications'.split(
    ' '
  );

  return (
    <Box
      id="hero"
      sx={theme => ({
        width: '100%',
        backgroundImage:
          theme.palette.mode === 'light'
            ? 'linear-gradient(180deg, #CEE5FD, #FFF)'
            : `linear-gradient(#02294F, ${alpha('#090E10', 0.0)})`,
        backgroundSize: '100% 20%',
        backgroundRepeat: 'no-repeat'
      })}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 }
        }}
      >
        <Stack spacing={2} useFlexGap sx={{ width: { xs: '100%', sm: '70%' } }}>
          <Typography
            variant="h1"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignSelf: 'center',
              textAlign: 'center',
              fontSize: 'clamp(3.5rem, 10vw, 4rem)',
              animation: `${fadeSlideIn} 1.2s ease-out` // Apply animation
            }}
          >
            Track Apply&nbsp;
            <Typography
              component="span"
              variant="h1"
              sx={{
                fontSize: 'clamp(3rem, 10vw, 4rem)',
                color: theme => (theme.palette.mode === 'light' ? 'primary.main' : 'primary.light'),
                animation: `${fadeSlideIn} 1.5s ease-out` // Apply animation with delay
              }}
            >
              Succeed
            </Typography>
          </Typography>

          <Typography
            textAlign="center"
            color="text.secondary"
            sx={{ alignSelf: 'center', width: { sm: '100%', md: '80%' } }}
          >
            {text.map((el, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.5, // Increased duration for slower fade-in
                  delay: i * 0.3 // Increased delay for a more gradual appearance
                }}
              >
                {el}{' '}
              </motion.span>
            ))}
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignSelf="center"
            spacing={1}
            useFlexGap
            sx={{ pt: 2, width: { xs: '100%', sm: 'auto' } }}
          >
            <Button variant="contained" color="primary" href="/signup">
            Sign Up for Free
            </Button>
          </Stack>
          <Typography variant="caption" textAlign="center" sx={{ opacity: 0.8 }}>
            By &quot;Signing up&quot; you agree to our&nbsp;
            <Link href="/terms-and-conditions" color="primary" target="_blank" rel="noopener noreferrer">
              Terms & Conditions
            </Link>
            .
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
