import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CountUp from 'react-countup';
import 'animate.css';

export default function CountUpSection() {
  return (
    <Box id="countUpSection" sx={{ py: 4 }}>
      <Typography
        component="p"
        variant="subtitle2"
        align="center"
        color="text.secondary"
        className="animate__animated animate__bounce"
      >
        Trusted by students across the world
      </Typography>

      {/* Grid Container for Three CountUps */}
      <Grid container justifyContent="center" spacing={2} sx={{ mt: 2, opacity: 0.8 }}>
        {/* First CountUp */}
        <Grid item xs={12} md={3} textAlign="center" sx={{ p: 1 }}>
          <Typography variant="h4" color="text.primary">
            <CountUp start={0} end={37} duration={5} separator="," />
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mt: -1 }}>
            Registered Users
          </Typography>
        </Grid>

        {/* Second CountUp */}
        <Grid item xs={12} md={3} textAlign="center" sx={{ p: 1 }}>
          <Typography variant="h4" color="text.primary">
            <CountUp start={0} end={1278} duration={5} separator="," />
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mt: -1 }}>
            Applications Made
          </Typography>
        </Grid>

        {/* Third CountUp */}
        <Grid item xs={12} md={3} textAlign="center" sx={{ p: 1 }}>
          <Typography variant="h4" color="text.primary">
            <CountUp start={0} end={17} duration={5} separator="," />
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mt: -1 }}>
            Offers Made
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
