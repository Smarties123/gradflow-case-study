import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function FAQ() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [expandedIds, setExpandedIds] = React.useState<string[]>([]);

  const faqItems = [
    {
      id: 'panel1',
      question: 'How do I contact customer support if I have a question or issue?',
      answer: 'You can reach our customer support team by emailing gradflowinc@gmail.com or use our feedback button.'
    },
    {
      id: 'panel2',
      question: 'How do I add a new job application?',
      answer: 'To add a new job application, click on the Add New button at the top of the application board or in the columns. Fill in the necessary details such as job title, company name, position, and stage of application (Applied, Interview, Offered, etc.).'
    },
    {
      id: 'panel3',
      question: 'What makes GradFlow different from other job tracking tools?',
      answer: 'GradFlow is specifically designed for students and recent graduates, helping you organize your graduate or job applications in an intuitive way. It includes features like customizable stages, company logos, progress dashboards, and a clean user interface tailored for managing multiple applications at different stages.'
    },
    {
      id: 'panel4',
      question: 'How do I move a job application between stages?',
      answer: 'To move a job application between stages (e.g., from Applied to Interview), simply drag and drop the application card from one column to another on the job tracking board.'
    }
  ];

  const filteredItems = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  React.useEffect(() => {
    if (searchQuery) {
      const matchedIds = faqItems
        .filter(item =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(item => item.id);

      setExpandedIds(matchedIds);
    } else {
      setExpandedIds([]); // collapse all
    }
  }, [searchQuery]);

  return (
    <Container
      id="faq"
      sx={{
        pt: { xs: 4, sm: 10 },
        pb: { xs: 4, sm: 10 },
        color: theme.palette.mode === 'dark' ? 'white' : '#0a0e0f',
        bgcolor: theme.palette.mode === 'dark' ? '#0a0e0f' : 'white',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,98,0,0.2), transparent)',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,98,0,0.2), transparent)',
        }
      }}
    >
      <Typography
        component="h2"
        variant="h4"
        color="text.primary"
        sx={{
          width: { sm: '100%', md: '60%' },
          textAlign: { sm: 'left', md: 'center' },
          background: 'linear-gradient(90deg, #FF6200, #FF8A00)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 2
        }}
      >
        Frequently asked questions
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search FAQs..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ maxWidth: '600px', mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Box sx={{ width: '100%' }}>
        {filteredItems.map((item) => (
          <Accordion
            key={item.id}
            expanded={expandedIds.includes(item.id)}
            onChange={() => {
              setExpandedIds(prev =>
                prev.includes(item.id)
                  ? prev.filter(id => id !== item.id)
                  : [...prev, item.id]
              );
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${item.id}-content`}
              id={`${item.id}-header`}
            >
              <Typography component="h3" variant="subtitle2">
                {item.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" gutterBottom sx={{ maxWidth: { sm: '100%', md: '80%' } }}>
                {item.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  );
}
