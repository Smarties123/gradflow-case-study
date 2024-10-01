import React from 'react';
import { Button, styled } from '@mui/material';
import FeedbackIcon from '@mui/icons-material/Feedback';

const StyledButton = styled(Button)(({ theme }) => ({
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#FF6200', // Change to your preferred color
    borderRadius: '10px',
    padding: '10px !important',
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
    zIndex: 1000, // Ensure it is on top of other elements
    fontSize: '18px !important', // Increase text size
    minWidth: '200px !important', // Set a minimum width
    textTransform: 'none', // Prevent text from being capitalized
    '& .MuiButton-startIcon': {
        marginRight: '8px', // Adjust icon spacing
    },
}));

// Put it in the function when we remove it form the sidebar
export const handleButtonClick = () => {
    window.open('https://forms.gle/VP1gkvxKpuhg1cJU9', '_blank');
};

const FeedbackButton: React.FC = () => {
    // const handleButtonClick = () => {
    //     window.open('https://forms.gle/TzuxcFinXXdRzRZQ8', '_blank');
    // };

    return (
        <StyledButton size='sm'
            variant="contained"
            onClick={handleButtonClick}
            startIcon={<FeedbackIcon />}
            className="feedback-button"
        >
            Feedback
        </StyledButton>
    );
};

export default FeedbackButton;