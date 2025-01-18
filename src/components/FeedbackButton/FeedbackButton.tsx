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
    transition: 'transform 0.3s ease', // Add a smooth transition for transform
    '& .MuiButton-startIcon': {
        marginRight: '8px', // Adjust icon spacing
    },
    '&:hover': {
        transform: 'scale(1.1)', // Increase size slightly on hover
        boxShadow: '0 4px 15px rgba(0,0,0,0.4)', // Add a stronger shadow on hover
    },
    '&:active': {
        transform: 'scale(1)', // Ensure it returns to the original size when clicked
    },
}));

export const handleButtonClick = () => {
    window.open('https://forms.gle/VP1gkvxKpuhg1cJU9', '_blank');
};

const FeedbackButton: React.FC = () => {
    return (
        <StyledButton
            size="sm"
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
