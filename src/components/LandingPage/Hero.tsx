import * as React from "react";
import { alpha, keyframes } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import "./Styles/Hero.css"; // Include your Gooey Button CSS
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

  const videoUrl = "https://d3htrhw57y4gd1.cloudfront.net/trailer-1-video.mp4";


  return (
    // <Box
    //   id="hero"
    //   sx={(theme) => ({
    //     width: "100%",
    //     backgroundImage:
    //       theme.palette.mode === "light"
    //         ? "linear-gradient(180deg, #CEE5FD, #FFF)"
    //         : `linear-gradient(#02294F, ${alpha("#090E10", 0.0)})`,
    //     backgroundSize: "100% 20%",
    //     backgroundRepeat: "no-repeat",
    //   })}
    // >
    //   <Container
    //     sx={{
    //       display: "flex",
    //       flexDirection: "column",
    //       alignItems: "center",
    //       pt: { xs: 14, sm: 20 },
    //       pb: { xs: 2, sm: 2 },
    //     }}
    //   >
    //     <Stack
    //       spacing={2}
    //       useFlexGap
    //       sx={{
    //         width: { xs: "100%", sm: "70%" },
    //         maxWidth: "800px", // Restrict overall width
    //         margin: "0 auto", // Centre the Stack horizontally
    //         justifyContent: "center", // Centre items vertically within the Stack
    //         alignItems: "center", // Centre items horizontally
    //       }}
    //     >
    //       <Typography
    //         variant="h1"
    //         sx={{
    //           display: "flex",
    //           flexDirection: { xs: "column", md: "row" },
    //           alignSelf: "center",
    //           textAlign: "center",
    //           fontSize: "clamp(3.5rem, 10vw, 4rem)",
    //           animation: `${fadeSlideIn} 1.2s ease-out`,
    //         }}
    //       >
    //         Track Apply&nbsp;
    //         <Typography
    //           component="span"
    //           variant="h1"
    //           sx={{
    //             fontSize: "clamp(3rem, 10vw, 4rem)",
    //             color: (theme) =>
    //               theme.palette.mode === "light" ? "primary.main" : "primary.light",
    //             animation: `${fadeSlideIn} 1.5s ease-out`,
    //           }}
    //         >
    //           Succeed
    //         </Typography>
    //       </Typography>

    //       <Typography
    //         textAlign="center"
    //         color="text.secondary"
    //         sx={{
    //           alignSelf: "center",
    //           width: { sm: "100%", md: "80%" },
    //           maxWidth: "600px",
    //         }}
    //       >
    //         {text.map((el, i) => (
    //           <motion.span
    //             key={i}
    //             initial={{ opacity: 0 }}
    //             animate={{ opacity: 1 }}
    //             transition={{
    //               duration: 0.5,
    //               delay: i * 0.25,
    //             }}
    //           >
    //             {el}{" "}
    //           </motion.span>
    //         ))}
    //       </Typography>

    //       <div
    //         style={{
    //           display: "flex",
    //           justifyContent: "center",
    //           alignItems: "center",
    //           margin: 0,
    //           padding: 0,
    //           height: "auto",
    //         }}
    //       >
    //         <button
    //           className="gooey-button"
    //           onMouseMove={moveBg}
    //           onClick={() => (window.location.href = "/signup")}
    //           style={{
    //             fontSize: "2.5rem",
    //             padding: "4.5rem 4rem",
    //             margin: 0,
    //             lineHeight: 1, // Ensure text height is correct
    //             maxWidth: "-webkit-fill-available", // Prevents button from expanding beyond the screen
    //             textAlign: "center", // Centers text properly
    //             whiteSpace: window.innerWidth < 768 ? "pre" : "normal", // Allows wrapping
    //             wordBreak: "break-word", // Ensures long words don't overflow
    //           }}
    //         >
    //           Sign Up for Free
    //         </button>
    //       </div>
    //     </Stack>


    //   </Container>


    // </Box>

    <Box
      id="hero"
      sx={(theme) => ({
        width: "100%",
        padding: { xs: "100px 16px 60px 16px", md: "150px 25px 92px 25px" },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.palette.mode === "dark" ? "#090E10" : "#FFFFFF",
      })}
    >
      <Container
        sx={{
          textAlign: "center",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: { xs: "50px", md: "150px" }, // Adjusts gap dynamically
          maxWidth: "1200px",
        }}
      >
        {/* Left Content */}
        <Box
          sx={{
            textAlign: "left",
            maxWidth: "500px",
            display: "flex",
            flexDirection: "column",
            gap: 3,
            alignItems: { xs: "center", md: "flex-start" },
          }}
        >
          <Typography
            variant="h2"
            sx={(theme) => ({
              fontSize: "clamp(2rem, 5vw, 4rem)",
              fontWeight: "bold",
              color: theme.palette.mode === "dark" ? "#FFFFFF" : "#090E10",
              textAlign: { xs: "center", md: "left" },
            })}
          >
            Track, Apply, <span style={{ color: "#FF6200" }}>Succeed</span>
          </Typography>
          <Typography
            textAlign={{ xs: "center", md: "left" }}
            color="text.secondary"
            sx={{
              width: { xs: "100%", md: "80%" },
              maxWidth: "600px",
            }}
          >
            {text.map((el, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.25,
                }}
              >
                {el}{" "}
              </motion.span>
            ))}
          </Typography>
          <Button
            style={{
              backgroundColor: "#FF6200",
              color: "white",
              fontSize: "1rem",
              padding: "10px 20px",
              marginTop: 3,
            }}
            onClick={() => window.location.href = "/signup"}
          >
            Sign Up for Free
          </Button>
        </Box>

        {/* Video Section */}
        <Box
          sx={{
            maxWidth: { xs: "100%" },
            width: "100%",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
            overflow: "hidden"
       //     border: "1px white solid"
          }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "8px",
              display: "block",
            }}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        </Box>
      </Container>
    </Box>
  );
}
