import React from 'react';
import { Button, styled } from '@mui/material';
import FeedbackIcon from '@mui/icons-material/Feedback';

const StyledButton = styled(Button)(({ theme }) => ({
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#FF6200', // Change to your preferred color
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
    zIndex: 1000, // Ensure it is on top of other elements
    padding: '16px 32px !important', // Increase padding for a larger button
    fontSize: '24px !important', // Increase text size
    minWidth: '200px', // Set a minimum width
    textTransform: 'none', // Prevent text from being capitalized
    '& .MuiButton-startIcon': {
        marginRight: '8px', // Adjust icon spacing
    },
}));

const FeedbackButton: React.FC = () => {
    const handleButtonClick = () => {
        window.open('https://forms.gle/TzuxcFinXXdRzRZQ8', '_blank');
    };

    return (
        <StyledButton
            variant="contained"
            color="primary"
            onClick={handleButtonClick}
            startIcon={<FeedbackIcon />}
        >
            Feedback
        </StyledButton>
    );
};

export default FeedbackButton;
