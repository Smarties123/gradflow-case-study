import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CountUp from 'react-countup';
import 'animate.css';

// Dummy API fetch function
const fetchData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        registeredUsers: 31,
        applicationsMade: 1278,
        offersMade: 17,
      });
    }, 1000);
  });
};

// Function to round up to the next multiple of 10
const roundUpToNextTen = (value) => Math.ceil(value / 10) * 10;

export default function CountUpSection() {
  const [data, setData] = React.useState({ registeredUsers: 0, applicationsMade: 0, offersMade: 0 });
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    const getData = async () => {
      const apiData = await fetchData();
      setData({
        registeredUsers: roundUpToNextTen(apiData.registeredUsers),
        applicationsMade: roundUpToNextTen(apiData.applicationsMade),
        offersMade: roundUpToNextTen(apiData.offersMade),
      });
      setIsLoaded(true); // Start animation after data is loaded
    };
    getData();
  }, []);

  return (
    <Box id="countUpSection" sx={{ py: 4, pt: 0 }}>
      <Grid container justifyContent="center" spacing={2} sx={{ mt: 0, opacity: 0.8 }}>
        {/* Registered Users CountUp */}
        <Grid item xs={12} md={3} textAlign="center" sx={{ p: 1 }}>
          <Typography variant="h4" color="text.primary">
            {isLoaded && (
              <CountUp start={0} end={data.registeredUsers} duration={2} separator="," />
            )}
            +
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mt: -1 }}>
            Registered Users
          </Typography>
        </Grid>

        {/* Applications Made CountUp */}
        <Grid item xs={12} md={3} textAlign="center" sx={{ p: 1 }}>
          <Typography variant="h4" color="text.primary">
            {isLoaded && (
              <CountUp start={0} end={data.applicationsMade} duration={2.5} separator="," />
            )}
            +
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mt: -1 }}>
            Applications Made
          </Typography>
        </Grid>

        {/* Offers Made CountUp */}
        <Grid item xs={12} md={3} textAlign="center" sx={{ p: 1 }}>
          <Typography variant="h4" color="text.primary">
            {isLoaded && (
              <CountUp start={0} end={data.offersMade} duration={2} separator="," />
            )}
            +
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mt: -1 }}>
            Offers Made
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
