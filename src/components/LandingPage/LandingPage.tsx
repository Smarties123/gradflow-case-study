import * as React from 'react';
import { PaletteMode } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { motion, useScroll, useSpring } from 'framer-motion'; // Import framer-motion
import AppAppBar from './AppAppBar';
import Hero from './Hero';
import getLPTheme from './getLPTheme';
import './Styles/LandingPageStyles.css'; // Ensure this CSS file includes the .progress-bar class
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


export default function LandingPage() {
  const [mode, setMode] = React.useState<PaletteMode>('dark');
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const LPtheme = createTheme(getLPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });

  const toggleColorMode = () => {
    setMode(prev => (prev === 'dark' ? 'light' : 'dark'));
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
          <Divider />

          <Box id="highlights" sx={{ bgcolor: 'background.default' }}>
            <Highlights />
          </Box>

          <Divider />

          <Box id="terminal" sx={{ bgcolor: 'background.default' }}>
            <Panel />
          </Box>

          <Divider />

          <Box id="insights" sx={{ bgcolor: 'background.default' }}>
            <Insights />
          </Box>

          <Divider />



          <Box id="testimonials" sx={{ bgcolor: 'background.default' }}>
            <Testimonials />
          </Box>

          <Divider />

          {/* <Box id="faq" sx={{ bgcolor: 'background.default' }}> */}
          <FAQ />
          {/* </Box> */}
          {/* <Divider />
        
          <Divider /> */}
          {/* <Pricing /> */}

          <Divider />
          <Footer />
        </Box>
        <FeedbackButton />


      </ThemeProvider>
    </>
  );
}
