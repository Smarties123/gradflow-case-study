import * as React from 'react';
import { useState, useEffect } from 'react';
import { PaletteMode } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { motion, useInView } from 'framer-motion';

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
import FeedbackButton from '../../components/FeedbackButton/FeedbackButton';
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

const slideInFromBottom = {
  initial: { opacity: 0, y: 80 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" }
};

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

  const sectionIds = [
    'section-1',
    'section-2',
    'section-3',
    'section-4',
    'section-5',
    'section-6',
    'section-7',
  ];

  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id, index) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(index);
            }
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '4px',
          width: `${((activeSection + 1) / sectionIds.length) * 100}%`,
          backgroundColor: mode === 'dark' ? '#FF6201' : '#FF6201',
          zIndex: 200,
          transition: 'width 0.3s ease',
        }}
      />

      <ThemeProvider theme={LPtheme}>
        <CssBaseline />

        <Box
          sx={{
            position: 'relative',
            zIndex: 100,
            '& > *': {
              position: 'relative',
              zIndex: 1
            },
            overflowY: 'scroll',
            height: '100vh',
          }}
        >
          <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />

          <Box
            id="section-1"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <Hero />
            </motion.div>
          </Box>

          <AnimatedSection animation={fadeInUp}>
            <Box id="section-1">
              <LogoCollection />
            </Box>
          </AnimatedSection>

          <AnimatedSection animation={fadeInLeft} delay={0.2}>
            <Box id="section-2">
              <Highlights />
            </Box>
          </AnimatedSection>

          <AnimatedSection animation={scaleIn} delay={0.1}>
            <Box id="section-3">
              <Panel />
            </Box>
          </AnimatedSection>

          <AnimatedSection animation={fadeInRight} delay={0.2}>
            <Box id="section-4">
              <Insights />
            </Box>
          </AnimatedSection>

          <AnimatedSection animation={slideInFromBottom} delay={0.3}>
            <Box id="section-5">
              <Testimonials />
            </Box>
          </AnimatedSection>

          <AnimatedSection animation={fadeInLeft} delay={0.1}>
            <Box id="section-6">
              <FAQ />
            </Box>
          </AnimatedSection>

          <AnimatedSection animation={scaleIn} delay={0.2}>
            <Box id="section-7">
              <Pricing />
            </Box>
          </AnimatedSection>

          <Box>
            <Footer />
          </Box>

          <FeedbackButton />
        </Box>
      </ThemeProvider>
    </>
  );
}
