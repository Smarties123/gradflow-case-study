import React, { useState } from 'react';
import { DatePicker, Drawer, FlexboxGrid, Divider, Input, Form, Button, Grid, Row, Col } from 'rsuite';
const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />);
import './DrawerView.less';


const DrawerView = ({ show, onClose, card, updateCard }) => {
    // State to manage form inputs
    const [formData, setFormData] = useState({
        company: card.company,
        position: card.position,
        notes: card.notes,
        interview_stage: card.interview_stage,
        salary: card.salary,
        location: card.location,
        deadline: card.deadline  // Assuming you have a 'deadline' field in your card data
    });

    const handleChange = (value, name) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Function to handle form submission
    const handleSubmit = () => {
        updateCard(card.id, formData);  // Assuming updateCard is defined to handle the state update
        onClose();  // Close the drawer after update
    };

    return (
        <Drawer open={show} onClose={onClose} size="sm">
            <Drawer.Header>
                <Drawer.Title>Edit Card</Drawer.Title>
                <FlexboxGrid justify="space-between" className="drawer-links">
                    <FlexboxGrid.Item>
                        <div>
                            <a>Details</a>
                            <Divider vertical />
                            <a>Notes</a>
                            <Divider vertical />
                            <a>Tasks</a>
                            <Divider vertical />
                            <a>Contacts</a>
                            <Divider vertical />
                            <a>Documents</a>
                        </div>
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            </Drawer.Header>
            <Drawer.Body>
                <Form fluid>
                    <Grid fluid>
                        <Row gutter={20}>
                            <Col xs={12}>
                                <Form.Group controlId="company" className="form-group">
                                    <Form.ControlLabel className="formControlLabel">Company</Form.ControlLabel>
                                    <Form.Control
                                        name="company"
                                        defaultValue={formData.company}
                                        onChange={(value) => handleChange(value, 'company')}
                                        disabled
                                    />

                                </Form.Group>
                            </Col>

                            <Col xs={12}>
                                <Form.Group controlId="position" className="form-group">
                                    <Form.ControlLabel className="formControlLabel">Position</Form.ControlLabel>
                                    <Form.Control
                                        name="position"
                                        defaultValue={formData.position}
                                        onChange={(value) => handleChange(value, 'position')}
                                        disabled
                                    />
                                </Form.Group>
                            </Col>
                        </Row >
                        <Row gutter={20}>
                            <Col xs={24}>
                                <Form.Group controlId="notes" className="form-group">
                                    <Form.ControlLabel className="formControlLabel">Notes</Form.ControlLabel>
                                    <Form.Control
                                        name="notes"
                                        rows={5}
                                        accepter={Textarea}
                                        defaultValue={formData.notes}
                                        onChange={(value) => handleChange(value, 'notes')}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row gutter={20}>
                            <Col xs={24}>
                                <Form.Group controlId="interviewStage" className="form-group">
                                    <Form.ControlLabel className="formControlLabel">Interview Stage</Form.ControlLabel>
                                    <Form.Control
                                        name="interviewStage"
                                        defaultValue={formData.interview_stage}
                                        onChange={(value) => handleChange(value, 'interviewStage')}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row gutter={20}>
                            <Col xs={12}>
                                <Form.Group controlId="deadline" className="form-group">
                                    <Form.ControlLabel className="formControlLabel">Deadline</Form.ControlLabel>
                                    <DatePicker
                                        oneTap
                                        format="MM-dd-yyyy"
                                        className="full-width"
                                        value={formData.deadline ? new Date(formData.deadline) : undefined}
                                        onChange={(value) => handleChange(value, 'deadline')}
                                    />
                                </Form.Group>
                            </Col>

                            <Col xs={12}>
                                <Form.Group controlId="salary" className="form-group">
                                    <Form.ControlLabel className="formControlLabel">Salary(£)</Form.ControlLabel>
                                    <Form.Control
                                        name="salary"
                                        defaultValue={formData.salary}
                                        onChange={(value) => handleChange(value, 'salary')}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row gutter={20}>
                            <Col xs={24}>
                                <Form.Group controlId="location" className="form-group">
                                    <Form.ControlLabel className="formControlLabel">Location</Form.ControlLabel>
                                    <Form.Control
                                        name="location"
                                        defaultValue={formData.location}
                                        onChange={(value) => handleChange(value, 'location')}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Grid >
                </Form >



                <Grid fluid>
                    <Row>
                        <Col xs={12}>
                            <Button onClick={handleSubmit} appearance="primary" block>
                                Update
                            </Button>
                        </Col>
                        <Col xs={12}>
                            <Button onClick={onClose} appearance="subtle" block>
                                Close
                            </Button>
                        </Col>
                    </Row>
                </Grid>
            </Drawer.Body >

        </Drawer >
    );
};

export default DrawerView;
