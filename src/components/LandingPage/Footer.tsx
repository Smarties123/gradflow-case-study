import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import LandingPageBrand from '../LandingPageBrand/LandingPageBrand';
import { SocialIcon } from 'react-social-icons';

function Copyright() {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{
        fontSize: '0.875rem',
        opacity: 0.8,
      }}
    >
      © {new Date().getFullYear()}{' '}
      <Link
        href="https://hadtechnologies.org"
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          color: 'text.secondary',
          textDecoration: 'none',
          '&:hover': {
            color: '#FF6200',
            textDecoration: 'underline',
          },
        }}
      >
        HAD Technologies Ltd
      </Link>
      . All rights reserved.
    </Typography>
  );
}

export default function Footer() {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        backgroundColor: theme.palette.mode === 'dark'
          ? 'rgba(9, 14, 16, 0.8)'
          : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderTop: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 98, 0, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
        mt: 8,
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Grid container spacing={{ xs: 4, md: 6 }}>
          {/* Brand and Description */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ mb: 2 }}>
                <LandingPageBrand />
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ 
                  lineHeight: 1.7,
                  maxWidth: '300px',
                }}
              >
                Empowering students to track, manage, and succeed in their job applications.
                Built by students, for students.
              </Typography>
            </Box>

            {/* Social Media */}
            <Box>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ mb: 2, color: 'text.primary' }}
              >
                Follow Us
              </Typography>
              <Stack direction="row" spacing={1.5}>
                <SocialIcon
                  style={{
                    maxWidth: "32px",
                    maxHeight: "32px",
                    cursor: "pointer",
                  }} 
                  network="linkedin"
                  onClick={() => window.open("https://www.linkedin.com/company/gradflow-inc/?viewAsMember=true", "_blank")} 
                />
                <SocialIcon
                  style={{
                    maxWidth: "32px",
                    maxHeight: "32px",
                    cursor: "pointer",
                  }}
                  network="instagram"
                  onClick={() => window.open("https://www.instagram.com/gradflowinc/", "_blank")}
                />
                <SocialIcon
                  style={{
                    maxWidth: "32px",
                    maxHeight: "32px",
                    cursor: "pointer",
                  }}
                  network="tiktok"
                  onClick={() => window.open("https://www.tiktok.com/@gradflow", "_blank")}
                />
              </Stack>
            </Box>
          </Grid>

          {/* Product Links */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              sx={{ mb: 2, color: 'text.primary' }}
            >
              Product
            </Typography>
            <Stack spacing={1.5}>
              <Link
                href="#terminal"
                color="text.secondary"
                underline="none"
                sx={{
                  fontSize: '0.875rem',
                  transition: 'color 0.2s',
                  '&:hover': {
                    color: '#FF6200',
                  },
                }}
              >
                Terminal
              </Link>
              <Link
                href="#insights"
                color="text.secondary"
                underline="none"
                sx={{
                  fontSize: '0.875rem',
                  transition: 'color 0.2s',
                  '&:hover': {
                    color: '#FF6200',
                  },
                }}
              >
                Insights
              </Link>
              <Link
                href="#testimonials"
                color="text.secondary"
                underline="none"
                sx={{
                  fontSize: '0.875rem',
                  transition: 'color 0.2s',
                  '&:hover': {
                    color: '#FF6200',
                  },
                }}
              >
                Testimonials
              </Link>
              <Link
                href="#faq"
                color="text.secondary"
                underline="none"
                sx={{
                  fontSize: '0.875rem',
                  transition: 'color 0.2s',
                  '&:hover': {
                    color: '#FF6200',
                  },
                }}
              >
                FAQs
              </Link>
            </Stack>
          </Grid>

          {/* Company Links */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              sx={{ mb: 2, color: 'text.primary' }}
            >
              Company
            </Typography>
            <Stack spacing={1.5}>
              <Link
                href="/AboutUs"
                color="text.secondary"
                underline="none"
                sx={{
                  fontSize: '0.875rem',
                  transition: 'color 0.2s',
                  '&:hover': {
                    color: '#FF6200',
                  },
                }}
              >
                About Us
              </Link>
              <Link
                href="/case-study"
                color="text.secondary"
                underline="none"
                sx={{
                  fontSize: '0.875rem',
                  transition: 'color 0.2s',
                  '&:hover': {
                    color: '#FF6200',
                  },
                }}
              >
                Case Study
              </Link>
              <Link
                href="https://hadtechnologies.org"
                target="_blank"
                rel="noopener noreferrer"
                color="text.secondary"
                underline="none"
                sx={{
                  fontSize: '0.875rem',
                  transition: 'color 0.2s',
                  '&:hover': {
                    color: '#FF6200',
                  },
                }}
              >
                HAD Technologies
              </Link>
            </Stack>
          </Grid>

          {/* Legal Links */}
          <Grid item xs={12} sm={4} md={2}>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              sx={{ mb: 2, color: 'text.primary' }}
            >
              Legal
            </Typography>
            <Stack spacing={1.5}>
              <Link
                href="/terms-and-conditions"
                color="text.secondary"
                underline="none"
                sx={{
                  fontSize: '0.875rem',
                  transition: 'color 0.2s',
                  '&:hover': {
                    color: '#FF6200',
                  },
                }}
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy-policy-GDPR"
                target="_blank"
                rel="noopener noreferrer"
                color="text.secondary"
                underline="none"
                sx={{
                  fontSize: '0.875rem',
                  transition: 'color 0.2s',
                  '&:hover': {
                    color: '#FF6200',
                  },
                }}
              >
                Privacy Policy
              </Link>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 98, 0, 0.1)' : 'rgba(0, 0, 0, 0.1)' }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
          }}
        >
          <Box>
            <Copyright />
            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', opacity: 0.7 }}>
                Powered by
              </Typography>
              <Box
                component="img"
                src="/Images/HadTechnologiesLogo.svg"
                alt="HAD Technologies"
                onClick={() => window.open('https://hadtechnologies.org/', '_blank')}
                sx={{
                  height: '20px',
                  cursor: 'pointer',
                  opacity: 0.8,
                  transition: 'opacity 0.2s',
                  '&:hover': {
                    opacity: 1,
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}