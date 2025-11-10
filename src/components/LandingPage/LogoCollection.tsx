import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

// Dummy API fetch function
const fetchData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        registeredUsers: 25,
        applicationsMade: 300,
        offersMade: 5,
      });
    }, 1000);
  });
};

const StatCard = ({ title, value, isLoaded, delay }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const theme = useTheme();


  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay }}
    >
      <Grid item xs={12} md={12} sx={{ p: 2 }}>
        <Box
          sx={{
            p: 4,
            borderRadius: 4,
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              '&::before': {
                opacity: 1,
              }
            },
            width: '-webkit-fill-available',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(45deg, rgba(255,98,0,0.05), transparent)',
              opacity: 0,
              transition: 'opacity 0.3s ease',
            }
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                WebkitTextFillColor: theme.palette.mode === 'dark' ? 'white' : '#FF6200',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '40px',
                  height: '2px',
                  background: '#FF6200',
                  borderRadius: '1px',
                  opacity: 0.5
                }
              }}
            >
              {isInView && isLoaded ? (
                <span>
                  <CountUp
                    start={0}
                    end={value}
                    duration={2.5}
                    separator=","
                    enableScrollSpy
                    scrollSpyOnce
                  />
                </span>
              ) : (
                <span>0</span> // fallback during load or off-screen
              )}

              <span style={{
                color: '#FF6200',
                fontSize: '0.8em',
                marginLeft: '4px'
              }}>+</span>
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 500,
                letterSpacing: '0.5px',
                color: 'text.secondary',
                textAlign: 'center',
                maxWidth: '200px',
                lineHeight: 1.4
              }}
            >
              {title}
            </Typography>
          </Box>
        </Box>
      </Grid>
    </motion.div>
  );
};

export default function CountUpSection() {
  const [data, setData] = React.useState({ registeredUsers: 0, applicationsMade: 0, offersMade: 0 });
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    const getData = async () => {
      const apiData = await fetchData();
      setData({
        registeredUsers: apiData.registeredUsers,
        applicationsMade: apiData.applicationsMade,
        offersMade: apiData.offersMade,
      });
      setIsLoaded(true);
    };
    getData();
  }, []);

  return (
    <Box
      id="countUpSection"
      sx={{
        pt: 4,
        pb: 4,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,98,0,0.2), transparent)',
        }
      }}
    >
      <Grid
        container
        justifyContent="center"
        spacing={4}
        sx={{
          mt: 0,
          position: 'relative',
          zIndex: 1,
          maxWidth: '1200px',
          mx: 'auto',
          px: 2
        }}
      >
        <StatCard
          title="Registered Users"
          value={data.registeredUsers}
          isLoaded={isLoaded}
          delay={0.1}
        />
        <StatCard
          title="Applications Made"
          value={data.applicationsMade}
          isLoaded={isLoaded}
          delay={0.2}
        />
        <StatCard
          title="Offers Made"
          value={data.offersMade}
          isLoaded={isLoaded}
          delay={0.3}
        />
      </Grid>
    </Box>
  );
}