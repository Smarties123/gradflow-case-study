import * as React from "react";
import { alpha, keyframes } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import "./Styles/Hero.css";
import { motion } from 'framer-motion';
import Button from '@mui/material/Button';
import ReactPlayer from 'react-player'


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

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

export default function Hero() {
  const text = "Your one-stop platform to manage, track and succeed in all your applications".split(
    " "
  );

  const videoUrl = "/Videos/trailer-1-video.mp4";

  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: "100%",
        minHeight: "80vh",
        padding: { xs: "100px 16px 60px 16px", md: "150px 25px 92px 25px" },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: theme.palette.mode === "dark" ? "#090E10" : "#FFFFFF",
        position: "relative",
        overflow: "hidden",
      })}
    >
      <Container
        sx={{
          textAlign: "center",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: { xs: "50px", md: "100px" },
          maxWidth: "1400px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Box
            sx={{
              textAlign: "left",
              maxWidth: "600px",
              display: "flex",
              flexDirection: "column",
              gap: 4,
              alignItems: { xs: "center", md: "flex-start" },
            }}
          >
            <Typography
              variant="h1"
              sx={(theme) => ({
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                fontWeight: "800",
                // color: theme.palette.mode === "dark" ? "#FFFFFF" : "#090E10",
                textAlign: { xs: "center", md: "left" },
                lineHeight: 1.2,
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: "-10px",
                  left: 0,
                  width: "60px",
                  height: "4px",
                  background: "#FF6200",
                  borderRadius: "2px",
                }
              })}
            >
              Track, Apply, <span style={{ color: "#FF6200" }}>Succeed</span>
            </Typography>

            <Typography
              textAlign={{ xs: "center", md: "left" }}
              color="text.secondary"
              sx={{
                fontSize: "clamp(1rem, 2vw, 1.25rem)",
                width: { xs: "100%", md: "90%" },
                maxWidth: "600px",
                lineHeight: 1.6,
                letterSpacing: "0.3px",
              }}
            >
              {text.map((el, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.1,
                  }}
                >
                  {el}{" "}
                </motion.span>
              ))}
            </Typography>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#FF6200",
                  // color: "white",
                  fontSize: "1.1rem",
                  padding: "12px 32px",
                  borderRadius: "30px",
                  textTransform: "none",
                  fontWeight: "600",
                  boxShadow: "0 4px 14px rgba(255, 98, 0, 0.4)",
                  "&:hover": {
                    backgroundColor: "#E55600",
                    boxShadow: "0 6px 20px rgba(255, 98, 0, 0.6)",
                  },
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: "-100%",
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                    transition: "0.5s",
                  },
                  "&:hover::before": {
                    left: "100%",
                  }
                }}
                onClick={() => window.open("https://hadtechnologies.org", "_blank")}
              >
                Join the Waitlist
              </Button>
            </motion.div>
          </Box>
        </motion.div>

        {/* Video Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <Box
            sx={{
              maxWidth: { xs: "100%", md: "600px" },
              width: "100%",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
              transform: "perspective(1000px) rotateY(-5deg)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "perspective(1000px) rotateY(0deg)",
                boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
              },
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                border: "2px solid transparent",
                borderRadius: "16px",
                background: "linear-gradient(45deg, #FF6200, transparent) border-box",
                WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "destination-out",
                maskComposite: "exclude",
                // opacity: 0,
                transition: "opacity 0.3s ease",
              },
              "&:hover::after": {
                // opacity: 1,
              }
            }}
          >
            <ReactPlayer
              url={videoUrl}
              playing
              loop
              muted
              playsinline
              width="100%"
              height="auto"
              style={{
                borderRadius: "16px",
              }}
            />
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
