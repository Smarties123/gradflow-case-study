import React, { useState, useEffect } from 'react';
import { DatePicker, Drawer, FlexboxGrid, Divider, Input, Form, Grid, Row, Col, SelectPicker, Button } from 'rsuite';
import { useUser } from '@/components/User/UserContext'; // Import useUser to get the user
const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />);
import Github from '@uiw/react-color-github';
import './DrawerView.less';
import dayjs from 'dayjs';
import * as errors from '@/images/errors';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

import { Button as RemoveFile } from '@mui/material';



const DrawerView = ({ show, onClose, card = {}, updateCard, columnName, updateStatus, statuses = [], updateStatusLocally }) => {
    const [currentView, setCurrentView] = useState('details');
    const { user } = useUser(); // Get the user object
    // const drawerSize = window.innerWidth <= 600 ? 'xs' : 'sm'; // Set 'xs' for small screens

    const parseDate = (dateStr) => {
        return dateStr ? dayjs(dateStr).toDate() : null;
    };

    const [formData, setFormData] = useState({
        company: card.company || '',  // Default to an empty string if null
        companyLogo: card.companyLogo || '',
        position: card.position || '',
        deadline: card.deadline ? parseDate(card.deadline) : null,  // Allow null for dates
        location: card.location || '',
        url: card.url || '',
        notes: card.notes || '',
        salary: card.salary || 0,  // Default salary to 0
        interview_stage: card.interview_stage || '',
        date_applied: card.date_applied ? parseDate(card.date_applied) : null,
        card_color: card.card_color || '#ffffff',  // Default color to white
        cv: card.cv || null,
        coverLetter: card.coverLetter || null,
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

    useEffect(() => {
        window.addEventListener('error', (e) => {
            if (e.message.includes('ResizeObserver loop completed')) {
                e.preventDefault();
            }
        });
    }, []);

    useEffect(() => {
        if (!card.id) {
            console.warn("ID is missing from card prop:", card);
            // Optionally, prevent drawer from opening if no ID
            onClose();
        }
    }, [card]);


    const handleChange = (value, name) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };


    const handleColorChange = card_color => {
        setFormData(prev => ({ ...prev, card_color: card_color.hex }));
    };

    const handleSubmit = async () => {
        console.log("Updating card with ID:", card.id); // Debug log to verify ID
        console.log("DrawerView card prop:", card);

        const updatedData = {
            company: formData.company || card.company || null,
            position: formData.position || card.position || null,
            deadline: formData.deadline ? dayjs(formData.deadline).format('YYYY-MM-DD') : card.deadline || null,
            location: formData.location || card.location || null,
            url: formData.url || card.url || null,
            notes: formData.notes || card.notes || null,
            salary: formData.salary !== undefined ? formData.salary : card.salary || null,
            interview_stage: formData.interview_stage || card.interview_stage || null,
            date_applied: formData.date_applied ? dayjs(formData.date_applied).format('YYYY-MM-DD') : card.date_applied || null,
            card_color: formData.card_color || card.card_color || null,
            statusId: formData.StatusId || card.StatusId // Ensure StatusId is always included
        };

        try {
            if (!user || !user.token) {
                throw new Error('User not authenticated');
            }

            // console.log('User token:', user.token);  // Debug token value
            // console.log('Updated data:', updatedData);  // Debug the data being sent to the backend
            // console.log('process.env.REACT_APP_API_URL', process.env.REACT_APP_API_URL); //
            const response = await fetch(`${process.env.REACT_APP_API_URL}/applications/${card.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,  // Ensure token is valid
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                const updatedCard = await response.json();
                // console.log('Card updated:', updatedCard);

                // Check if the status has changed and update the card's location accordingly
                if (updatedData.statusId !== card.StatusId) {
                    updateStatusLocally(card.id, updatedData.statusId);  // Use the function passed via props
                } else {
                    updateCard(card.id, updatedData);  // Update the card details in local state
                }

                onClose(); // Close the drawer
            } else {
                const errorText = await response.text();
                console.error('Failed to update the card:', errorText);
            }
        } catch (error) {
            console.error('Error updating card:', error);
        }
    };

    const drawerSize = window.innerWidth <= 600 ? 'xs' : 'sm'; // Set 'xs' for small screens
    const drawerPlacement = window.innerWidth <= 600 ? 'top' : 'right'; // Open from bottom on small screens

    const handleFileUpload = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                [type]: { name: file.name, file } // Store file object along with its name
            }));
        }
    };

    const removeFile = (type) => {
        setFormData(prev => ({
            ...prev,
            [type]: null // Dynamically remove the file by type
        }));
    };






    return (

        <Drawer open={show} onClose={onClose} size={drawerSize} placement={drawerPlacement}>
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
                                onClick={() => setCurrentView('documents')}
                                className={currentView === 'documents' ? 'active' : ''}
                            >
                                Documents
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
                                                value={formData.company}
                                                onChange={value => handleChange(value, 'company')}
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
                                            value={formData.position}
                                            onChange={value => handleChange(value, 'position')}
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
                                            value={formData.notes || ''}
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
                                        <SelectPicker
                                            name="StatusId"
                                            value={formData.StatusId || card.StatusId} // Reflect the current status
                                            onChange={(value) => handleChange(value, 'StatusId')} // Update formData when a new status is selected
                                            data={statuses.map(status => ({
                                                label: status.StatusName,
                                                value: status.StatusId
                                            }))}
                                            className="full-width"
                                            placeholder="Select Status"
                                            searchable={false}
                                        />




                                    </Form.Group>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Group controlId="date_applied" className="form-group">
                                        <Form.ControlLabel className="formControlLabel">Date Applied</Form.ControlLabel>
                                        <DatePicker
                                            oneTap
                                            format="dd-MM-yyyy"
                                            className="full-width"
                                            value={formData.date_applied || ''}
                                            onChange={value => handleChange(value, 'date_applied')}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row gutter={10}>
                                <Col xs={24} sm={12}>
                                    <Form.Group controlId="deadline" className="form-group">
                                        <Form.ControlLabel className="formControlLabel">Deadline</Form.ControlLabel>
                                        <DatePicker
                                            oneTap
                                            format="dd-MM-yyyy"
                                            className="full-width"
                                            value={formData.deadline || ''}
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
                                            value={formData.location || ''}
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
                                            value={formData.url || ''}
                                            onChange={value => handleChange(value, 'url')}
                                            className="full-width"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row gutter={10}>
                                <Col xs={24}>
                                    <Form.Group controlId="card_color" className="form-group">
                                        <div className="card-color-picker">

                                            <Form.ControlLabel className="formControlLabel">Card Color</Form.ControlLabel>
                                            <Github
                                                placement='Top'

                                                color={formData.card_color}
                                                onChange={color => handleColorChange(color)}
                                                className="color-picker"
                                            />
                                        </div>
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
                                    value={formData.notes}
                                    onChange={value => handleChange(value, 'notes')}
                                    className="full-width"
                                />
                            </Form.Group>
                        </Form>
                    </div>
                )}

                {currentView === 'documents' && (
                    <div className='document-section'>
                        <Grid fluid>
                            <Row gutter={20}>
                                {/* CV Section */}
                                <Col xs={24}>
                                    <div className={`document-card ${formData.cv ? 'cv-uploaded' : ''}`}>
                                        <h4 className="document-title">CV</h4>
                                        <label htmlFor="cv" className="upload-label">

                                            <div className="upload-area">
                                                <input
                                                    type="file"
                                                    id="cv"
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={(e) => handleFileUpload(e, 'cv')}
                                                    style={{ display: 'none' }}
                                                />
                                                <div className="upload-icon">
                                                    <UploadFileIcon />
                                                </div>
                                                <p className="upload-instructions">
                                                    <span>Click to Upload</span> or drag and drop
                                                    <br />
                                                    (Max. File size: 25 MB)
                                                </p>
                                            </div>
                                        </label>

                                        {/* Uploaded File Display */}
                                        {formData.cv && (
                                            <Row style={{ display: 'grid', marginBottom: '30px' }}>
                                                <Col xs="auto">
                                                    <div className="uploaded-file-container">
                                                        <div className="uploaded-file">
                                                            <InsertDriveFileIcon className="file-icon" />
                                                            <span className="file-name">{formData.cv.name}</span>
                                                            <RemoveFile
                                                                className="remove-file-button"
                                                                color="error"
                                                                onClick={() => removeFile('cv')}
                                                            >
                                                                X
                                                            </RemoveFile>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        )}
                                    </div>
                                </Col>
                            </Row>

                            <Row gutter={20}>
                                {/* Cover Letter Section */}
                                <Col xs={24}>
                                    <div id="coverLetter" className={`document-card ${formData.coverLetter ? 'coverLetter-uploaded' : ''}`}>
                                        <h4 className="document-title">Cover Letter</h4>
                                        <label htmlFor="coverLetterUpload" className="upload-label">

                                            <div className="upload-area">
                                                <input
                                                    type="file"
                                                    id="coverLetterUpload"
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={(e) => handleFileUpload(e, 'coverLetter')}
                                                    style={{ display: 'none' }}
                                                />
                                                <div className="upload-icon">
                                                    <UploadFileIcon />
                                                </div>
                                                <p className="upload-instructions">
                                                    <span>Click to Upload</span> or drag and drop
                                                    <br />
                                                    (Max. File size: 25 MB)
                                                </p>
                                            </div>
                                        </label>

                                        {/* Uploaded File Display */}
                                        {formData.coverLetter && (
                                            <Row style={{ display: 'grid', marginBottom: '30px' }}>
                                                <Col xs="auto">
                                                    <div className="uploaded-file-container">
                                                        <div className="uploaded-file">
                                                            <InsertDriveFileIcon className="file-icon" />
                                                            <span className="file-name">{formData.coverLetter.name}</span>
                                                            <RemoveFile
                                                                className="remove-file-button"
                                                                color="error"
                                                                onClick={() => removeFile('coverLetter')}
                                                            >
                                                                X
                                                            </RemoveFile>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        )}
                                    </div>
                                </Col>
                            </Row>


                        </Grid>

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
        </Drawer >
    );
};

export default DrawerView;
