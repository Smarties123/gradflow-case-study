import * as React from 'react';
import { useInView } from 'react-intersection-observer';
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
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import EdgesensorHighRoundedIcon from '@mui/icons-material/EdgesensorHighRounded';
import ViewQuiltRoundedIcon from '@mui/icons-material/ViewQuiltRounded';
import './Styles/University.css';
import useMediaQuery from '@mui/material/useMediaQuery';

const items = [
  {
    icon: <ViewQuiltRoundedIcon />,
    title: 'Dashboard',
    description:
      'This item could provide a snapshot of the most important metrics or data points related to the product.',
    imageLight: 'url("/static/images/templates/templates-images/dash-light.png")',
    imageDark: 'url("/static/images/templates/templates-images/dash-dark.png")'
  },
  {
    icon: <EdgesensorHighRoundedIcon />,
    title: 'Mobile integration',
    description: 'This item could provide information about the mobile app version of the product.',
    imageLight: 'url("/static/images/templates/templates-images/mobile-light.png")',
    imageDark: 'url("/static/images/templates/templates-images/mobile-dark.png")'
  },
  {
    icon: <DevicesRoundedIcon />,
    title: 'Available on all platforms',
    description:
      'This item could let users know the product is available on all platforms, such as web, mobile, and desktop.',
    imageLight: 'url("/static/images/templates/templates-images/devices-light.png")',
    imageDark: 'url("/static/images/templates/templates-images/devices-dark.png")'
  }
];

export default function University() {
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);

  const handleItemClick = (index: number) => {
    setSelectedItemIndex(index);
  };

  return (
    <Container id="university" sx={{ py: { xs: 8, sm: 16 } }}>
      <Grid container spacing={6}>
        <Grid item xs={12} md={6}>
          <Typography component="h2" variant="h4" color="text.primary">
            Insights
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: { xs: 2, sm: 4 } }}>
            Insights by GradFlow is an advanced analytics dashboard that offers a comprehensive view
            of job application efforts, tracking progress, interviews, and offers, enabling improved
            outcomes in the job search journey.
          </Typography>
          <Grid container item gap={1} sx={{ display: { xs: 'auto', sm: 'none' } }}>
            {items.map(({ title }, index) => (
              <Chip
                key={index}
                label={title}
                onClick={() => handleItemClick(index)}
                sx={{
                  borderColor: theme => (selectedItemIndex === index ? 'primary.light' : ''),
                  backgroundColor: selectedItemIndex === index ? 'primary.main' : '',
                  '& .MuiChip-label': {
                    color: selectedItemIndex === index ? '#fff' : ''
                  }
                }}
              />
            ))}
          </Grid>
          <Box
            component={Card}
            variant="outlined"
            sx={{
              display: { xs: 'auto', sm: 'none' },
              mt: 4
            }}
          >
            <Box
              sx={{
                backgroundImage: theme =>
                  theme.palette.mode === 'light'
                    ? items[selectedItemIndex].imageLight
                    : items[selectedItemIndex].imageDark,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: 280
              }}
            />
            <Box sx={{ px: 2, pb: 2 }}>
              <Typography color="text.primary" variant="body2" fontWeight="bold">
                {items[selectedItemIndex].title}
              </Typography>
              <Typography color="text.secondary" variant="body2" sx={{ my: 0.5 }}>
                {items[selectedItemIndex].description}
              </Typography>
              <Link
                color="primary"
                variant="body2"
                fontWeight="bold"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  '& > svg': { transition: '0.2s' },
                  '&:hover > svg': { transform: 'translateX(2px)' }
                }}
              >
                <span>Learn more</span>
                <ChevronRightRoundedIcon fontSize="small" sx={{ mt: '1px', ml: '2px' }} />
              </Link>
            </Box>
          </Box>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="flex-start"
            spacing={2}
            useFlexGap
            sx={{ width: '100%', display: { xs: 'none', sm: 'flex' } }}
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
