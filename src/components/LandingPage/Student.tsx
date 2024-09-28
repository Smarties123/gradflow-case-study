import * as React from 'react';
import { useInView } from 'react-intersection-observer'; // Importing useInView
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import EdgesensorHighRoundedIcon from '@mui/icons-material/EdgesensorHighRounded';
import ViewQuiltRoundedIcon from '@mui/icons-material/ViewQuiltRounded';
import './Styles/Student.css';
import 'animate.css';
import useMediaQuery from '@mui/material/useMediaQuery';

const items = [
  {
    icon: <ViewQuiltRoundedIcon />,
    title: 'Panel',
    description: 'Visualize your job application journey like never before! Helping you stay on track and motivated as you chase your dream job',
    image: 'url("/LandingPageMedia/Terminal - Kanban Board.png")'
  },
  {
    icon: <EdgesensorHighRoundedIcon />,
    title: 'Drag and Drop',
    description: 'Take control of your job hunt with our dynamic drag-and-drop feature! Effortlessly organize your applications and tailor your roadmap',
    image: 'url("/LandingPageMedia/Terminal - Kanban Board Moving Card.png")',
  },
  {
    icon: <LibraryAddIcon />,
    title: 'Quick Add',
    description: 'Instantly capture and organize your job applications with just a click, making your journey to landing that dream job faster and easier than ever!',
    image: 'url("/LandingPageMedia/Terminal - Add Job.png")',
  }
];

export default function Student() {
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);

  const handleItemClick = (index: number) => {
    setSelectedItemIndex(index);
  };

  const selectedFeature = items[selectedItemIndex];

  return (
    <Container id="student" sx={{ py: { xs: 8, sm: 16 } }}>
      <Grid container spacing={6}>
        <Grid item xs={12} md={6}>
          <Typography component="h2" variant="h4" color="text.primary">
            The GradFlow Terminal
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: { xs: 2, sm: 4 } }}>
            The Terminal by GradFlow transcends traditional spreadsheets with customizable tiles for
            each job application, proactive alerts, and drag-and-drop organization.
          </Typography>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="flex-start"
            spacing={2}
            useFlexGap
            sx={{ width: '100%' }}
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
        <Grid item xs={12} md={6} sx={{ display: { xs: 'none', sm: 'flex' }, width: '100%' }}>
          <Card
            variant="outlined"
            sx={{
              height: '100%',
              width: '100%',
              display: { xs: 'none', sm: 'flex' },
              pointerEvents: 'none'
            }}
          >
            <Box
              sx={{
                m: 'auto',
                width: 420,
                height: 500,
                backgroundSize: 'contain',
                backgroundImage: items[selectedItemIndex].image
              }}
            />
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

function AnimatedItem({ icon, title, description, index, selectedItemIndex, handleItemClick }) {
  const { ref, inView } = useInView({ threshold: 0.1 });
  const isMobile = useMediaQuery('(max-width:600px)');

  // State to track if the item has been in view once
  const [hasBeenInView, setHasBeenInView] = React.useState(false);

  // Update the state when the element is in view for the first time
  React.useEffect(() => {
    if (inView && !hasBeenInView) {
      setHasBeenInView(true);
    }
  }, [inView, hasBeenInView]);

  return (
    <Card
      ref={ref}
      variant="outlined"
      className={isMobile ? '' : hasBeenInView ? 'fade-in' : 'fade-out'} // Apply animation only once
      onClick={() => handleItemClick(index)}
      sx={{
        p: 3,
        height: 'fit-content',
        width: '100%',
        background: 'none',
        backgroundColor: selectedItemIndex === index ? 'action.selected' : undefined,
        borderColor: theme =>
          selectedItemIndex === index
            ? 'primary.light'
            : theme.palette.mode === 'light'
              ? 'grey.200'
              : 'grey.800'
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          textAlign: 'left',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 2.5
        }}
      >
        <Box sx={{ color: selectedItemIndex === index ? 'primary.main' : 'grey.300' }}>{icon}</Box>
        <Box sx={{ textTransform: 'none' }}>
          <Typography color="text.primary" variant="body2" fontWeight="bold">
            {title}
          </Typography>
          <Typography color="text.secondary" variant="body2" sx={{ my: 0.5 }}>
            {description}
          </Typography>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              color: 'primary',
              '& > svg': { transition: '0.2s' },
              '&:hover > svg': { transform: 'translateX(2px)' }
            }}
          >
            <span>Learn more</span>
            <ChevronRightRoundedIcon fontSize="small" sx={{ mt: '1px', ml: '2px' }} />
          </Box>
        </Box>
      </Box>
    </Card>
  );
}
