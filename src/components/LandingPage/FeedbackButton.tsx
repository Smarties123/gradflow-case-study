import React from 'react';
import { Button } from '@mui/material';
import FeedbackIcon from '@mui/icons-material/Feedback';

const feedbackButtonStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#FF6200', // Change to your preferred color
    borderRadius: '50px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
    zIndex: 1000, // Ensure it is on top of other elements
    padding: '16px 24px', // Increase padding for a larger button
    fontSize: '18px', // Increase text size
    minWidth: '200px', // Set a minimum width
    textTransform: 'none' // Prevent text from being capitalized
};

const FeedbackButton: React.FC = () => {
    const handleButtonClick = () => {
        window.open('https://forms.gle/TzuxcFinXXdRzRZQ8', '_blank');
    };

    return (
        <Button
            variant="contained"
            color="primary"
            onClick={handleButtonClick}
            startIcon={<FeedbackIcon />}
            style={feedbackButtonStyle}
        >
            Feedback
        </Button>
    );
};

export default FeedbackButton;
