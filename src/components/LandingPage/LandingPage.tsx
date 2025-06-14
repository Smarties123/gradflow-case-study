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

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

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
      <motion.div
        className="progress-bar"
        style={{ scaleX }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* Main Content - Always rendered, no fade-in animation */}
      <ThemeProvider theme={LPtheme}>
        <CssBaseline />
        {/* Main content zIndex is 100 */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 100,
            overflow: 'hidden',
            '& > *': {
              position: 'relative',
              zIndex: 1
            }
          }}
        >
          {/* AppBar zIndex is 110 (above banner and confetti) */}
          <AppAppBar mode={mode} toggleColorMode={toggleColorMode} sx={{ zIndex: 110 }} />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Hero />
          </motion.div>

          <Box
            sx={{
              bgcolor: 'background.default',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '100%',
                background: mode === 'dark'
                  ? 'linear-gradient(180deg, rgba(9,14,16,0) 0%, rgba(9,14,16,1) 100%)'
                  : 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)',
                pointerEvents: 'none',
                zIndex: 0
              }
            }}
          >
            <motion.div {...fadeInUp}>
              <LogoCollection />
            </motion.div>

            <motion.div {...fadeInUp}>
              <Box id="highlights"><Highlights /></Box>
            </motion.div>

            <motion.div {...fadeInUp}>
              <Box id="terminal"><Panel /></Box>
            </motion.div>

            <motion.div {...fadeInUp}>
              <Box id="insights"><Insights /></Box>
            </motion.div>

            <motion.div {...fadeInUp}>
              <Box id="testimonials"><Testimonials /></Box>
            </motion.div>

            <motion.div {...fadeInUp}>
              <FAQ />
            </motion.div>

            <motion.div {...fadeInUp}>
              <Pricing />
            </motion.div>

            <motion.div {...fadeInUp}>
              <Footer />
            </motion.div>
          </Box>
          {/* FeedbackButton zIndex is 110 (above banner and confetti) */}
          <FeedbackButton sx={{ zIndex: 110 }} />
        </Box>
      </ThemeProvider>
    </>
  );
}
