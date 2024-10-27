import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
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

  React.useEffect(() => {
    const getData = async () => {
      const apiData = await fetchData();
      setData({
        registeredUsers: roundUpToNextTen(apiData.registeredUsers),
        applicationsMade: roundUpToNextTen(apiData.applicationsMade),
        offersMade: roundUpToNextTen(apiData.offersMade),
      });
    };
    getData();
  }, []);

  return (
    <Box id="countUpSection" sx={{ py: 4, pt: 0 }}>
      <Grid container justifyContent="center" spacing={2} sx={{ mt: 0, opacity: 0.8 }}>
        {/* First CountUp */}
        <Grid item xs={12} md={3} textAlign="center" sx={{ p: 1 }}>
          <Typography variant="h4" color="text.primary">
            {data.registeredUsers}+
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mt: -1 }}>
            Registered Users
          </Typography>
        </Grid>

        {/* Second CountUp */}
        <Grid item xs={12} md={3} textAlign="center" sx={{ p: 1 }}>
          <Typography variant="h4" color="text.primary">
            {data.applicationsMade}+
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mt: -1 }}>
            Applications Made
          </Typography>
        </Grid>

        {/* Third CountUp */}
        <Grid item xs={12} md={3} textAlign="center" sx={{ p: 1 }}>
          <Typography variant="h4" color="text.primary">
            {data.offersMade}+
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mt: -1 }}>
            Offers Made
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
