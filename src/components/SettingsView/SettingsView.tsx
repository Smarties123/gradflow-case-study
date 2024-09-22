import React, { useState, useEffect } from 'react';
import { Drawer, FlexboxGrid, Divider, Form, Button, Checkbox, Col, Row, Grid } from 'rsuite';
import { useNavigate } from 'react-router-dom'; // Import useNavigate to handle navigation
import './SettingsView.less';
import { useUser } from '@/components/User/UserContext';
import DeleteAccountModal from './DeleteAccountModal';
import Avatar from 'react-avatar';


const SettingsView = ({ show, onClose }) => {
    const { user } = useUser();
    const navigate = useNavigate();  // For navigation

    const [currentView, setCurrentView] = useState('account');
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });
    const [deleteModalOpen, setDeleteModalOpen] = useState(false); // State to control modal visibility


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/profile`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setFormData({ name: data.Username, email: data.Email });
                } else {
                    console.error('Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error fetching user data', error);
            }
        };

        if (show) {
            fetchUserData();
        }
    }, [show, user.token]);

    const handleChange = (value, name) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: formData.name, email: formData.email })
            });

            if (response.ok) {
                console.log('User data updated successfully');
                onClose();  // Close drawer after saving
            } else {
                console.error('Failed to update user details');
            }
        } catch (error) {
            console.error('Error updating user details', error);
        }
    };

    // Function to handle password change redirection
    const handleChangePassword = () => {
        navigate('/ForgotPassword'); // Redirect to forgot password page
    };

    // Define the close modal function
    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
    };

    const handleDeleteAccount = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/profile`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.ok) {
                console.log('Account deleted successfully');
                // You may want to log the user out or redirect them after account deletion
                navigate('/');  // Redirect to login page after account deletion
            } else {
                console.error('Failed to delete account');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
        } finally {
            setDeleteModalOpen(false);  // Close modal after the request
        }
    };
    

    return (
        <>
            <Drawer open={show} onClose={onClose} size="sm">
                <Drawer.Header>
                    <Drawer.Title>Settings</Drawer.Title>
                    <FlexboxGrid justify="space-between" className="drawer-links">
                        <FlexboxGrid.Item>
                            <div>
                                <a
                                    onClick={() => setCurrentView('account')}
                                    className={currentView === 'account' ? 'active' : ''}
                                >
                                    Account
                                </a>
                                <Divider vertical />
                                <a
                                    onClick={() => setCurrentView('membership')}
                                    className={currentView === 'membership' ? 'active' : ''}
                                >
                                    Membership
                                </a>
                                <Divider vertical />
                                <a
                                    onClick={() => setCurrentView('notifications')}
                                    className={currentView === 'notifications' ? 'active' : ''}
                                >
                                    Notifications
                                </a>
                            </div>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                </Drawer.Header>
                <Drawer.Body>
                    {currentView === 'account' && (
                        <Form fluid>
                            <h5 className="subject-title">Account Information</h5>
                            <FlexboxGrid justify="center" align="middle" className="account-info">
                                <FlexboxGrid.Item>
                                    <Avatar
                                        email={formData.email}
                                        name={formData.name}  // Fallback to initials if no Gravatar is found
                                        size="100"
                                        round={true}
                                        // defaultAvatar="gravatar"  // Option to specify fallback if no Gravatar is found
                                    />

                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                            <Form.Group controlId="name" className="form-group">
                                <Form.ControlLabel className="formControlLabel">Name</Form.ControlLabel>
                                <Form.Control
                                    name="name"
                                    value={formData.name}
                                    onChange={value => handleChange(value, 'name')}
                                    className="full-width"
                                />
                            </Form.Group>
                            <Form.Group controlId="email" className="form-group">
                                <Form.ControlLabel className="formControlLabel">Email</Form.ControlLabel>
                                <Form.Control
                                    name="email"
                                    value={formData.email}
                                    onChange={value => handleChange(value, 'email')}
                                    className="full-width"
                                />
                            </Form.Group>
                            <Button onClick={handleSubmit} appearance="primary" block>
                                Save Name & Email
                            </Button>
                            <Divider />
                            <h5 className="subject-title">Change Password</h5>
                            <Button onClick={handleChangePassword} appearance="primary" block>
                                Change Password
                            </Button>
                            <Divider />
                            <h5 className="subject-title delete-title">Delete Account</h5>
                            <Button
                                appearance="primary"
                                block
                                style={{ backgroundColor: '#FF6200' }} // Orange button
                                onClick={() => setDeleteModalOpen(true)}  // Open modal on click
                            >
                                Delete Account
                            </Button>
                        </Form>
                    )}

                    {currentView === 'membership' && (
                        <div className="membership-tab">
                            <h5 className="subject-title">Current Plan</h5>
                            <Grid fluid>
                                <Row>
                                    <Col xs={24}>
                                        <div className="membership-plan">
                                            <div className="plan-header">
                                                <h5>Basic Plan</h5>
                                                <p>$0 per month</p>
                                            </div>
                                            <p className="plan-description">
                                                You have a GradFlow Basic subscription. Upgrade your plan by clicking the upgrade button below.
                                            </p>
                                            <Button appearance="primary" block>Upgrade</Button>
                                        </div>
                                    </Col>
                                </Row>
                                <Divider />
                                <Row>
                                    <Col xs={24}>
                                        <div className="usage-section">
                                            <h5 className="subject-title">Usage</h5>
                                            <p><strong>Jobs:</strong> 0 of 20</p>
                                            <p><strong>Data:</strong> 0</p>
                                            <p><strong>Documents:</strong> 0</p>
                                        </div>
                                    </Col>
                                </Row>
                            </Grid>
                        </div>
                    )}

                    {currentView === 'notifications' && (
                        <Form fluid className="notifications-tab">
                            <h5 className="subject-title">Email Subscriptions</h5>
                            <Grid fluid>
                                <Row>
                                    <Col xs={24}>
                                        <Form.Group controlId="weeklyUpdates">
                                            <Form.ControlLabel>Weekly Updates</Form.ControlLabel>
                                            <Checkbox
                                                name="weeklyUpdates"
                                                onChange={value => handleChange(value, 'weeklyUpdates')}
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="dailyUpdates">
                                            <Form.ControlLabel>Daily Updates</Form.ControlLabel>
                                            <Checkbox
                                                name="dailyUpdates"
                                                onChange={value => handleChange(value, 'dailyUpdates')}
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="promotionalContent">
                                            <Form.ControlLabel>Promotional Content</Form.ControlLabel>
                                            <Checkbox
                                                name="promotionalContent"
                                                onChange={value => handleChange(value, 'promotionalContent')}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Grid>
                        </Form>
                    )}
                </Drawer.Body>
            </Drawer>

            {/* Modal rendering */}
            <DeleteAccountModal 
                isOpen={deleteModalOpen} 
                onClose={handleCloseDeleteModal} 
                onDelete={handleDeleteAccount} 
            />
        </>
    );
};

export default SettingsView;
