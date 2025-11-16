import { Column } from '../pages/board/types';

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


// Helper to generate unique IDs for new cards
let cardIdCounter = 100;
export const generateCardId = (): string => {
  return String(cardIdCounter++);
};

// Helper to generate unique IDs for new files
// Start from 5 since we have 4 sample files (IDs 1-4)
let fileIdCounter = 5;
export const generateFileId = (): number => {
  return fileIdCounter++;
};

// Helper function to create sample file with data URL
const createSampleFile = (
  fileId: number,
  typeId: number,
  fileName: string,
  extens: string,
  description: string,
  applicationsIds: number[] = []
) => {
  // Create a simple data URL for a PDF-like placeholder
  // This is a minimal PDF structure that browsers can display
  const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 <<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
>>
>>
>>
endobj
4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(Sample ${typeId === 1 ? 'CV' : 'Cover Letter'}) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000306 00000 n
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
400
%%EOF`;

  // Create a Blob from the PDF content
  const blob = new Blob([pdfContent], { type: 'application/pdf' });
  const fileUrl = URL.createObjectURL(blob);

  return {
    fileId,
    typeId,
    fileType: typeId === 1 ? 'CV' : 'CL', // Add fileType for Files component
    fileUrl,
    fileName,
    extens,
    description,
    ApplicationIds: applicationsIds,
    createdAt: new Date().toISOString(),
  };
};

// Initial files with sample data
export const initialFiles: any[] = [
  createSampleFile(
    1,
    1, // CV
    'John_Doe_Resume.pdf',
    'pdf',
    'Updated resume with latest experience',
    [1, 2] // Linked to Google and Microsoft applications
  ),
  createSampleFile(
    2,
    1, // CV
    'Software_Engineer_CV_2024.pdf',
    'pdf',
    'Tailored CV for software engineering roles',
    [3] // Linked to Amazon application
  ),
  createSampleFile(
    3,
    2, // Cover Letter
    'Google_Cover_Letter.pdf',
    'pdf',
    'Cover letter for Google Software Engineer position',
    [1] // Linked to Google application
  ),
  createSampleFile(
    4,
    2, // Cover Letter
    'Microsoft_Cover_Letter.pdf',
    'pdf',
    'Cover letter tailored for Microsoft Frontend Developer role',
    [2] // Linked to Microsoft application
  ),
];
