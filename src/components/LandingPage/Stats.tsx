import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Container, Grid, Typography, Card } from '@mui/material';
import { useInView } from 'react-intersection-observer';
import 'animate.css';

export default function Stats() {
    const theme = useTheme();
    const [animateIndex, setAnimateIndex] = React.useState(0);
    const { ref, inView } = useInView({
        threshold: 0.1,
        triggerOnce: true
    });

    React.useEffect(() => {
        if (inView) {
            const timer = setInterval(() => {
                setAnimateIndex((prevIndex) => {
                    if (prevIndex < stats.length) {
                        return prevIndex + 1;
                    }
                    clearInterval(timer);
                    return prevIndex;
                });
            }, 200);

            return () => clearInterval(timer);
        }
    }, [inView]);

    return (
        <Box
            id="stats"
            sx={{
                pt: { xs: 4, sm: 8 },
                pb: { xs: 4, sm: 8 },
                color: theme.palette.mode === 'dark' ? 'white' : '#0a0e0f',
                bgcolor: theme.palette.mode === 'dark' ? '#0a0e0f' : 'white',
                position: 'relative',
            }}
        >
            <Container
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: { xs: 3, sm: 6 },
                }}
            >
                <Box sx={{ width: { sm: '100%', md: '60%' }, textAlign: { sm: 'left', md: 'center' } }}>
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        gutterBottom
                        sx={{
                            background: 'linear-gradient(90deg, #FF6200, #FF8A00)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 2
                        }}
                    >
                        Our Impact
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mb: 4, maxWidth: 700, mx: 'auto' }}
                    >
                        Join thousands of job seekers who have transformed their application process with GradFlow. Our platform has helped countless individuals land their dream jobs through better organization and insights.
                    </Typography>
                </Box>

                <Grid container spacing={4} ref={ref}>
                    {stats.map((stat, index) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                            key={index}
                            sx={{
                                opacity: animateIndex > index ? 1 : 0,
                                transform: animateIndex > index ? 'translateY(0)' : 'translateY(20px)',
                                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                animationDelay: `${index * 0.2}s`,
                            }}
                        >
                            <Card
                                className="animate__animated animate__fadeInUp"
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    background: theme.palette.mode === 'dark'
                                        ? 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)'
                                        : 'linear-gradient(145deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.01) 100%)',
                                    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)'}`,
                                    borderRadius: 2,
                                    backdropFilter: theme.palette.mode === 'dark' ? 'blur(10px)' : 'none',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: theme.palette.mode === 'dark'
                                            ? '0 8px 24px rgba(255, 255, 255, 0.1)'
                                            : '0 8px 24px rgba(0, 0, 0, 0.12)',
                                        borderColor: theme.palette.primary.main,
                                    },
                                }}
                            >
                                <Typography
                                    variant="h3"
                                    component="div"
                                    sx={{
                                        fontWeight: 'bold',
                                        mb: 1,
                                        background: 'linear-gradient(90deg, #FF6200, #FF8A00)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    {stat.value}
                                </Typography>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: theme.palette.mode === 'dark' ? 'white' : theme.palette.primary.main,
                                        fontWeight: 600,
                                        mb: 1,
                                    }}
                                >
                                    {stat.label}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'grey.700',
                                    }}
                                >
                                    {stat.description}
                                </Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
} 