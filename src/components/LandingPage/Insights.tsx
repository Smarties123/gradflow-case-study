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
import "./Styles/Insights.css";
import "animate.css"; // Import Animate.css

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
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [animateClass, setAnimateClass] = useState(""); // Animation state

  const handleItemClick = (index) => {
    if (index === selectedItemIndex) return; // Prevent re-animating the same image

    setAnimateClass(""); // Reset animation class
    setTimeout(() => {
      setSelectedItemIndex(index); // Update selected item
      setAnimateClass("animate__animated animate__fadeInDown"); // Apply fadeInDown animation class
    }, 20); // Slight delay to ensure animation re-triggers
  };

  const selectedFeature = items[selectedItemIndex];

  return (
    <Container id="insights" sx={{ py: { xs: 8, sm: 10 } }}>
      <Grid container spacing={6}>
        {/* Left-hand side: Stack with clickable items */}
        <Grid item xs={12} md={6}>
          <Typography component="h2" variant="h4" color="text.primary">
            Insights
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: { xs: 2, sm: 4 } }}
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

        {/* Right-hand side: Conditionally render the image based on selected item */}
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
            }}
          >
            <Box
              className={animateClass} // Apply animation class dynamically
              sx={{
                m: "auto",
                width: "100%",
                textAlign: "center",
              }}
            >
              <img
                src={selectedFeature.image.slice(4, -1).replace(/"/g, "")} // Extract the URL from `url("...")`
                alt={selectedFeature.title}
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: 8,
                }}
              />
            </Box>

          </Card>
        </Grid>
      </Grid>
    </Container>
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
