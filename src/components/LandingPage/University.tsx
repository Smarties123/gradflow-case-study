import * as React from 'react';
import { useInView } from 'react-intersection-observer';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import TableRowsIcon from '@mui/icons-material/TableRows';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import GridViewIcon from '@mui/icons-material/GridView';
import './Styles/University.css';
import useMediaQuery from '@mui/material/useMediaQuery';

const items = [
  {
    icon: <GridViewIcon />,
    title: 'Dashboard',
    description: 'Dive into your personalized Dashboard, where insights and opportunities come together! Track your progress and gain a clear view of your job applications, all in one dynamic hub.',
    image: 'url("/LandingPageMedia/Insights - Dashboard.png")',
    imagePosition: 'center 20px' // Adjusting the position of the dashboard image (move it down slightly)
  },
  {
    icon: <TableRowsIcon />,
    title: 'Table',
    description: 'Discover your data like never before! Our Table feature transforms your insights into an organized and interactive experience, making it easy to analyze and strategize your job search.',
    image: 'url("/LandingPageMedia/Terminal - Table.png")', // Updated Table image
    imagePosition: 'left' // No need to move this one
  },
  {
    icon: <TipsAndUpdatesIcon />,
    title: 'Coming Soon',
    description: 'Exciting things are on the horizon! Stay tuned for our upcoming features that will elevate your job application experience to new heights!',
    image: 'url("/LandingPageMedia/Terminal - Coming Soon.png")',
    imagePosition: 'center' // Default for coming soon
  }
];

export default function University() {
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);

  const handleItemClick = (index: number) => {
    setSelectedItemIndex(index);
  };

  const selectedFeature = items[selectedItemIndex];

  return (
    <Container id="university" sx={{ py: { xs: 8, sm: 16 } }}>
      <Grid container spacing={6}>
        {/* Left-hand side: Stack with clickable items */}
        <Grid item xs={12} md={6}>
          <Typography component="h2" variant="h4" color="text.primary">
            Insights
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: { xs: 2, sm: 4 } }}>
            Insights by GradFlow is an advanced analytics dashboard that offers a comprehensive view
            of job application efforts, tracking progress, interviews, and offers, enabling improved
            outcomes in the job search journey.
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

        {/* Right-hand side: Conditionally render the image based on selected item */}
        {selectedItemIndex !== null && (
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: { xs: 'none', sm: 'flex' },
              width: '100%',
              justifyContent: 'flex-start' // Align the image to the left side
            }}
          >
            <Card
              variant="outlined"
              sx={{
                height: '100%',
                width: '100%',
                display: { xs: 'none', sm: 'flex' },
                pointerEvents: 'none',
                backgroundColor: 'transparent', // Prevent double background
              }}
            >
              <Box
                sx={{
                  m: 'auto',
                  width: '100%',  // Make it responsive
                  height: '100%', // Fill the card
                  backgroundSize: 'cover', // Ensure the image fills the card
                  backgroundPosition: selectedFeature.imagePosition, // Position image based on selected item
                  backgroundRepeat: 'no-repeat',
                  backgroundImage: selectedFeature.image, // Use selected feature's image
                }}
              />
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

function AnimatedItem({ icon, title, description, index, selectedItemIndex, handleItemClick }) {
  const { ref, inView } = useInView({ threshold: 0.1 });
  const isMobile = useMediaQuery('(max-width:600px)');

  // State to track if the item has been in view once
  const [hasBeenInView, setHasBeenInView] = React.useState(false);

  // Trigger the animation only once
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
