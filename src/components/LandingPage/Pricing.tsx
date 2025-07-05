import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { redirect } from 'react-router-dom';

const tiers = [
  {
    title: 'Free Plan',
    price: '0', // Assuming free; adjust accordingly
    timePeriod: 'per month',
    description: [
      'Track up to 20 active applications',
      'Access to basic dashboards',
      'Store up to 5 CVs & Cover Letters',
      'Receive standard email notifications for deadlines and updates',
    ],
    buttonText: 'Get Started for Free',
    buttonVariant: 'outlined',
  },
  {
    title: 'Premium Plan ',
    subheader: 'Best Value',
    price: '49.99',
    timePeriod: 'per year',
    description: [
      'Unlimited application tracking for complete flexibility',
      'Comprehensive dashboard analytics and insights',
      'Unlimited CVs & Cover Letters',
      'Enhanced email notifications with customization options',
      'Assign up to 5 applications to a CV/CL'
    ],
    buttonText: 'Upgrade to Premium',
    buttonVariant: 'contained',
  },
  {
    title: 'Premium Plan',
    price: '4.99', // Assuming free; adjust accordingly
    timePeriod: 'per month',
    description: [
      'Unlimited application tracking for complete flexibility',
      'Comprehensive dashboard analytics and insights',
      'Unlimited CVs & Cover Letters',
      'Enhanced email notifications with customization options',
      'Assign up to 5 applications to a CV/CL'
    ],
    buttonText: 'Upgrade to Premium',
    buttonVariant: 'outlined',
  },
];

const handleCheckout = async (plan: string) => {
  console.log('Plan selected:', plan);

  // if plan is premium the nsave it in localstorage
  if (plan) {
    localStorage.setItem("pendingPlan", plan);
    console.log("Setted Premium in local storage")
  }
  window.location.href = "SignIn";
};

export default function Pricing() {
  return (
    <Container
      id="pricing"
      sx={{
        pt: { xs: 4, sm: 10 },
        pb: { xs: 4, sm: 10 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
      }}
    >
      <Box
        sx={{
          width: { sm: '100%', md: '60%' },
          textAlign: { sm: 'left', md: 'center' },
        }}
      >
        <Typography component="h2" variant="h4" color="text.primary" sx={{
          background: 'linear-gradient(90deg, #FF6200, #FF8A00)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 2
        }}>
          Pricing
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover flexible pricing options tailored to help you achieve your dream job. Upgrade at any time to unlock advanced features and benefits.


        </Typography>
      </Box>
      <Grid container spacing={3} alignItems="center" justifyContent="center">
        {tiers.map((tier) => (
          <Grid
            item
            key={tier.title}
            xs={12}
            sm={tier.title === 'Enterprise' ? 12 : 6}
            md={4}
          >
            <Card
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                border: tier.title === 'Premium Plan ' ? '1px solid' : undefined,
                borderColor: tier.title === 'Premium Plan ' ? 'primary.main' : undefined,
                background: tier.title === 'Premium Plan '
                  ? 'linear-gradient(#033363, #021F3B)'
                  : undefined,
                // Isolate the background effect
                isolation: 'isolate',
                // Ensure text colors are contained within this card
                '& *': {
                  color: tier.title === 'Premium Plan ' ? 'white' : 'inherit',
                },
                // Override for specific elements that should keep their original colors
                '& .MuiTypography-root': {
                  color: tier.title === 'Premium Plan ' ? 'white' : 'text.primary',
                },
                '& .MuiLink-root': {
                  color: tier.title === 'Premium Plan ' ? 'grey.300' : 'text.secondary',
                }
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    mb: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: tier.title === 'Premium Plan ' ? 'grey.100' : '',
                  }}
                >
                  <Typography component="h3" variant="h6">
                    {tier.title}
                  </Typography>
                  {tier.title === 'Premium Plan ' && (
                    <Chip
                      icon={<AutoAwesomeIcon />}
                      label={tier.subheader}
                      size="small"
                      sx={{
                        backgroundColor: '#FF6200 !important', // Force black background
                        '& .MuiChip-label': {
                          color: 'white !important', // Force white label color
                        },
                        '& .MuiChip-icon': {
                          color: 'white !important', // Force white icon color
                        },
                        boxShadow: 'none', // Remove any shadow that might create a gradient effect
                        backgroundImage: 'none !important', // Ensure no gradient background
                        padding: '15px 4px',
                      }}
                    />
                  )}

                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'baseline',
                    color: tier.title === 'Premium Plan ' ? 'grey.50' : undefined,
                  }}
                >
                  <Typography component="h3" variant="h2">
                    £{tier.price}
                  </Typography>
                  <Typography component="h3" variant="h6">
                    &nbsp;{tier.timePeriod}
                  </Typography>
                </Box>
                <Divider
                  sx={{
                    my: 2,
                    opacity: 0.2,
                    borderColor: 'grey.500',
                  }}
                />
                {tier.description.map((line) => (
                  <Box
                    key={line}
                    sx={{
                      py: 1,
                      display: 'flex',
                      gap: 1.5,
                      alignItems: 'center',
                    }}
                  >
                    <CheckCircleRoundedIcon
                      sx={{
                        width: 20,
                        color:
                          tier.title === 'Premium Plan'
                            ? 'primary.light'
                            : 'primary.main',
                      }}
                    />
                    <Typography
                      component="text"
                      variant="subtitle2"
                      sx={{
                        color:
                          tier.timePeriod === 'per year' && 'white',
                      }}
                    >
                      {line}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant={tier.buttonVariant as 'outlined' | 'contained'}
                  onClick={() => {
                    let plan = '';
                    if (tier.title === 'Free Plan') plan = 'free';
                    else if (tier.title === 'Premium Plan (Monthly)') plan = 'monthly';
                    else if (tier.title === 'Premium Plan ') plan = 'yearly';
                    handleCheckout(plan);
                  }}>

                  {tier.buttonText}
                </Button>

              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
