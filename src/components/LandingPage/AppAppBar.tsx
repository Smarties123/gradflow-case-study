import * as React from 'react';
import { PaletteMode } from '@mui/material';
import {
  AppBar,
  Toolbar,
  Box,
  Container,
  Button,
  Typography,
  MenuItem,
  Drawer,
  Divider,
  IconButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ToggleColorMode from './ToggleColorMode';
import LandingPageBrand from '../LandingPageBrand/LandingPageBrand';

const logoStyle = {
  width: { xs: 'auto', md: '140px' }, // Auto width for small screens, 140px for medium and larger
  height: 'auto',
  cursor: 'pointer'
};

interface AppAppBarProps {
  mode: PaletteMode;
  toggleColorMode: () => void;
}

function AppAppBar({ mode, toggleColorMode }: AppAppBarProps) {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const scrollToSection = (sectionId: string) => {
    const sectionElement = document.getElementById(sectionId);
    const offset = 128;
    if (sectionElement) {
      const targetScroll = sectionElement.offsetTop - offset;
      sectionElement.scrollIntoView({ behavior: 'smooth' });
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
      setOpen(false);
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 2,

      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          variant="regular"
          sx={theme => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingY: { xs: 1, md: 1.5 },
            bgcolor:
              theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(24px)',
            borderRadius: 50,
            boxShadow:
              theme.palette.mode === 'light'
                ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                : '0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)'
          })}
        >
          {/* Brand Logo */}
          <Box
            sx={{
              display: 'flex',
              flexGrow: 0.2,
              alignItems: 'center',
              justifyContent: { xs: 'center', md: 'start' }
            }}
          >
            <LandingPageBrand style={logoStyle} />
          </Box>

          {/* Centered Navigation */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              flexGrow: 2,
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: 3

            }}
          >
            {['Panel', 'Insights', 'FAQ'].map((section) => (
              <MenuItem
                key={section}
                onClick={() => scrollToSection(section.toLowerCase())}
                sx={{
                  transition: 'color 0.3s',
                  '&:hover': {
                    color: 'primary.main',
                    fontWeight: 'bold'
                  }
                }}
              >
                <Typography variant="body2">{section}</Typography>
              </MenuItem>
            ))}
          </Box>

          {/* Sign-in/Sign-up Buttons */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              justifyContent: 'end',
              flexGrow: 1,
              gap: 1
            }}
          >
            <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
            <Button
              color="primary"
              variant="text"
              size="small"
              href="/SignIn"
              sx={{ textTransform: 'none' }}
            >
              Sign In
            </Button>
            <Button
              color="primary"
              variant="contained"
              size="small"
              href="/SignUp"
              sx={{ textTransform: 'none' }}
            >
              Sign Up
            </Button>
          </Box>

          {/* Mobile Menu */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <IconButton color="primary" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={open}
              onClose={toggleDrawer(false)}
              sx={{
                '& .MuiDrawer-paper': {
                  width: '75%',
                  backgroundColor: 'background.paper',
                  padding: 2
                }
              }}
            >
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
              </Box>
              <Divider />
              {['Panel', 'Insights', 'FAQ'].map((section) => (
                <MenuItem
                  key={section}
                  onClick={() => scrollToSection(section.toLowerCase())}
                  sx={{
                    py: 1,
                    fontSize: '1rem',
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'action.hover'
                    }
                  }}
                >
                  {section}
                </MenuItem>
              ))}
              <Divider sx={{ my: 1 }} />
              <Box sx={{ mt: 2 }}>
                <Button
                  color="primary"
                  variant="contained"
                  fullWidth
                  href="/SignUp"
                  sx={{
                    textTransform: 'none',
                    fontSize: '1rem',
                    py: 1
                  }}
                >
                  Sign Up
                </Button>
                <Button
                  color="primary"
                  variant="outlined"
                  fullWidth
                  href="/SignIn"
                  sx={{
                    mt: 1,
                    textTransform: 'none',
                    fontSize: '1rem',
                    py: 1
                  }}
                >
                  Sign In
                </Button>
              </Box>
            </Drawer>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default AppAppBar;
