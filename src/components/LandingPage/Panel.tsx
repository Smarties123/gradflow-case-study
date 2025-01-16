import React, { useState } from "react";
import { Box, Container, Grid, Typography, Button } from "@mui/material";
import ViewQuiltRoundedIcon from "@mui/icons-material/ViewQuiltRounded";
import EdgesensorHighRoundedIcon from "@mui/icons-material/EdgesensorHighRounded";
import BackupTableIcon from '@mui/icons-material/BackupTable';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import './Styles/Panel.css';
import "animate.css";

const items = [
  {
    title: "Panel",
    description:
      "Visualize your job application journey like never before! Helping you stay on track and motivated as you chase your dream job.",
    image: 'url("https://i.imgur.com/UcFmgd2.png")',
    logo: <ViewQuiltRoundedIcon fontSize="medium" />,
  },
  {
    title: "Drag and Drop",
    description: 'Take control of your job hunt with our dynamic drag-and-drop feature! Effortlessly organize your applications and tailor your roadmap',
    image: 'url("https://i.imgur.com/p8EcR2u.png")',
    logo: <EdgesensorHighRoundedIcon fontSize="medium" />,
  },
  {
    title: 'Table',
    description: 'Discover your data like never before! Our Table feature transforms your insights into an organized and interactive experience, making it easy to analyze and strategize your job search.',
    image: 'url("https://i.imgur.com/RA7sJxz.png")', // Updated Table image
    logo: <BackupTableIcon fontSize="medium" />,
  },
  {
    title: 'Files',
    description: 'Stay tuned for our upcoming features that will streamline your job search and make your applications stand out',
    image: '',
    logo: <FileOpenIcon fontSize="medium" />,
  },
];
export default function BuiltForYou() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleImageChange = (index) => {
    if (index !== selectedIndex) {
      setSelectedIndex(index); // Immediately update the selected image
    }
  };

  return (
    <Container id="panel" sx={{ py: 6, textAlign: "center" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        The Gradflow Terminal
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 4, maxWidth: 700, mx: "auto" }}
      >
        {"The Terminal by GradFlow transcends traditional spreadsheets with customizable tiles for each job application, proactive alerts, and drag-and-drop organization."}
      </Typography>

      <Grid
        container
        spacing={{ xs: 2, sm: 8 }} // Reduce spacing on small screens
        justifyContent="center"
        alignItems="center"
        sx={{ mb: { xs: 2, sm: 4 } }} // Reduce margin-bottom on small screens
      >
        {items.map((item, index) => (
          <Grid item xs={6} sm="auto" key={index}>
            <Box textAlign="center">
              <Button
                onClick={() => handleImageChange(index)}
                aria-label={`Select ${item.title}`}
                sx={{
                  width: 60,
                  height: 60,
                  margin: "0px auto 10px auto",
                  borderRadius: "50%",
                  backgroundColor: selectedIndex === index ? "primary.main" : "grey.300",
                  "&:hover": {
                    backgroundColor: selectedIndex === index ? "primary.main" : "grey.400", // Prevent color change when selected
                  },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    color: selectedIndex === index ? "white" : "black",
                  }}
                >
                  {item.logo}
                </Box>
              </Button>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: selectedIndex === index ? "bold" : "normal" }}
              >
                {item.title}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Image Section */}
      <Box
        sx={{
          maxWidth: 1000,
          mx: "auto",
          textAlign: "center",
          mt: 4,
          position: "relative", // Stack images
        }}
      >
        <img
          className={`animate__animated ${selectedIndex !== null ? "animate__fadeIn" : ""
            }`} // Add fade-in animation class
          src={items[selectedIndex]?.image.slice(4, -1).replace(/"/g, "")} // Extract the image URL
          alt={items[selectedIndex]?.title}
          style={{
            display: "block",
            width: "100%",
            height: "auto", // Maintain the image's aspect ratio
            borderRadius: "8px", // Optional: Add rounded corners
            transition: "opacity 0.3s ease-in-out", // Smooth transition
            opacity: selectedIndex !== null ? 1 : 0, // Ensure smooth fade-in
          }}
        />
      </Box>

    </Container>
  );
}
