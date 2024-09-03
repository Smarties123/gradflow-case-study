import React, { useState } from 'react';
import { Drawer, FlexboxGrid, Divider, Input, Form, Button, Avatar, Checkbox, Col, Row, Grid } from 'rsuite';
import './SettingsView.less';

const SettingsView = ({ show, onClose }) => {
    const [currentView, setCurrentView] = useState('account');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (value, name) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        console.log(formData);
        onClose();
    };

    const handleNameEmailSubmit = () => {
        console.log({
            name: formData.name,
            email: formData.email
        });
    };

    return (
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
                                <Avatar circle
                                    backgroundImage="url(https://i.pravatar.cc/150?u=2)"
                                    alt="Profile Picture"
                                    className="profile-avatar"
                                    backgroundSize="cover"
                                    backgroundPosition="center"
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
                        <Button onClick={handleNameEmailSubmit} appearance="primary" block>
                            Save Name & Email
                        </Button>
                        <Divider />
                        <h5 className="subject-title">Change Password</h5>
                        <Form.Group controlId="currentPassword" className="form-group">
                            <Form.ControlLabel className="formControlLabel">Current Password</Form.ControlLabel>
                            <Form.Control
                                name="currentPassword"
                                type="password"
                                value={formData.currentPassword}
                                onChange={value => handleChange(value, 'currentPassword')}
                                className="full-width"
                            />
                        </Form.Group>
                        <Form.Group controlId="newPassword" className="form-group">
                            <Form.ControlLabel className="formControlLabel">New Password</Form.ControlLabel>
                            <Form.Control
                                name="newPassword"
                                type="password"
                                value={formData.newPassword}
                                onChange={value => handleChange(value, 'newPassword')}
                                className="full-width"
                            />
                        </Form.Group>
                        <Form.Group controlId="confirmPassword" className="form-group">
                            <Form.ControlLabel className="formControlLabel">Confirm Password</Form.ControlLabel>
                            <Form.Control
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={value => handleChange(value, 'confirmPassword')}
                                className="full-width"
                            />
                        </Form.Group>
                        <Button onClick={handleSubmit} appearance="primary" block>
                            Save Password
                        </Button>
                    </Form>
                )}

                {/* Membership and Notifications views go here */}
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
    );
};

export default SettingsView;
