import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Container,
  Box,
  CssBaseline,
  PaletteMode,
  Button,
  IconButton
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { alpha } from "@mui/material";
import getLPTheme from "./getLPTheme";
import AppAppBar from "./AppAppBar";

// Framer Motion for animations
import { motion } from "framer-motion";

// Icons
import MailIcon from "@mui/icons-material/Mail";
import { SocialIcon } from 'react-social-icons';



// For TikTok, MUI doesn't provide a built-in icon. We'll use a custom:
import { SvgIcon } from "@mui/material";
function TikTokIcon(props: any) {
  // Basic TikTok Logo Path (simplified). Feel free to swap out with your own SVG.
  return (
    <SvgIcon {...props} viewBox="0 0 256 256">
      <path d="M187.8 74.4c4.8 1.1 9.7 1.6 14.6 1.6V51c-9 0-17.7-2.6-25.1-7.3-7.5-4.7-13.3-11.3-16.9-19.3h-22.2v134.2c0 10-3.9 19.5-10.9 26.5-7 7-16.5 10.9-26.5 10.9-20.6 0-37.4-16.8-37.4-37.4 0-18.3 13.4-33.5 30.9-36.6v-26.3c-33.3 3.2-59.3 31.3-59.3 62.9 0 34.8 28.3 63.1 63.1 63.1 17 0 32.8-6.7 44.7-18.6 11.9-11.9 18.6-27.7 18.6-44.7V88.6c6.4 7.1 14.4 13 23.1 17.2z" />
    </SvgIcon>
  );
}

/** An array of 7 different LinkedIn button colors */
const linkedinButtonColors = [
  "#0A66C2",
  "#0072b1",
  "#2357BF",
  "#0084b2",
  "#183153",
  "#00a0dc",
  "#2867B2"
];

/** Team Data */
const teamData = [
  {
    name: "Hemant Smart",
    role: "Product",
    image: "https://i.imgur.com/ByQBV2q.jpeg",
    description:
      "Hemant drives product strategy and development, ensuring GradFlow remains scalable, user-friendly and innovative with strong DevOps integration",
    linkedInLink: "https://www.linkedin.com/in/hemant-smart-089208190/"
  },
  {
    name: "Dillan Kerai",
    role: "Development",
    image:
      "https://media.licdn.com/dms/image/v2/D4E03AQE2njr9l18NtA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1727860699258?e=1747267200&v=beta&t=MxoYULHqIm74wYW4vaQ6cRY2QdW0CnVIrlNLBGDQqKg",
    description:
      "Dillan leads full-stack development, ensuring smooth deployments, high performance and seamless user experience.",
    linkedInLink: "https://www.linkedin.com/in/dillan-kerai3/"
  },
  {
    name: "Angie Patel",
    role: "Events & LinkedIn",
    image:
      "https://media.licdn.com/dms/image/v2/D4E03AQFkHs6pnfutSw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1689361219394?e=1747267200&v=beta&t=HibhvijOGwFBKO3Nl0RYrpVM73Gp86zEd1riX5OkLY4",
    description:
      "Angie manages events and LinkedIn engagement, strengthening GradFlow’s professional presence and community outreach.",
    linkedInLink: "https://www.linkedin.com/in/angelica-patel/"
  },
  {
    name: "Arjun Krishnan",
    role: "Infrastructure",
    image:
      "https://media.licdn.com/dms/image/v2/D4E03AQGFJncehU-XQg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1715457610712?e=1747267200&v=beta&t=dC89QQcZjCZNmgJygyFNXuut4pHg3qesYzPVyp9emBE",
    description:
      "Arjun designs and maintains GradFlow’s infrastructure, ensuring backend stability, scalability and seamless system performance.",
    linkedInLink: "https://www.linkedin.com/in/arjunkrishnan003/"
  },
  {
    name: "Mayur Shankar",
    role: "University Outreach",
    image:
      "https://media.licdn.com/dms/image/v2/D4E03AQH8XsqxagYZoQ/profile-displayphoto-shrink_400_400/B4EZWQ6CjFG0Ag-/0/1741892889183?e=1747267200&v=beta&t=dQgrgRoK21O3EWZsyXFznIwQkpco4-JceFlrui2rx-I",
    description:
      "Mayur leads university outreach, building relationships with institutions to expand GradFlow’s reach and impact in higher education.",
    linkedInLink: "https://www.linkedin.com/in/mayur-shankar/"
  },
  {
    name: "Mia Mistry",
    role: "Digital Marketing",
    image:
      "https://media.licdn.com/dms/image/v2/D4E03AQFWMvDLcU7NWg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1731082490510?e=1747267200&v=beta&t=wPsGgp7nqhg9zuNLzp_vfAnMvhoAqq53HLmlyhM9O0U",
    description:
      "Mia drives digital marketing, focusing on Instagram, TikTok and other media channels to enhance GradFlow’s brand and student engagement.",
    linkedInLink: "https://www.linkedin.com/in/mia-mistry-b39774209/"
  },
  {
    name: "Sadhana Sreeram",
    role: "Legal",
    image:
      "https://media.licdn.com/dms/image/v2/D5603AQHCLJrAQg_gNA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1724254251346?e=1747267200&v=beta&t=Tm2ES0srHACHjtdYYpNRGmp3KPVVy0EM_mp0Um34CZg",
    description:
      "Sadhana brings legal expertise to GradFlow, ensuring compliance and contributing to its seamless operations.",
    linkedInLink: "https://www.linkedin.com/in/sadhana-sreeram/"
  }
];

