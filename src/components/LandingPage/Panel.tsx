import React, { useState, useEffect } from "react";
import { Box, Container, Grid, Typography, Button, Skeleton, useTheme } from "@mui/material";
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
    imageLight: "/Images/Panel (Light).png",
    imageDark: "/Images/Panel (Dark).png",
    logo: <ViewQuiltRoundedIcon fontSize="medium" />,
  },
  {
    title: "Drag and Drop",
    description: 'Take control of your job hunt with our dynamic drag-and-drop feature! Effortlessly organize your applications and tailor your roadmap',
    imageLight: "/Images/DnD (Light).png",
    imageDark: "/Images/DnD (Dark).png",
    logo: <EdgesensorHighRoundedIcon fontSize="medium" />,
  },
  {
    title: 'Table',
    description: 'Discover your data like never before! Our Table feature transforms your insights into an organized and interactive experience, making it easy to analyze and strategize your job search.',
    imageLight: "/Images/Table (Light).png",
    imageDark: "/Images/Table (Dark).png",
    logo: <BackupTableIcon fontSize="medium" />,
  },
  {
    title: 'Files',
    description: 'Stay tuned for our upcoming features that will streamline your job search and make your applications stand out',
    imageLight: "/Images/Frame 1 (Light).png",
    imageDark: "/Images/Frame 1 (Dark).png",
    logo: <FileOpenIcon fontSize="medium" />,
  },
];

export default function BuiltForYou() {
  const theme = useTheme();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [previousImage, setPreviousImage] = useState<string | null>(null);

  useEffect(() => {
    // Preload images for both light and dark mode
    items.forEach(item => {
      const imgLight = new window.Image();
      imgLight.src = item.imageLight;
      const imgDark = new window.Image();
      imgDark.src = item.imageDark;
    });
  }, []);

  const getImageForIndex = (index) => {
    return theme.palette.mode === 'dark' ? items[index].imageDark : items[index].imageLight;
  };

  const handleImageChange = (index) => {
    if (index !== selectedIndex && !isTransitioning) {
      setIsTransitioning(true);
      setImageLoaded(false);
      setPreviousImage(getImageForIndex(selectedIndex));

      // Wait for fade out animation before changing image
      setTimeout(() => {
        setSelectedIndex(index);
        // Reset transition state after new image is loaded
        setTimeout(() => {
          setIsTransitioning(false);
        }, 300);
      }, 300);
    }
  };

  const handleKeyPress = (event, index) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleImageChange(index);
    }
  };

  return (
    <Box
      id="panel"
      sx={{
        pt: { xs: 4, sm: 10 },
        pb: { xs: 4, sm: 10 },
        color: theme.palette.mode === 'dark' ? 'white' : '#0a0e0f',
        bgcolor: theme.palette.mode === 'dark' ? '#0a0e0f' : 'white',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,98,0,0.2), transparent)',
        }
      }}
    >
      <Container sx={{ textAlign: "center" }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          sx={{
            background: 'linear-gradient(90deg, #FF6200, #FF8A00)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}
        >
          The Gradflow Terminal
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: { xs: 3, md: 4 }, maxWidth: 700, mx: "auto", px: 2 }}
        >
          {"The Terminal by GradFlow transcends traditional spreadsheets with customizable tiles for each job application, proactive alerts, and drag-and-drop organization."}
        </Typography>

        <Grid
          container
          spacing={{ xs: 2, sm: 4, md: 8 }}
          justifyContent="center"
          alignItems="center"
          sx={{ mb: { xs: 2, sm: 4 } }}
        >
          {items.map((item, index) => (
            <Grid item xs={6} sm="auto" key={index}>
              <Box textAlign="center">
                <Button
                  onClick={() => handleImageChange(index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  aria-label={`Select ${item.title}`}
                  aria-pressed={selectedIndex === index}
                  role="tab"
                  tabIndex={0}
                  sx={{
                    width: { xs: 50, sm: 60 },
                    height: { xs: 50, sm: 60 },
                    margin: "0px auto 10px auto",
                    borderRadius: "50%",
                    backgroundColor: selectedIndex === index ? "primary.main" : "grey.300",
                    transform: selectedIndex === index ? "scale(1.1)" : "scale(1)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: selectedIndex === index ? "primary.main" : "grey.400",
                      transform: "scale(1.1)",
                    },
                    "&:focus-visible": {
                      outline: "2px solid",
                      outlineOffset: "2px",
                      outlineColor: "primary.main",
                    },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      color: selectedIndex === index ? "white" : "black",
                      transition: "color 0.3s ease",
                    }}
                  >
                    {item.logo}
                  </Box>
                </Button>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontWeight: selectedIndex === index ? "bold" : "normal",
                    transition: "font-weight 0.3s ease",
                  }}
                >
                  {item.title}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            maxWidth: 1000,
            mx: "auto",
            textAlign: "center",
            mt: 4,
            position: "relative",
            minHeight: 400,
            perspective: "1000px",
          }}
        >
          {isLoading && (
            <Skeleton
              variant="rectangular"
              width="100%"
              height={400}
              animation="wave"
              sx={{
                borderRadius: 2,
                transform: "scale(0.98)",
                transition: "all 0.3s ease"
              }}
            />
          )}
          <Box
            sx={{
              position: "relative",
              transformStyle: "preserve-3d",
              transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: isTransitioning ? "scale(0.95) rotateX(5deg)" : "scale(1) rotateX(0deg)",
              opacity: isTransitioning ? 0 : 1,
            }}
          >
            {previousImage && isTransitioning && (
              <img
                src={previousImage}
                alt="Previous view"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "auto",
                  borderRadius: "12px",
                  opacity: 0,
                  transition: "opacity 0.3s ease-out",
                }}
              />
            )}
            <img
              className={`animate__animated ${isTransitioning ? "animate__fadeOut" : "animate__fadeIn"}`}
              src={getImageForIndex(selectedIndex)}
              alt={items[selectedIndex]?.title}
              onLoad={() => {
                setIsLoading(false);
                setImageLoaded(true);
              }}
              style={{
                display: isLoading ? "none" : "block",
                width: "100%",
                height: "auto",
                borderRadius: "12px",
                transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                opacity: imageLoaded ? 1 : 0,
                transform: imageLoaded ? "scale(1)" : "scale(0.98)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                filter: "brightness(1.02) contrast(1.02)",
                position: "relative",
                zIndex: 1,
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
