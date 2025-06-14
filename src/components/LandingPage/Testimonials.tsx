import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/system';
import Marquee from 'react-fast-marquee';
import { useInView } from 'react-intersection-observer';
import "animate.css";

/**
 * NOTE: Company logos are commented out for now — uncomment and adapt when ready.
 */

// const whiteLogos = [
//   'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560628e8573c43893fe0ace_Sydney-white.svg',
//   'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f4d520d0517ae8e8ddf13_Bern-white.svg',
//   'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f46794c159024c1af6d44_Montreal-white.svg',
//   'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/61f12e891fa22f89efd7477a_TerraLight.svg',
//   'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560a09d1f6337b1dfed14ab_colorado-white.svg',
//   'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f5caa77bf7d69fb78792e_Ankara-white.svg'
// ];

// const darkLogos = [
//   'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560628889c3bdf1129952dc_Sydney-black.svg',
//   'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f4d4d8b829a89976a419c_Bern-black.svg',
//   'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f467502f091ccb929529d_Montreal-black.svg',
//   'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/61f12e911fa22f2203d7514c_TerraDark.svg',
//   'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560a0990f3717787fd49245_colorado-black.svg',
//   'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f5ca4e548b0deb1041c33_Ankara-black.svg'
// ];

// const logoStyle = {
//   width: '64px',
//   opacity: 0.3
// };

const userTestimonials = [
  {
    avatar: <Avatar alt="Bipasha Ganatra" src="/static/images/avatar/1.jpg" />,
    name: 'Bipasha Ganatra',
    occupation: '3rd‑Year Law Student',
    testimonial:
      'As a law student applying to training contracts and vacation schemes, keeping track of deadlines across different firms was overwhelming. GradFlow helped me organise everything visually and prioritise better. The Kanban board made it easy to see where I stood with each application, and the dashboard gave me that extra motivation to stay on top of things.'
  },
  {
    avatar: <Avatar alt="Mica Gerard" src="/static/images/avatar/2.jpg" />,
    name: 'Mica Gerard',
    occupation: '3rd‑Year French Law Student',
    testimonial:
      'I apply to both French and UK law firms, so juggling deadlines and requirements in two legal systems was chaotic. GradFlow made it all manageable. I especially loved how I could track each stage of the application process and benchmark my progress—it gave me structure during a stressful time.'
  },
  {
    avatar: <Avatar alt="Lorenzo Tassellari" src="/static/images/avatar/3.jpg" />,
    name: 'Lorenzo Tassellari',
    occupation: "Master's Student – Computer Science & Mathematics",
    testimonial:
      'Tech roles often have multi‑stage interviews, coding assessments, and take‑home tasks. GradFlow helped me break down each process and stay focused. Having everything in one place—from deadlines to documents—was a game‑changer, especially when applying across platforms like LinkedIn and Glassdoor.'
  },
  {
    avatar: <Avatar alt="Aaditya Kiran Gowda" src="/static/images/avatar/4.jpg" />,
    name: 'Aaditya Kiran Gowda',
    occupation: "Master's Student – Computer Science",
    testimonial:
      'As an international student, I apply to roles in different countries and time zones. GradFlow was the only tool that kept me sane. I used the Kanban board every day to plan follow‑ups, interview prep, and application sprints. It`s like a productivity tool built specifically for job hunting—it really made a difference.'
  },
  {
    avatar: <Avatar alt="Hemish Talajia" src="/static/images/avatar/5.jpg" />,
    name: 'Hemish Talajia',
    occupation: '3rd‑Year Medical Student',
    testimonial:
      'Balancing clinical rotations with countless application deadlines felt impossible until I discovered GradFlow. The timeline view let me line up electives, research abstracts, and foundation programme forms in one place, so nothing slipped through the cracks.'
  },
  {
    avatar: <Avatar alt="Hyuk Kwon" src="/static/images/avatar/6.jpg" />,
    name: 'Hyuk Kwon',
    occupation: "Master's Student – Computer Science & Mathematics",
    testimonial:
      'Between thesis deadlines and applying for specialised quant roles, I needed a system that wouldn`t drown me in spreadsheets.GradFlow`s integrations with LinkedIn and Greenhouse saved me hours of manual entry and kept my interview prep laser‑focused.'
  }
];

export default function Testimonials() {
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
          if (prevIndex < userTestimonials.length) {
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
      id="testimonials"
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
          textAlign: 'center'
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
            Testimonials
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 700, mx: 'auto' }}
          >
            See what our customers love about GradFlow. Discover how we excel in efficiency, organisation, and satisfaction. Join us for quality, innovation, and reliable support.
          </Typography>
        </Box>

        <Box ref={ref} sx={{ width: '100%', overflow: 'hidden' }}>
          <Marquee
            pauseOnHover
            speed={20}
            gradient={false}
            className="[--duration:40s]"
            style={{
              padding: '20px 0',
              overflow: 'hidden',
            }}
          >
            {userTestimonials.map((testimonial, index) => (
              <Box
                key={index}
                sx={{
                  width: '300px',
                  mx: 2,
                  transition: 'transform 0.3s ease-in-out',
                  opacity: animateIndex > index ? 1 : 0,
                  transform: animateIndex > index ? 'translateY(0)' : 'translateY(20px)',
                  animationDelay: `${index * 0.2}s`,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  }
                }}
              >
                <Card
                  className="animate__animated animate__fadeInUp"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    flexGrow: 1,
                    p: 1,
                    height: '100%',
                    background: theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.02)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid',
                    borderColor: theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                      borderColor: 'primary.main',
                    }
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: '0.9rem',
                        lineHeight: 1.6,
                        mb: 2
                      }}
                    >
                      {testimonial.testimonial}
                    </Typography>
                  </CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      pr: 2,
                      borderTop: '1px solid',
                      borderColor: theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(0, 0, 0, 0.1)',
                      pt: 1
                    }}
                  >
                    <CardHeader
                      avatar={testimonial.avatar}
                      title={
                        <Typography variant="subtitle2" fontWeight="bold">
                          {testimonial.name}
                        </Typography>
                      }
                      subheader={
                        <Typography variant="caption" color="text.secondary">
                          {testimonial.occupation}
                        </Typography>
                      }
                      sx={{
                        p: 0,
                        '& .MuiCardHeader-avatar': {
                          mr: 1
                        }
                      }}
                    />
                  </Box>
                </Card>
              </Box>
            ))}
          </Marquee>
        </Box>
      </Container>
    </Box>
  );
}
