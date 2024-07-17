import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, IconButton, Box, Link, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const feedbackButtonStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#FF6200', // Change to your preferred color
    borderRadius: '50%',
    width: '200px',
    height: '60px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
    cursor: 'pointer',
    zIndex: 1000 // Ensure it is on top of other elements
};

const FeedbackButton: React.FC = () => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <div style={feedbackButtonStyle} onClick={handleClickOpen}>
                Feedback
            </div>
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    Feedback
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ my: 2 }}>
                        <Typography variant="h6">Submit Your Feedback</Typography>
                        <iframe
                            src="https://docs.google.com/forms/d/e/1FAIpQLSdqDSS4GPctRIMEnwwC_Ijt6HILy2NMDo_QhvfNeSgBOn0jnw/formResponse"
                            width="100%"
                            height="500"
                            frameBorder="0"
                            marginHeight={0}
                            marginWidth={0}
                            title="Feedback Form"
                        >
                            Loading…
                        </iframe>
                    </Box>
                    <Box sx={{ my: 2 }}>
                        <Typography variant="h6">Join Our Discord</Typography>
                        <Link href="https://discord.gg/A46Ap24X" target="_blank" rel="noopener">
                            <Button variant="contained" color="primary">Join Discord</Button>
                        </Link>
                    </Box>
                    <Box sx={{ my: 2 }}>
                        <Typography variant="h6">Request Changes & Upvote</Typography>
                        <Link href="https://discord.com/channels/1252709313311674419/1262048107907125279" target="_blank" rel="noopener">
                            <Button variant="contained" color="secondary">Request & Upvote</Button>
                        </Link>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default FeedbackButton;
