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
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import EdgesensorHighRoundedIcon from '@mui/icons-material/EdgesensorHighRounded';
import ViewQuiltRoundedIcon from '@mui/icons-material/ViewQuiltRounded';
import './Styles/Student.css';
import 'animate.css';

const items = [
  {
    icon: <ViewQuiltRoundedIcon />,
    title: 'Panel',
    description: 'Snapshot of the most important metrics or data points related to the product.',
    imageLight: 'url("/static/images/templates/templates-images/dash-light.png")',
    imageDark: 'url("/static/images/templates/templates-images/dash-dark.png")',
  },
  {
    icon: <EdgesensorHighRoundedIcon />,
    title: 'Quick Add (Potential Job Add Feature)',
    description: 'Information about the mobile app version of the product.',
    imageLight: 'url("/static/images/templates/templates-images/mobile-light.png")',
    imageDark: 'url("/static/images/templates/templates-images/mobile-dark.png")',
  },
  {
    icon: <DevicesRoundedIcon />,
    title: '(Another potential feature)',
    description: 'Available on web, mobile, and desktop.',
    imageLight: 'url("/static/images/templates/templates-images/devices-light.png")',
    imageDark: 'url("/static/images/templates/templates-images/devices-dark.png")',
  },
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
            The Terminal by GradFlow transcends traditional spreadsheets with customizable tiles for each job application, proactive alerts, and drag-and-drop organization.
          </Typography>
          <Stack direction="column" justifyContent="center" alignItems="flex-start" spacing={2} useFlexGap sx={{ width: '100%' }}>
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
          <Card variant="outlined" sx={{ height: '100%', width: '100%', display: { xs: 'none', sm: 'flex' }, pointerEvents: 'none' }}>
            <Box
              sx={{
                m: 'auto',
                width: 420,
                height: 500,
                backgroundSize: 'contain',
                backgroundImage: (theme) =>
                  theme.palette.mode === 'light'
                    ? items[selectedItemIndex].imageLight
                    : items[selectedItemIndex].imageDark,
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

  return (
    <Card
      ref={ref}
      variant="outlined"
      className={inView ? 'fade-in' : 'fade-out'}
      onClick={() => handleItemClick(index)}
      sx={{
        p: 3,
        height: 'fit-content',
        width: '100%',
        background: 'none',
        backgroundColor: selectedItemIndex === index ? 'action.selected' : undefined,
        borderColor: (theme) =>
          selectedItemIndex === index
            ? 'primary.light'
            : theme.palette.mode === 'light'
              ? 'grey.200'
              : 'grey.800',
      }}
    >
      <Box sx={{ width: '100%', display: 'flex', textAlign: 'left', flexDirection: 'row', alignItems: 'center', gap: 2.5 }}>
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
              '&:hover > svg': { transform: 'translateX(2px)' },
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