export default function AboutUs() {
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
        sx={theme => ({
          width: "100%",
          // backgroundImage:
          //   theme.palette.mode === "light"
          //     ? "linear-gradient(180deg, #CEE5FD, #FFF)"
          //     : `linear-gradient(#02294F, ${alpha("#090E10", 0.0)})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          pt: { xs: 14, sm: 16 },
          pb: { xs: 8, sm: 10 }
        })}
      >
        <Container maxWidth="md">
          {/* About Our Team Box */}
          <Box
            sx={{
              bgcolor:
                theme.palette.mode === "light"
                  ? "rgba(255, 255, 255, 0.7)"
                  : "rgba(0,0,0,0.5)",
              backdropFilter: "blur(10px)",
              p: 4,
              borderRadius: 3,
              mb: 6,
              boxShadow:
                theme.palette.mode === "light"
                  ? "0px 4px 10px rgba(0, 0, 0, 0.1)"  // Soft shadow in light mode
                  : "0px 6px 15px rgba(255, 255, 255, 0.05)" // Slight glow in dark mode
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom>
              About Our Team
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              In 2023 and 2024, we, like thousands of students, faced the overwhelming challenge of job applications with rejections piling up as we tried to figure out what went wrong. But through persistence and learning from our mistakes, we realized the real struggle wasn’t finding a job; it was managing the process.
            </Typography>

            <Typography variant="body1" sx={{ mb: 3 }}>
              The job hunt felt chaotic, from tracking deadlines to staying motivated through setbacks. After submitting over 500 applications, we knew there had to be a better way. That’s why we've built <strong>GradFlow</strong>, a platform by students, for students, to streamline applications, stay organized and help others avoid the mistakes we once made.
            </Typography>

            <Typography variant="body1">
              We’ve been there. We get it. Now, we’re here to help.
            </Typography>

            {/* Contact Us (Inside the same box) */}
            <Typography variant="h5" sx={{ mt: 2 }}>
              Contact Us
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Have questions or want to learn more? Reach out via our social channels!
            </Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 4 }}>

              {/* Instagram */}
              <SocialIcon style={{
                maxWidth: "35px",
                maxHeight: "35px",
                cursor: "pointer"
              }} network="instagram" onClick={() => window.open("https://www.instagram.com/gradflowinc/", "_blank")} />

              {/* LinkedIn */}
              <SocialIcon style={{
                maxWidth: "35px",
                maxHeight: "35px",
                cursor: "pointer"
              }} network="linkedin" onClick={() => window.open("https://www.linkedin.com/company/gradflow-inc/?viewAsMember=true", "_blank")} />

              {/* TikTok */}
              <SocialIcon style={{
                maxWidth: "35px",
                maxHeight: "35px",
                cursor: "pointer"
              }} network="tiktok" onClick={() => window.open("https://www.tiktok.com/@gradflow", "_blank")} />

              {/* Email
              <IconButton
                onClick={() => (window.location.href = "mailto:gradflowinc@gmail.com")}
                aria-label="Email"
              >
                <MailIcon />
              </IconButton> */}
            </Box>

            {/* Team Cards */}
            <Grid container spacing={4}>
              {teamData.map((member, idx) => {
                const buttonColor = linkedinButtonColors[idx % linkedinButtonColors.length];

                return (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={idx}
                    // Card fade/slide-in animation using Framer Motion
                    component={motion.div}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card
                      elevation={3}
                      sx={{
                        // Hover effect: slight lift and bigger shadow
                        transition: "transform 0.3s, box-shadow 0.3s",
                        "&:hover": {
                          transform: "translateY(-6px)",
                          boxShadow: 6
                        }
                      }}
                    >
                      {/* Image */}
                      <CardMedia
                        component="img"
                        alt={member.name}
                        height="240"
                        image={member.image}
                        style={{ objectFit: "cover" }}
                      />
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {member.name}
                        </Typography>

                        {/* Role + LinkedIn Button in one row */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                          }}
                        >
                          <Typography variant="subtitle2" color="text.secondary">
                            {member.role}
                          </Typography>
                          <SocialIcon style={{
                            maxWidth: "35px",
                            maxHeight: "35px",
                            cursor: "pointer"
                          }}
                            network="linkedin" onClick={() => window.open(member.linkedInLink, "_blank")} />
                        </Box>

                        <Box marginTop={1}>
                          <Typography variant="body2" color="text.primary">
                            {member.description}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </Container>
      </Box >
    </ThemeProvider >
  );
}
