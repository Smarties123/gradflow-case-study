import * as React from 'react';
import { useState, useEffect } from 'react';
import { PaletteMode } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { motion, useScroll, useSpring } from 'framer-motion';

import AppAppBar from './AppAppBar';
import Hero from './Hero';
import getLPTheme from './getLPTheme';
import './Styles/LandingPageStyles.css';
import Box from '@mui/material/Box';
import LogoCollection from './LogoCollection';
import Panel from './Panel';
import Insights from './Insights';
import Testimonials from './Testimonials';
import { Divider } from '@mui/material';
import Highlights from './Highlights';
import Footer from './Footer';
import FeedbackButton from '../../components/FeedbackButton/FeedbackButton'; // Adjust path if needed
import Pricing from './Pricing';
import FAQ from './FAQ';

export default function LandingPage() {
  const [mode, setMode] = React.useState<PaletteMode>('dark');

  const LPtheme = createTheme(getLPTheme(mode));

  const toggleColorMode = () => {
    setMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <>
      <motion.div className="progress-bar" style={{ scaleX }} />

      {/* Main Content - Always rendered, no fade-in animation */}
      <ThemeProvider theme={LPtheme}>
        <CssBaseline />
        {/* Main content zIndex is 100 */}
        <Box sx={{ position: 'relative', zIndex: 100 }}>
          {/* AppBar zIndex is 110 (above banner and confetti) */}
          <AppAppBar mode={mode} toggleColorMode={toggleColorMode} sx={{ zIndex: 110 }} />
          <Hero />
          <Box sx={{ bgcolor: 'background.default' }}>
            <LogoCollection />
            <Divider />
            <Box id="highlights"><Highlights /></Box>
            <Divider />
            <Box id="terminal"><Panel /></Box>
            <Divider />
            <Box id="insights"><Insights /></Box>
            <Divider />
            <Box id="testimonials"><Testimonials /></Box>
            <Divider />
            <FAQ />
            <Pricing />
            <Divider />
            <Footer />
          </Box>
          {/* FeedbackButton zIndex is 110 (above banner and confetti) */}
          <FeedbackButton sx={{ zIndex: 110 }} />
        </Box>
      </ThemeProvider>
    </>
  );
}
