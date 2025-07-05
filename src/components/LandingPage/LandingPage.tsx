import * as React from 'react';
import { useState, useEffect } from 'react';
import { PaletteMode } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { motion, useScroll, useSpring, useInView } from 'framer-motion';

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
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" }
};

const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.8, ease: "easeOut" }
};

const fadeInRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.8, ease: "easeOut" }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const fadeInUpStagger = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const slideInFromBottom = {
  initial: { opacity: 0, y: 80 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" }
};

// Reusable animated section component
const AnimatedSection = ({ children, animation, delay = 0 }: {
  children: React.ReactNode;
  animation: any;
  delay?: number;
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={animation.initial}
      animate={isInView ? animation.animate : animation.initial}
      transition={{ ...animation.transition, delay }}
    >
      {children}
    </motion.div>
  );
};

export default function LandingPage() {
  const [mode, setMode] = React.useState<PaletteMode>('dark');

  const LPtheme = createTheme(getLPTheme(mode));

  const toggleColorMode = () => {
    setMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const { scrollYProgress } = useScroll();

  return (
    <>
      {/* <motion.div
        className="progress-bar"
        style={{ scaleX }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      /> */}

      {/* Main Content - Always rendered, no fade-in animation */}
      <ThemeProvider theme={LPtheme}>
        <CssBaseline />
        {/* Main content zIndex is 100 */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 100,
            '& > *': {
              position: 'relative',
              zIndex: 1
            }
          }}
        >
          {/* AppBar zIndex is 110 (above banner and confetti) */}
          <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />

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
            <AnimatedSection animation={fadeInUp}>
              <LogoCollection />
            </AnimatedSection>

            <AnimatedSection animation={fadeInLeft} delay={0.2}>
              <Box id="highlights"><Highlights /></Box>
            </AnimatedSection>

            <AnimatedSection animation={scaleIn} delay={0.1}>
              <Box id="terminal"><Panel /></Box>
            </AnimatedSection>

            <AnimatedSection animation={fadeInRight} delay={0.2}>
              <Box id="insights"><Insights /></Box>
            </AnimatedSection>

            <AnimatedSection animation={slideInFromBottom} delay={0.3}>
              <Box id="testimonials"><Testimonials /></Box>
            </AnimatedSection>

            <AnimatedSection animation={fadeInLeft} delay={0.1}>
              <FAQ />
            </AnimatedSection>

            <AnimatedSection animation={scaleIn} delay={0.2}>
              <Pricing />
            </AnimatedSection>

            <div>
              <Footer />
            </div>
          </Box>
          {/* FeedbackButton zIndex is 110 (above banner and confetti) */}
          <FeedbackButton />
        </Box>
      </ThemeProvider >
    </>
  );
}
