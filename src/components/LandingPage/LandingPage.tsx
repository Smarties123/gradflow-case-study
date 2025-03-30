import * as React from 'react';
import { useState, useEffect } from 'react';
import { PaletteMode } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti'; // Import canvas-confetti

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
import './Styles/fireworks-banner.css'; // Keep banner CSS import

export default function LandingPage() {
  const [mode, setMode] = React.useState<PaletteMode>('dark');
  const [showBanner, setShowBanner] = useState(false); // Banner starts hidden

  const LPtheme = createTheme(getLPTheme(mode));

  // --- Confetti Effect Hook ---
  useEffect(() => {
    const duration = 5 * 1000; // 5 seconds
    const animationEnd = Date.now() + duration;
    // Confetti above main content and banner, below AppBar
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 105 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }
    console.log("Starting confetti interval");
    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        console.log("Clearing confetti interval (time left)");
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
    return () => {
      console.log("Clearing confetti interval (component unmount)");
      clearInterval(interval);
    };
  }, []);

  // --- Banner Animation Hook ---
  useEffect(() => {
    console.log("Starting banner timers.");
    const bannerTimer = setTimeout(() => {
      console.log("Showing banner.");
      setShowBanner(true);
    }, 700);
    const bannerExitTimer = setTimeout(() => {
      console.log("Hiding banner.");
      setShowBanner(false);
    }, 4000);
    return () => {
      console.log("Cleaning up banner timers.");
      clearTimeout(bannerTimer);
      clearTimeout(bannerExitTimer);
    };
  }, []);


  const toggleColorMode = () => {
    setMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  console.log("Rendering LandingPage");

  return (
    <>
      <motion.div className="progress-bar" style={{ scaleX }} />

      {/* Sliding Banner - Animates in and out over the content */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            key="banner"
            className="fireworks-banner"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            // *** INCREASED Z-INDEX HERE ***
            style={{ zIndex: 101, position: 'fixed', width: '100%' }}
          >
            <motion.img
              className="fireworks-gif"
              src="/LandingPageMedia/North East, Yorkshire & the Humber - UK SUA Regional Finalist Email Banner.png"
              alt="Celebration Banner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        )}
      </AnimatePresence>


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
{/*             <Pricing /> */}
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
