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

const tiers = [
  {
    title: 'Free Plan',
    price: '0', // Assuming free; adjust accordingly
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
    title: 'Premium Plan',
    subheader: 'Best Value',
    price: '0',
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
];
export default function Pricing() {
  return (
    <Container
      id="pricing"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
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
        <Typography component="h2" variant="h4" color="text.primary">
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
                border: tier.title === 'Premium Plan' ? '1px solid' : undefined,
                borderColor:
                  tier.title === 'Premium Plan' ? 'primary.main' : undefined,
                background:
                  tier.title === 'Premium Plan'
                    ? 'linear-gradient(#033363, #021F3B)'
                    : undefined,
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    mb: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: tier.title === 'Premium Plan' ? 'grey.100' : '',
                  }}
                >
                  <Typography component="h3" variant="h6">
                    {tier.title}
                  </Typography>
                  {tier.title === 'Premium Plan' && (
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
                    color: tier.title === 'Premium Plan' ? 'grey.50' : undefined,
                  }}
                >
                  <Typography component="h3" variant="h2">
                    £{tier.price}
                  </Typography>
                  <Typography component="h3" variant="h6">
                    &nbsp; per month
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
                          tier.title === 'Premium Plan' ? 'grey.200' : undefined,
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
                  component="a"
                  href="/material-ui/getting-started/templates/checkout/"
                  target="_blank"
                >
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
