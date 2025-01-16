import * as React from "react";
import { alpha, keyframes } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import "./Styles/Hero.css"; // Include your Gooey Button CSS
import { motion } from 'framer-motion';
import Button from '@mui/material/Button';

const fadeSlideIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

export default function Hero() {
  const text = "Your one-stop platform to manage, track and succeed in all your applications".split(
    " "
  );

  const moveBg = (e) => {
    const rect = e.target.getBoundingClientRect();
    e.target.style.setProperty("--x", ((e.clientX - rect.x) / rect.width) * 100);
    e.target.style.setProperty("--y", ((e.clientY - rect.y) / rect.height) * 100);
  };

  const resetBg = (e) => {
    // Reset the background position to the centre
    e.target.style.setProperty("--x", "50");
    e.target.style.setProperty("--y", "50");
  };

  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: "100%",
        backgroundImage:
          theme.palette.mode === "light"
            ? "linear-gradient(180deg, #CEE5FD, #FFF)"
            : `linear-gradient(#02294F, ${alpha("#090E10", 0.0)})`,
        backgroundSize: "100% 20%",
        backgroundRepeat: "no-repeat",
      })}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: { xs: 14, sm: 20 },
          pb: { xs: 2, sm: 2 },
        }}
      >
        <Stack spacing={2} useFlexGap sx={{ width: { xs: "100%", sm: "70%" } }}>
          <Typography
            variant="h1"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignSelf: "center",
              textAlign: "center",
              fontSize: "clamp(3.5rem, 10vw, 4rem)",
              animation: `${fadeSlideIn} 1.2s ease-out`,
            }}
          >
            Track Apply&nbsp;
            <Typography
              component="span"
              variant="h1"
              sx={{
                fontSize: "clamp(3rem, 10vw, 4rem)",
                color: (theme) =>
                  theme.palette.mode === "light" ? "primary.main" : "primary.light",
                animation: `${fadeSlideIn} 1.5s ease-out`,
              }}
            >
              Succeed
            </Typography>
          </Typography>

          <Typography
            textAlign="center"
            color="text.secondary"
            sx={{ alignSelf: 'center', width: { sm: '100%', md: '80%' } }}
          >
            {text.map((el, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.5, // Increased duration for slower fade-in
                  delay: i * 0.25 // Increased delay for a more gradual appearance
                }}
              >
                {el}{' '}
              </motion.span>
            ))}
          </Typography>


          <Stack
          >
            <button
              className="gooey-button"
              onMouseMove={moveBg}
              onClick={() => (window.location.href = "/signup")}
              style={{ fontSize: "3rem", fontWeight: 600, padding: "3.5rem 4rem" }}
            >

              Sign Up for Free
            </button>
          </Stack>
        </Stack>
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <filter id="goo" x="-50%" y="-50%" width="200%" height="200%">
            <feComponentTransfer>
              <feFuncA type="discrete" tableValues="0 1" />
            </feComponentTransfer>
            <feGaussianBlur stdDeviation="5" />
            <feComponentTransfer>
              <feFuncA type="table" tableValues="-5 11" />
            </feComponentTransfer>
          </filter>
        </svg>
      </Container>


    </Box>
  );
}
