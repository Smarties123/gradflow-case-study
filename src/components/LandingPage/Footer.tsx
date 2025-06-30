import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LandingPageBrand from '../LandingPageBrand/LandingPageBrand';
import { SocialIcon } from 'react-social-icons';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" mt={1}>
      {'Copyright © '}
      HAD TECHNOLOGIES LTD 2025
    </Typography>
  );
}

export default function Footer() {
  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 4, sm: 8 },
        py: { xs: 8, sm: 10 },
        textAlign: { sm: 'center', md: 'left' },
        // Force reset any inherited styles
        color: 'inherit !important',
        backgroundColor: 'transparent !important',
        // Create a new stacking context
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Main footer content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          width: '100%',
          justifyContent: 'space-between'
        }}
      >
        {/* Newsletter section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            minWidth: { xs: '100%', sm: '60%' }
          }}
        >
          <Box sx={{ width: { xs: '100%', sm: '60%' } }}>
            <Box sx={{ ml: '-15px', mb: '10px' }}>
              <LandingPageBrand />
            </Box>
            <Typography variant="body2" fontWeight={600} gutterBottom sx={{ color: 'text.primary' }}>
              Newsletter
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Subscribe to our newsletter for weekly updates and promotions.
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 2, sm: 3, md: 2 }}
              useFlexGap
            >
              <TextField
                id="outlined-email"
                hiddenLabel
                size="small"
                variant="outlined"
                fullWidth
                placeholder="Your email address"
                inputProps={{
                  autoComplete: 'off',
                  'aria-label': 'Enter your email address',
                }}
              />
              <Button
                variant="contained"
                color="primary"
                sx={{ flexShrink: 0, width: { xs: '100%', sm: 'auto' } }}
              >
                Subscribe
              </Button>
            </Stack>
          </Box>
        </Box>

        {/* Links sections */}
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            gap: 1
          }}
        >
          <Typography
            variant="subtitle2"
            fontWeight={600}
            sx={{ color: 'text.primary' }} // Explicitly set color
          >
            Product
          </Typography>
          <Link color="text.secondary" href="#terminal">
            Terminal
          </Link>
          <Link color="text.secondary" href="#insights">
            Insights
          </Link>
          <Link color="text.secondary" href="#testimonials">
            Testimonials
          </Link>
          <Link color="text.secondary" href="#faq">
            FAQs
          </Link>
        </Box>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            gap: 1
          }}
        >
          <Typography
            component="text"
            variant="subtitle2"
            fontWeight={600}
            sx={{ color: 'text.primary' }} // Explicitly set color
          >
            Company
          </Typography>
          <Link color="text.secondary" href="/AboutUs">
            About us
          </Link>
          <Link color="text.secondary" href="#">
            Careers
          </Link>
          <Link color="text.secondary" href="#">
            Press
          </Link>
        </Box>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            gap: 1
          }}
        >
          <Typography
            variant="subtitle2"
            fontWeight={600}
            sx={{ color: 'text.primary' }} // Explicitly set color
          >
            Legal
          </Typography>
          <Link color="text.secondary" href="/terms-and-conditions">
            Terms
          </Link>
          <Link color="text.secondary" href="/terms-and-conditions">
            Contact
          </Link>
        </Box>
      </Box>

      {/* Bottom section with privacy, terms, copyright, social icons, and Trustpilot */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pt: { xs: 4, sm: 8 },
          width: '100%',
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        {/* Left side links */}
        <Box>
          <Link href="/privacy-policy-GDPR" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </Link>
          <Typography display="inline" sx={{ mx: 0.5, opacity: 0.5 }}>
            •
          </Typography>
          <Link color="text.secondary" target="_blank" href="/terms-and-conditions">
            Terms of Service
          </Link>

          <Box component="div" className="footer-powered-by" sx={{ mt: 1 }}>
            <Typography variant="body2" className="powered-by-text" sx={{ color: 'text.secondary' }}>
              Powered by
            </Typography>
            <img
              src="https://d3htrhw57y4gd1.cloudfront.net/logo.svg"
              alt="GradFlow Logo"
              className="footer-logo"
              onClick={() => window.open('https://hadtechnologies.org/', '_blank')}
              style={{ cursor: 'pointer' }}
            />
          </Box>
          <Copyright />
        </Box>

        {/* Right side: social icons + Trustpilot */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SocialIcon
            style={{ maxWidth: '35px', maxHeight: '35px', cursor: 'pointer' }}
            network="linkedin"
            onClick={() => window.open('https://www.linkedin.com/company/gradflow-inc/?viewAsMember=true', '_blank')}
          />
          <SocialIcon
            style={{ maxWidth: '35px', maxHeight: '35px', cursor: 'pointer' }}
            network="instagram"
            onClick={() => window.open('https://www.instagram.com/gradflowinc/', '_blank')}
          />
          <SocialIcon
            style={{ maxWidth: '35px', maxHeight: '35px', cursor: 'pointer' }}
            network="tiktok"
            onClick={() => window.open('https://www.tiktok.com/@gradflow', '_blank')}
          />
        </Box>
      </Box>
    </Container>
  );
}