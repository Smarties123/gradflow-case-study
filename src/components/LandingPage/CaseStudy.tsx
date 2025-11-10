import React, { useState } from "react";
import {
  Typography,
  Container,
  Box,
  CssBaseline,
  PaletteMode,
  Button,
  Card,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import getLPTheme from "./getLPTheme";
import AppAppBar from "./AppAppBar";
import LogoCollection from "./LogoCollection";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const AnimatedSection = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default function CaseStudy() {
  const [mode, setMode] = useState<PaletteMode>("dark");
  const theme = createTheme(getLPTheme(mode));

  const toggleColorMode = () => {
    setMode(prevMode => (prevMode === "light" ? "dark" : "light"));
  };


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />

      <Box
        sx={(theme) => ({
          width: "100%",
          minHeight: "100vh",
          background: theme.palette.mode === "dark" ? "#090E10" : "#FFFFFF",
          pt: { xs: 14, sm: 16 },
          pb: { xs: 8, sm: 10 },
        })}
      >
        <Container maxWidth="lg">
          {/* Hero Section */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            sx={{
              textAlign: "center",
              mb: 10,
              position: "relative",
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  py: 0.75,
                  mb: 3,
                  borderRadius: "20px",
                  background: "linear-gradient(135deg, rgba(255, 98, 0, 0.15), rgba(255, 98, 0, 0.08))",
                  border: "1px solid rgba(255, 98, 0, 0.3)",
                }}
              >
                <EmojiEventsIcon sx={{ color: "#FF6200", fontSize: "18px" }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: "#FF6200",
                    fontWeight: "600",
                    fontSize: "0.8rem",
                  }}
                >
                  Success Story
                </Typography>
              </Box>
            </motion.div>
            <Typography
              variant="h2"
              component={motion.h2}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              sx={{
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                fontWeight: "800",
                mb: 3,
                background: "linear-gradient(135deg, #FF6200 0%, #FF8533 50%, #FFA366 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.02em",
              }}
            >
              GradFlow Case Study
            </Typography>
            <Typography
              variant="h5"
              component={motion.p}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              sx={{
                fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
                color: "text.secondary",
                maxWidth: "800px",
                mx: "auto",
                lineHeight: 1.7,
                fontWeight: "400",
              }}
            >
              How we helped <strong style={{ color: "#FF6200" }}>1,000+ students</strong> track and manage their job applications, 
              and how this experience shaped our journey into building software for others.
            </Typography>
          </Box>

          {/* CountUp Statistics Section */}
          <Box sx={{ mb: 8 }}>
            <LogoCollection />
          </Box>

          {/* Main Content Sections */}
          <Box sx={{ mb: 6 }}>
            {/* The Challenge */}
            <AnimatedSection delay={0.1}>
              <Card
                sx={{
                  mb: 4,
                  p: { xs: 3, md: 4 },
                  background: theme.palette.mode === "light"
                    ? "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)"
                    : "linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.4) 100%)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 4,
                  border: `1px solid ${theme.palette.mode === "light" ? "rgba(255, 98, 0, 0.1)" : "rgba(255, 98, 0, 0.2)"}`,
                  boxShadow: theme.palette.mode === "light"
                    ? "0px 8px 24px rgba(0, 0, 0, 0.08)"
                    : "0px 8px 24px rgba(255, 98, 0, 0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: theme.palette.mode === "light"
                      ? "0px 12px 32px rgba(0, 0, 0, 0.12)"
                      : "0px 12px 32px rgba(255, 98, 0, 0.15)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      background: "linear-gradient(135deg, rgba(255, 98, 0, 0.2), rgba(255, 98, 0, 0.1))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TrendingUpIcon sx={{ color: "#FF6200", fontSize: 32 }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: "700", color: "#FF6200" }}>
                    The Challenge
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.9, fontSize: "1.05rem" }}>
                  In 2023 and 2024, thousands of students faced the overwhelming challenge of managing 
                  job applications. With rejections piling up and no clear way to track progress, 
                  students struggled to understand what went wrong and how to improve.
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.9, fontSize: "1.05rem" }}>
                  The job hunt felt chaotic—from tracking deadlines to staying motivated through setbacks. 
                  After submitting over <strong style={{ color: "#FF6200" }}>500 applications</strong> ourselves, we knew there had to be a better way.
                </Typography>
              </Card>
            </AnimatedSection>

            {/* Our Solution */}
            <AnimatedSection delay={0.2}>
              <Card
                sx={{
                  mb: 4,
                  p: { xs: 3, md: 4 },
                  background: theme.palette.mode === "light"
                    ? "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)"
                    : "linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.4) 100%)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 4,
                  border: `1px solid ${theme.palette.mode === "light" ? "rgba(255, 98, 0, 0.1)" : "rgba(255, 98, 0, 0.2)"}`,
                  boxShadow: theme.palette.mode === "light"
                    ? "0px 8px 24px rgba(0, 0, 0, 0.08)"
                    : "0px 8px 24px rgba(255, 98, 0, 0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: theme.palette.mode === "light"
                      ? "0px 12px 32px rgba(0, 0, 0, 0.12)"
                      : "0px 12px 32px rgba(255, 98, 0, 0.15)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      background: "linear-gradient(135deg, rgba(255, 98, 0, 0.2), rgba(255, 98, 0, 0.1))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <LightbulbIcon sx={{ color: "#FF6200", fontSize: 32 }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: "700", color: "#FF6200" }}>
                    Our Solution
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.9, fontSize: "1.05rem" }}>
                  We built <strong style={{ color: "#FF6200" }}>GradFlow</strong>—a platform by students, for students—to streamline 
                  applications, stay organized, and help others avoid the mistakes we once made. 
                  GradFlow provided a comprehensive solution for tracking applications, managing deadlines, 
                  and maintaining motivation throughout the job search process.
                </Typography>
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    borderRadius: 2,
                    background: theme.palette.mode === "light"
                      ? "rgba(255, 98, 0, 0.05)"
                      : "rgba(255, 98, 0, 0.1)",
                    border: `1px solid ${theme.palette.mode === "light" ? "rgba(255, 98, 0, 0.2)" : "rgba(255, 98, 0, 0.3)"}`,
                  }}
                >
                  <Typography variant="body2" sx={{ fontStyle: "italic", color: "text.secondary" }}>
                    "A platform by students, for students—built from real experience."
                  </Typography>
                </Box>
              </Card>
            </AnimatedSection>

            {/* The Impact */}
            <AnimatedSection delay={0.3}>
              <Card
                sx={{
                  mb: 4,
                  p: { xs: 3, md: 4 },
                  background: theme.palette.mode === "light"
                    ? "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)"
                    : "linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.4) 100%)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 4,
                  border: `1px solid ${theme.palette.mode === "light" ? "rgba(255, 98, 0, 0.1)" : "rgba(255, 98, 0, 0.2)"}`,
                  boxShadow: theme.palette.mode === "light"
                    ? "0px 8px 24px rgba(0, 0, 0, 0.08)"
                    : "0px 8px 24px rgba(255, 98, 0, 0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: theme.palette.mode === "light"
                      ? "0px 12px 32px rgba(0, 0, 0, 0.12)"
                      : "0px 12px 32px rgba(255, 98, 0, 0.15)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      background: "linear-gradient(135deg, rgba(255, 98, 0, 0.2), rgba(255, 98, 0, 0.1))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <RocketLaunchIcon sx={{ color: "#FF6200", fontSize: 32 }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: "700", color: "#FF6200" }}>
                    The Impact
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.9, fontSize: "1.05rem" }}>
                  GradFlow successfully helped over <strong style={{ color: "#FF6200" }}>25+ students</strong> track and manage their job applications. 
                  The platform became a trusted tool for students navigating the challenging job market, 
                  providing them with the organization and insights needed to succeed.
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    mt: 3,
                    flexWrap: "wrap",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      px: 2,
                      py: 1,
                      borderRadius: "8px",
                      background: theme.palette.mode === "dark"
                        ? "rgba(255, 98, 0, 0.12)"
                        : "rgba(255, 98, 0, 0.08)",
                      border: `1px solid ${theme.palette.mode === "dark" ? "rgba(255, 98, 0, 0.25)" : "rgba(255, 98, 0, 0.2)"}`,
                    }}
                  >
                    <CheckCircleIcon sx={{ color: "#FF6200", fontSize: "20px" }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#FF6200",
                        fontWeight: "600",
                        fontSize: "0.85rem",
                      }}
                    >
                      25+ Students
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      px: 2,
                      py: 1,
                      borderRadius: "8px",
                      background: theme.palette.mode === "dark"
                        ? "rgba(255, 98, 0, 0.12)"
                        : "rgba(255, 98, 0, 0.08)",
                      border: `1px solid ${theme.palette.mode === "dark" ? "rgba(255, 98, 0, 0.25)" : "rgba(255, 98, 0, 0.2)"}`,
                    }}
                  >
                    <VerifiedUserIcon sx={{ color: "#FF6200", fontSize: "20px" }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#FF6200",
                        fontWeight: "600",
                        fontSize: "0.85rem",
                      }}
                    >
                      Trusted Platform
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      px: 2,
                      py: 1,
                      borderRadius: "8px",
                      background: theme.palette.mode === "dark"
                        ? "rgba(255, 98, 0, 0.12)"
                        : "rgba(255, 98, 0, 0.08)",
                      border: `1px solid ${theme.palette.mode === "dark" ? "rgba(255, 98, 0, 0.25)" : "rgba(255, 98, 0, 0.2)"}`,
                    }}
                  >
                    <RocketLaunchIcon sx={{ color: "#FF6200", fontSize: "20px" }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#FF6200",
                        fontWeight: "600",
                        fontSize: "0.85rem",
                      }}
                    >
                      Real Impact
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </AnimatedSection>

            {/* What's Next */}
            <AnimatedSection delay={0.4}>
              <Card
                sx={{
                  mb: 4,
                  p: { xs: 3, md: 4 },
                  background: `linear-gradient(135deg, ${
                    theme.palette.mode === "light"
                      ? "rgba(255, 98, 0, 0.1) 0%, rgba(255, 98, 0, 0.05) 100%"
                      : "rgba(255, 98, 0, 0.15) 0%, rgba(255, 98, 0, 0.08) 100%"
                  })`,
                  backdropFilter: "blur(10px)",
                  borderRadius: 4,
                  border: `2px solid ${theme.palette.mode === "light" ? "rgba(255, 98, 0, 0.2)" : "rgba(255, 98, 0, 0.3)"}`,
                  boxShadow: theme.palette.mode === "light"
                    ? "0px 8px 24px rgba(255, 98, 0, 0.15)"
                    : "0px 8px 24px rgba(255, 98, 0, 0.2)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: theme.palette.mode === "light"
                      ? "0px 12px 32px rgba(255, 98, 0, 0.2)"
                      : "0px 12px 32px rgba(255, 98, 0, 0.25)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      background: "linear-gradient(135deg, rgba(255, 98, 0, 0.3), rgba(255, 98, 0, 0.2))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <BusinessIcon sx={{ color: "#FF6200", fontSize: 32 }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: "700", color: "#FF6200" }}>
                    What's Next: HAD Technologies
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.9, fontSize: "1.05rem" }}>
                  Building GradFlow taught us valuable lessons about creating software that truly serves 
                  users' needs. We're now focusing on building software for others through{" "}
                  <strong style={{ color: "#FF6200" }}>
                    <a 
                      href="https://hadtechnologies.org" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ 
                        color: "#FF6200", 
                        textDecoration: "none",
                        borderBottom: "1px solid rgba(255, 98, 0, 0.3)",
                        transition: "border-bottom 0.3s ease"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderBottomColor = "#FF6200"}
                      onMouseLeave={(e) => e.currentTarget.style.borderBottomColor = "rgba(255, 98, 0, 0.3)"}
                    >
                      HAD Technologies
                    </a>
                  </strong>, applying the same user-centric approach and 
                  technical excellence to help businesses and organizations solve their unique challenges.
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.9, fontSize: "1.05rem" }}>
                  Our experience with GradFlow has shaped our approach to software development—prioritizing 
                  user experience, scalability, and real-world impact. We're excited to bring this 
                  expertise to new projects and partnerships.
                </Typography>
              </Card>
            </AnimatedSection>
          </Box>

          {/* CTA Section */}
          <AnimatedSection delay={0.5}>
            <Card
              sx={{
                textAlign: "center",
                p: { xs: 4, md: 6 },
                background: `linear-gradient(135deg, ${
                  theme.palette.mode === "light"
                    ? "rgba(255, 98, 0, 0.08) 0%, rgba(255, 98, 0, 0.03) 100%"
                    : "rgba(255, 98, 0, 0.12) 0%, rgba(255, 98, 0, 0.06) 100%"
                })`,
                backdropFilter: "blur(10px)",
                borderRadius: 4,
                border: `2px solid ${theme.palette.mode === "light" ? "rgba(255, 98, 0, 0.2)" : "rgba(255, 98, 0, 0.3)"}`,
                boxShadow: theme.palette.mode === "light"
                  ? "0px 8px 24px rgba(255, 98, 0, 0.12)"
                  : "0px 8px 24px rgba(255, 98, 0, 0.18)",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: "linear-gradient(90deg, #FF6200, #FF8533, #FF6200)",
                  backgroundSize: "200% 100%",
                  animation: "gradientShift 3s ease infinite",
                  "@keyframes gradientShift": {
                    "0%": { backgroundPosition: "0% 50%" },
                    "50%": { backgroundPosition: "100% 50%" },
                    "100%": { backgroundPosition: "0% 50%" },
                  },
                },
              }}
            >
              <Typography 
                variant="h4" 
                sx={{ 
                  mb: 2, 
                  fontWeight: "700",
                  background: "linear-gradient(135deg, #FF6200, #FF8533)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Ready to Work Together?
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 4, 
                  color: "text.secondary",
                  fontSize: "1.1rem",
                  maxWidth: "600px",
                  mx: "auto",
                }}
              >
                Let's discuss how{" "}
                <a 
                  href="https://hadtechnologies.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: "#FF6200", 
                    textDecoration: "none",
                    fontWeight: "600",
                    borderBottom: "1px solid rgba(255, 98, 0, 0.3)",
                    transition: "border-bottom 0.3s ease"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderBottomColor = "#FF6200"}
                  onMouseLeave={(e) => e.currentTarget.style.borderBottomColor = "rgba(255, 98, 0, 0.3)"}
                >
                  HAD Technologies
                </a>{" "}
                can help solve your organization's unique challenges with custom software solutions.
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Button
                  variant="contained"
                  component={motion.button}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  sx={{
                    backgroundColor: "#FF6200",
                    fontSize: "1rem",
                    padding: "14px 36px",
                    borderRadius: "8px",
                    textTransform: "none",
                    fontWeight: "600",
                    boxShadow: "0 4px 12px rgba(255, 98, 0, 0.3)",
                    "&:hover": {
                      backgroundColor: "#E55600",
                      boxShadow: "0 6px 16px rgba(255, 98, 0, 0.4)",
                    },
                  }}
                  onClick={() => window.open("mailto:hello@hadtech?subject=Contact%20HAD%20Technologies", "_blank")}
                >
                  Contact Us
                </Button>
                <Button
                  variant="outlined"
                  component={motion.button}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  sx={{
                    borderColor: "#FF6200",
                    borderWidth: "2px",
                    color: "#FF6200",
                    fontSize: "1rem",
                    padding: "14px 36px",
                    borderRadius: "8px",
                    textTransform: "none",
                    fontWeight: "600",
                    "&:hover": {
                      borderColor: "#E55600",
                      backgroundColor: "rgba(255, 98, 0, 0.1)",
                      borderWidth: "2px",
                    },
                  }}
                  onClick={() => window.open("https://hadtechnologies.org", "_blank")}
                >
                  Join Waitlist
                </Button>
              </Box>
            </Card>
          </AnimatedSection>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

