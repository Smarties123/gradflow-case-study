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
  const theme = useTheme();

  React.useEffect(() => {
    const timer = setInterval(() => {
      if (animateIndex < items.length) {
        setAnimateIndex((prevIndex) => prevIndex + 1);
      }
    }, 200);

    return () => clearInterval(timer);
  }, [animateIndex]);

  return (
    <Box
      id="highlights"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
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
      <Container
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Grid container spacing={4}>
          {items.map((item, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={index}
              className={`animate__animated animate__fadeInUp`}
              sx={{
                opacity: animateIndex > index ? 1 : 0,
                transform: animateIndex > index ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                animationDelay: `${index * 0.2}s`,
              }}
            >
              <Stack
                direction="column"
                color="inherit"
                component={Card}
                spacing={2}
                useFlexGap
                sx={{
                  p: 4,
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 8px 24px rgba(255, 255, 255, 0.1)'
                      : '0 8px 24px rgba(0, 0, 0, 0.12)',
                    '& .icon-wrapper': {
                      transform: 'scale(1.1)',
                      color: theme.palette.mode === 'dark' ? 'white' : theme.palette.primary.main,
                    },
                  },
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)'
                    : 'linear-gradient(145deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.01) 100%)',
                  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)'}`,
                  borderRadius: 2,
                  backdropFilter: theme.palette.mode === 'dark' ? 'blur(10px)' : 'none',
                }}
              >
                <Box
                  className="icon-wrapper"
                  sx={{
                    opacity: 0.9,
                    transition: 'all 0.3s ease-in-out',
                    color: theme.palette.mode === 'dark' ? 'white' : theme.palette.primary.main,
                    '& svg': {
                      fontSize: '2.5rem',
                    }
                  }}
                >
                  {item.icon}
                </Box>
                <div>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      color: theme.palette.mode === 'dark' ? 'white' : theme.palette.primary.main,
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'grey.700',
                      lineHeight: 1.6,
                    }}
                  >
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
