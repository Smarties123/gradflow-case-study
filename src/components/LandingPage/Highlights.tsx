import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ViewQuiltRoundedIcon from "@mui/icons-material/ViewQuiltRounded";
import EdgesensorHighRoundedIcon from "@mui/icons-material/EdgesensorHighRounded";
import BackupTableIcon from '@mui/icons-material/BackupTable';
import GridViewIcon from '@mui/icons-material/GridView';
import DescriptionIcon from '@mui/icons-material/Description';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import ExtensionIcon from '@mui/icons-material/Extension';
import 'animate.css'; // Import animate.css

const items = [
  {
    icon: <ViewQuiltRoundedIcon />,
    title: 'Panel',
    description:
      'Visualize your job application journey like never before! Helping you stay on track and motivated as you chase your dream job',
  },
  {
    icon: <EdgesensorHighRoundedIcon />,
    title: 'Drag and Drop',
    description:
      'Take control of your job hunt with our dynamic drag-and-drop feature! Effortlessly organize your applications and tailor your roadmap',
  },
  {
    icon: <DescriptionIcon />,
    title: 'Files',
    description:
      'Effortlessly upload and manage your CVs and cover letters for every job application, all in one place!',
  },
  {
    icon: <GridViewIcon />,
    title: 'Dashboard',
    description:
      'Explore your personalized Dashboard—where insights meet opportunities! Stay on top of your progress and get a clear overview of your job applications, all in one space',
  },

  {
    icon: <ExtensionIcon />,
    title: 'Google Extension',
    description:
      'Coming Soon: Boost your job search efficiency with the GradFlow Google Extension! Seamlessly track applications, organize your workflow, and gain insights directly from your browser while you browse job listings.',
  },
  {
    icon: <TipsAndUpdatesIcon />,
    title: 'Excel To Flow',
    description:
      'Coming Soon: Import your Excel files effortlessly and watch as GradFlow automatically creates and organizes cards into their respective categories!',
  },
];

export default function Highlights() {
  const [animateIndex, setAnimateIndex] = React.useState(0);
  const theme = useTheme(); // Get the current theme (light or dark)

  // Trigger animation once the component has mounted
  React.useEffect(() => {
    const timer = setInterval(() => {
      if (animateIndex < items.length) {
        setAnimateIndex((prevIndex) => prevIndex + 1);
      }
    }, 300); // Adjust delay for sequential animation

    return () => clearInterval(timer); // Cleanup the timer on unmount
  }, [animateIndex]);

  return (
    <Box
      id="highlights"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: theme.palette.mode === 'dark' ? 'white' : '#0a0e0f', // Adjust text color based on the theme
        bgcolor: theme.palette.mode === 'dark' ? '#0a0e0f' : 'white', // Adjust background color based on the theme
      }}
    >
      <Container
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Grid container spacing={3.5}>
          {items.map((item, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={index}
              className={`animate__animated animate__fadeInUp`} // Use animate.css class
              sx={{
                opacity: animateIndex > index ? 1 : 0,
                transform: animateIndex > index ? 'translateY(0)' : 'translateY(20px)', // Apply translation for animation
                transition: 'opacity 0.6s ease, transform 0.6s ease',
                animationDelay: `${index * 0.3}s`, // Stagger animations based on the index
              }}
            >
              <Stack
                direction="column"
                color="inherit"
                component={Card}
                spacing={1}
                useFlexGap
                sx={{
                  p: 3,
                  height: '100%',
                  boxShadow: theme.palette.mode === 'dark' ? 'none' : '0px 3px 9px rgba(0, 0, 0, 0.2)', // Light mode: Stronger shadow

                  border: 'none',
                  // borderColor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300', // Border color based on the theme
                  background: 'transparent',
                  // backgroundColor: theme.palette.mode === 'dark' ? 'grey.900' : 'white', // Background color based on the theme
                }}
              >
                <Box sx={{ opacity: '80%' }}>{item.icon}</Box>
                <div>
                  <Typography variant="h6" style={{ fontWeight: 600 }} gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: theme.palette.mode === 'dark' ? 'grey.400' : 'grey.800' }}>
                    {item.description}
                  </Typography>
                </div>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
