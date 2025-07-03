import React, { useState } from "react";
import { useInView } from "react-intersection-observer";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import GridViewIcon from "@mui/icons-material/GridView";
import { useTheme } from "@mui/material/styles";
import "./Styles/Insights.css";
import "animate.css"; // Import Animate.css
import * as errors from '@/images/errors';

const items = [
  {
    icon: <GridViewIcon />,
    title: "Dashboard",
    description:
      "Dive into your personalized Dashboard, where insights and opportunities come together! Track your progress and gain a clear view of your job applications, all in one dynamic hub.",
    image: 'url(https://i.imgur.com/bSTMQlX.png)',
    imagePosition: "center 20px",
  },
  {
    title: "Quick Add",
    description:
      "Instantly capture and organize your job applications with just a click, making your journey to landing that dream job faster and easier than ever!",
    image: 'url(https://i.imgur.com/YQzwGsk.png)',
    icon: <LibraryAddIcon />,
  },
  {
    icon: <TipsAndUpdatesIcon />,
    title: "Coming Soon",
    description:
      "Exciting things are on the horizon! Stay tuned for our upcoming features that will elevate your job application experience to new heights!",
    image: "/LandingPageMedia/Terminal - Coming Soon.png",
    imagePosition: "center",
  },
];

export default function Insights() {
  const theme = useTheme();
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [animateClass, setAnimateClass] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousImage, setPreviousImage] = useState<string | null>(null);

  const handleItemClick = (index) => {
    if (index === selectedItemIndex || isTransitioning) return;

    setIsTransitioning(true);
    setPreviousImage(items[selectedItemIndex]?.image.slice(4, -1).replace(/"/g, ""));

    // Wait for fade out animation before changing image
    setTimeout(() => {
      setSelectedItemIndex(index);
      setAnimateClass("animate__animated animate__fadeInDown");
      // Reset transition state after new image is loaded
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 300);
  };

  const selectedFeature = items[selectedItemIndex];

  return (
    <Box
      id="insights"
      sx={{
        pt: { xs: 4, sm: 10 },
        pb: { xs: 4, sm: 10 },
        color: theme.palette.mode === 'dark' ? 'white' : '#0a0e0f',
        bgcolor: theme.palette.mode === 'dark' ? '#0a0e0f' : 'white',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,98,0,0.2), transparent)',
        },
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
      <Container sx={{ py: { xs: 8, sm: 10 } }}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
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
              Insights
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, maxWidth: 700, mx: "auto" }}
            >
              Insights by GradFlow is an advanced analytics dashboard that offers
              a comprehensive view of job application efforts, tracking progress,
              interviews, and offers, enabling improved outcomes in the job search
              journey.
            </Typography>
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="flex-start"
              spacing={2}
              useFlexGap
              sx={{ width: "100%" }}
            >
              {items.map(({ icon, title, description }, index) => (
                <AnimatedItem
                  key={index}
                  index={index}
                  icon={icon}
                  title={title}
                  description={description}
                  selectedItemIndex={selectedItemIndex}
                  handleItemClick={handleItemClick}
                />
              ))}
            </Stack>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: { sm: "flex" },
              width: "100%",
              justifyContent: "flex-start",
            }}
          >
            <Card
              variant="outlined"
              sx={{
                height: "100%",
                width: "100%",
                display: { sm: "flex" },
                pointerEvents: "none",
                backgroundColor: "transparent",
                position: "relative",
                perspective: "1000px",
              }}
            >
              <Box
                sx={{
                  m: "auto",
                  width: "100%",
                  textAlign: "center",
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
                {selectedFeature.title === "Coming Soon" ? (
                  <Box
                    className={`${animateClass} coming-soon-box`}
                    sx={{
                      height: "350px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <img
                      src={errors[`Error404Img`]}
                      alt="Coming Soon"
                      style={{
                        height: "350px",
                        width: "auto",
                        maxWidth: "75%",
                        objectFit: "contain",
                        borderRadius: 8,
                      }}
                    />
                    <Typography
                      variant="subtitle1"
                      sx={{
                        mt: 2,
                        maxWidth: 500,
                        fontWeight: 500,
                        color: "white"
                      }}
                    >
                      We're hard at work creating exciting new features for the website. Stay tuned for updates!
                    </Typography>
                  </Box>
                ) : (
                  <img
                    src={selectedFeature.image.slice(4, -1).replace(/"/g, "")}
                    alt={selectedFeature.title}
                    style={{
                      height: "100%",
                      width: "auto",
                      maxWidth: "100%",
                      objectFit: "contain",
                      borderRadius: 8,
                      transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                      filter: "brightness(1.02) contrast(1.02)",
                      position: "relative",
                      zIndex: 1,
                    }}
                    className={animateClass}
                  />
                )}
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

function AnimatedItem({
  icon,
  title,
  description,
  index,
  selectedItemIndex,
  handleItemClick,
}) {
  const { ref, inView } = useInView({ threshold: 0.1 }); // Detect when the card is in view
  const [hasAnimated, setHasAnimated] = useState(false); // Track if the animation has already been played

  React.useEffect(() => {
    if (inView && !hasAnimated) {
      setHasAnimated(true); // Mark as animated once the card is in view
    }
  }, [inView, hasAnimated]);

  return (
    <Card
      ref={ref}
      variant="outlined"
      onClick={() => handleItemClick(index)}
      className={`animate__animated ${hasAnimated ? "animate__fadeIn" : ""
        }`} // Apply fadeIn animation dynamically only once
      sx={{
        p: 3,
        height: "fit-content",
        width: "100%",
        background: "none",
        backgroundColor:
          selectedItemIndex === index ? "action.selected" : undefined,
        borderColor: (theme) =>
          selectedItemIndex === index
            ? "primary.light"
            : theme.palette.mode === "light"
              ? "grey.200"
              : "grey.800",
        cursor: "pointer", // Make the card clickable
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          textAlign: "left",
          flexDirection: "row",
          alignItems: "center",
          gap: 2.5,
          overflow: "hidden", // Prevent overflow issues from animations
        }}
      >
        <Box
          sx={{
            color: selectedItemIndex === index ? "primary.main" : "grey.300",
          }}
        >
          {icon}
        </Box>
        <Box sx={{ textTransform: "none" }}>
          <Typography color="text.primary" variant="body2" fontWeight="bold">
            {title}
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
            sx={{ my: 0.5 }}
          >
            {description}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}
