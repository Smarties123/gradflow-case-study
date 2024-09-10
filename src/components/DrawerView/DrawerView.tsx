import React, { useState, useEffect } from 'react';
import { DatePicker, Drawer, FlexboxGrid, Divider, Input, Form, Button, Grid, Row, Col } from 'rsuite';
const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />);
import Github from '@uiw/react-color-github';
import './DrawerView.less';

const DrawerView = ({ show, onClose, card, updateCard, columnName }) => {
    const [currentView, setCurrentView] = useState('details'); // State to track current view

    const parseDate = (dateStr) => {
        if (typeof dateStr === 'string' && dateStr) {
            const [year, month, day] = dateStr.split('-').map(Number);
            if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                return new Date(Date.UTC(year, month - 1, day));
            }
        }
        return null;
    };

    // State to manage form inputs
    const [formData, setFormData] = useState({
        company: card.company,
        companyLogo: card.companyLogo,  // Include companyLogo here
        position: card.position,
        deadline: card.deadline ? parseDate(card.deadline) : null,
        location: card.location,
        url: card.url,
        notes: card.notes,
        salary: card.salary,
        interview_stage: card.interview_stage,
        date_applied: card.date_applied,
        card_color: card.card_color
    });

    useEffect(() => {
        if (card.deadline) {
            const parsedDeadline = parseDate(card.deadline);
            if (parsedDeadline) {
                setFormData(prevData => ({
                    ...prevData,
                    deadline: parsedDeadline
                }));
            }
        }
    }, [card.deadline]);

    const handleChange = (value, name) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleColorChange = card_color => {
        setFormData(prev => ({ ...prev, card_color: card_color.hex }));
    };

    // Function to handle form submission
    const handleSubmit = () => {
        const updatedData = {
            ...formData,
        };
        console.log(updatedData);
        updateCard(card.id, updatedData);
        onClose();
    };

    return (
        <Drawer open={show} onClose={onClose} size="sm">
            <Drawer.Header>
                <Drawer.Title>Edit Card</Drawer.Title>
                <FlexboxGrid justify="space-between" className="drawer-links">
                    <FlexboxGrid.Item>
                        <div>
                            <a
                                onClick={() => setCurrentView('details')}
                                className={currentView === 'details' ? 'active' : ''}
                            >
                                Details
                            </a>
                            <Divider vertical />
                            <a
                                onClick={() => setCurrentView('notes')}
                                className={currentView === 'notes' ? 'active' : ''}
                            >
                                Notes
                            </a>
                        </div>
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            </Drawer.Header>
            <Drawer.Body>
                {currentView === 'details' && (
                    <Form fluid>
                        <Grid fluid>
                            <Row gutter={10}>
                                <Col xs={24} sm={12}>
                                    <Form.Group controlId="company" className="form-group">
                                        <Form.ControlLabel className="formControlLabel">Company</Form.ControlLabel>
                                        <div className="company-input-wrapper">
                                            <Form.Control
                                                name="company"
                                                defaultValue={formData.company}
                                                disabled
                                                className="full-width"
                                            />
                                            {formData.companyLogo && (
                                                <img src={formData.companyLogo} alt={formData.company} className="drawer-company-logo" />
                                            )}
                                        </div>
                                    </Form.Group>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Group controlId="position" className="form-group">
                                        <Form.ControlLabel className="formControlLabel">Position</Form.ControlLabel>
                                        <Form.Control
                                            name="position"
                                            defaultValue={formData.position}
                                            onChange={value => handleChange(value, 'position')}
                                            disabled
                                            className="full-width"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row gutter={10}>
                                <Col xs={24}>
                                    <Form.Group controlId="notes" className="form-group">
                                        <Form.ControlLabel className="formControlLabel">Notes</Form.ControlLabel>
                                        <Form.Control
                                            name="notes"
                                            rows={5}
                                            accepter={Textarea}
                                            defaultValue={formData.notes}
                                            onChange={value => handleChange(value, 'notes')}
                                            className="full-width"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row gutter={10}>
                                <Col xs={24} sm={12}>
                                    <Form.Group controlId="columnName" className="form-group">
                                        <Form.ControlLabel className="formControlLabel">Status</Form.ControlLabel>
                                        <Form.Control
                                            name="columnName"
                                            value={columnName}
                                            disabled
                                            className="full-width"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Group controlId="interview_stage" className="form-group">
                                        <Form.ControlLabel className="formControlLabel">Interview Stage</Form.ControlLabel>
                                        <Form.Control
                                            name="interview_stage"
                                            defaultValue={formData.interview_stage}
                                            onChange={value => handleChange(value, 'interview_stage')}
                                            className="full-width"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row gutter={10}>
                                <Col xs={24} sm={12}>
                                    <Form.Group controlId="date_applied" className="form-group">
                                        <Form.ControlLabel className="formControlLabel">Date Applied</Form.ControlLabel>
                                        <Form.Control
                                            name="date_applied"
                                            value={formData.date_applied}
                                            disabled
                                            className="full-width"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Group controlId="deadline" className="form-group">
                                        <Form.ControlLabel className="formControlLabel">Deadline</Form.ControlLabel>
                                        <DatePicker
                                            oneTap
                                            format="dd-MM-yyyy"
                                            className="full-width"
                                            value={formData.deadline}
                                            onChange={value => handleChange(value, 'deadline')}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row gutter={10}>
                                <Col xs={24}>
                                    <Form.Group controlId="location" className="form-group">
                                        <Form.ControlLabel className="formControlLabel">Location</Form.ControlLabel>
                                        <Form.Control
                                            name="location"
                                            defaultValue={formData.location}
                                            onChange={value => handleChange(value, 'location')}
                                            className="full-width"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row gutter={10}>
                                <Col xs={24}>
                                    <Form.Group controlId="url" className="form-group">
                                        <Form.ControlLabel className="formControlLabel">Edit URL</Form.ControlLabel>
                                        <Form.Control
                                            name="url"
                                            defaultValue={formData.url}
                                            onChange={value => handleChange(value, 'url')}
                                            className="full-width"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row gutter={10}>
                                <Col xs={24}>
                                    <Form.Group controlId="card_color" className="form-group">
                                        <Form.ControlLabel className="formControlLabel">Card Color</Form.ControlLabel>
                                        <Github
                                            color={formData.card_color}
                                            onChange={color => handleColorChange(color)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Grid>
                    </Form>
                )}

                {currentView === 'notes' && (
                    <div className="notes-view">
                        <Form fluid>
                            <Form.Group controlId="notes" className="form-group">
                                <Form.ControlLabel className="formControlLabel">Notes</Form.ControlLabel>
                                <Form.Control
                                    name="notes"
                                    rows={5}
                                    accepter={Textarea}
                                    defaultValue={formData.notes}
                                    onChange={value => handleChange(value, 'notes')}
                                    className="full-width"
                                />
                            </Form.Group>
                        </Form>
                    </div>
                )}

                <Grid fluid>
                    <Row gutter={10} className="drawer-buttons">
                        <Col xs={24} sm={12}>
                            <Button onClick={handleSubmit} appearance="primary" block>
                                Update
                            </Button>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Button onClick={onClose} appearance="subtle" block>
                                Close
                            </Button>
                        </Col>
                    </Row>
                </Grid>
            </Drawer.Body>
        </Drawer>
    );
};

export default DrawerView;
