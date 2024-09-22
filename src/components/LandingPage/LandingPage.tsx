import * as React from 'react';
import { PaletteMode } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { motion, useScroll, useSpring } from "framer-motion"; // Import framer-motion
import AppAppBar from './AppAppBar';
import Hero from './Hero';
import LogoCollection from './LogoCollection';
import Highlights from './Highlights';
import Pricing from './Pricing';
import Student from './Student';
import University from './University';
import Testimonials from './Testimonials';
import FAQ from './FAQ';
import Footer from './Footer';
import getLPTheme from './getLPTheme';
import FeedbackButton from '../FeedbackButton/FeedbackButton';
import './Styles/LandingPageStyles.css'; // Ensure this CSS file includes the .progress-bar class

export default function LandingPage() {
  const [mode, setMode] = React.useState<PaletteMode>('dark');
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const LPtheme = createTheme(getLPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });

  const toggleColorMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Framer-motion scroll tracking
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <>
      {/* Progress Bar at the top */}
      <motion.div className="progress-bar" style={{ scaleX }} />

      <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
        <CssBaseline />
        <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />

        {/* Hero Section */}
        <Hero /> {/* Fix video box in hero */}
        <Box sx={{ bgcolor: 'background.default' }}>
          <LogoCollection />
          <Student />
          <Divider />
          <University />
          {/* <Divider />
          <Testimonials />
          <Divider />
          <Highlights />
          <Divider />
          <Pricing /> */}
          <Divider />
          {/* <FAQ /> */}
          <Divider />
          <Footer />
        </Box>
        {/* <FeedbackButton /> */}
      </ThemeProvider>
    </>
  );
}
