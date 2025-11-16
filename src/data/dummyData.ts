import { Column, Card } from '../pages/board/types';

// Dummy user object
export const dummyUser = {
  email: 'demo@gradflow.com',
  username: 'Demo User',
  token: 'demo-token-12345',
  id: 1,
  isMember: true, // Premium features enabled for demo
};

// Initial columns/statuses
export const initialColumns: Column[] = [
  { 
    id: 1, 
    title: 'Applied', 
    cards: [
      {
        id: '1',
        company: 'Google',
        position: 'Software Engineer',
        deadline: '2024-12-31',
        location: 'Mountain View, CA',
        url: 'https://careers.google.com',
        notes: 'Great opportunity at Google',
        salary: 150000,
        interview_stage: 'Applied',
        data_applied: '2024-01-15',
        card_color: '#3498db',
        job_id: 1,
        Favourite: true,
      },
      {
        id: '2',
        company: 'Microsoft',
        position: 'Frontend Developer',
        deadline: '2024-12-20',
        location: 'Seattle, WA',
        url: 'https://careers.microsoft.com',
        notes: 'Excited about this role',
        salary: 140000,
        interview_stage: 'Applied',
        data_applied: '2024-01-10',
        card_color: '#1abc9c',
        job_id: 2,
        Favourite: false,
      },
    ]
  },
  { 
    id: 2, 
    title: 'Assessment', 
    cards: [
      {
        id: '3',
        company: 'Amazon',
        position: 'Full Stack Engineer',
        deadline: '2024-12-25',
        location: 'Seattle, WA',
        url: 'https://www.amazon.jobs',
        notes: 'Completed coding assessment',
        salary: 145000,
        interview_stage: 'Assessment',
        data_applied: '2024-01-05',
        card_color: '#ff6200',
        job_id: 3,
        Favourite: false,
      },
    ]
  },
  { 
    id: 3, 
    title: 'Rejected', 
    cards: []
  },
  { 
    id: 4, 
    title: 'Accepted', 
    cards: []
  },
];

// Sample file types
export const dummyFileTypes = [
  { FileTypeId: 1, TypeName: 'CV', Description: 'Curriculum Vitae' },
  { FileTypeId: 2, TypeName: 'CL', Description: 'Cover Letter' },
];

// Initial files (empty for demo)
export const initialFiles: any[] = [];

// Helper to generate unique IDs for new cards
let cardIdCounter = 100;
export const generateCardId = (): string => {
  return String(cardIdCounter++);
};

// Helper to generate unique IDs for new files
let fileIdCounter = 1;
export const generateFileId = (): number => {
  return fileIdCounter++;
};



