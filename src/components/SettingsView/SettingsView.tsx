import React, { useState } from 'react';
import { Drawer, FlexboxGrid, Divider, Input, Form, Button, Grid, Row, Col } from 'rsuite';
import './SettingsView.less';

const SettingsView = ({ show, onClose, card, updateCard }) => {
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
        // Handle form submission logic here
        onClose();
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
                        <Grid fluid>
                            <Row gutter={10}>
                                <Col xs={24}>
                                    <Form.Group controlId="name" className="form-group">
                                        <Form.ControlLabel className="formControlLabel">Name</Form.ControlLabel>
                                        <Form.Control
                                            name="name"
                                            value={formData.name}
                                            onChange={value => handleChange(value, 'name')}
                                            className="full-width"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row gutter={10}>
                                <Col xs={24}>
                                    <Form.Group controlId="email" className="form-group">
                                        <Form.ControlLabel className="formControlLabel">Email</Form.ControlLabel>
                                        <Form.Control
                                            name="email"
                                            value={formData.email}
                                            onChange={value => handleChange(value, 'email')}
                                            className="full-width"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row gutter={10}>
                                <Col xs={24}>
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
                                </Col>
                            </Row>
                            <Row gutter={10}>
                                <Col xs={24}>
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
                                </Col>
                            </Row>
                            <Row gutter={10}>
                                <Col xs={24}>
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
                                </Col>
                            </Row>
                            <Row gutter={10}>
                                <Col xs={24}>
                                    <Button onClick={handleSubmit} appearance="primary" block>
                                        Save Changes
                                    </Button>
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
