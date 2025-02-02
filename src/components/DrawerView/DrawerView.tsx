import React, { useState, useEffect } from 'react';
import { DatePicker, Drawer, FlexboxGrid, Divider, Input, Form, Grid, Row, Col, SelectPicker, Button } from 'rsuite';
import { useUser } from '@/components/User/UserContext';
import { useFileData } from '../../hooks/useFileData'; // <-- Added
const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />);
import Github from '@uiw/react-color-github';
import './DrawerView.less';
import dayjs from 'dayjs';
import * as errors from '@/images/errors';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { FormHelperText } from '@mui/material'; // Import FormHelperText from MUI
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress from MUI
import { Button as RemoveFile } from '@mui/material';



const DrawerView = ({ show, onClose, card = {}, updateCard, columnName, updateStatus, statuses = [], updateStatusLocally }) => {
    const [currentView, setCurrentView] = useState('details');
    const { user } = useUser(); // Get the user object
    // const drawerSize = window.innerWidth <= 600 ? 'xs' : 'sm'; // Set 'xs' for small screens
    const [errors, setErrors] = useState({}); // State to track errors
    
    const { createFile, files } = useFileData(); // <-- Added
    const [appFiles, setAppFiles] = useState([]); // <-- Added to store this application's files


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
        salary: card.salary,
        interview_stage: card.interview_stage || '',
        date_applied: card.date_applied ? parseDate(card.date_applied) : null,
        card_color: card.card_color || '#ffffff',  // Default color to white
        cv: card.cv || null,
        coverLetter: card.coverLetter || null,
        StatusId: card.StatusId || null
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
          onClose();
        }
        
        // Filter files that have this card's ID in their ApplicationIds array
        const relevantFiles = files.filter((f) => {
          if (!Array.isArray(f.ApplicationIds)) return false;
          return f.ApplicationIds.includes(parseInt(card.id, 10));
        });
        setAppFiles(relevantFiles);
      }, [card, files, onClose]);


    const validateForm = () => {
        const validationErrors = {};


        if (formData.salary < 0) {
            validationErrors.salary = "Salary cannot be negative.";
        } else if (!/^\d{1,3}(,\d{3})*(\.\d+)?$/.test(formData.salary)) {
            validationErrors.salary = "Salary must be a valid number";
        }

        if (formData.deadline < formData.date_applied && formData.deadline) {
            validationErrors.deadline = "Deadline cannot be before the date applied.";
        }



        setErrors(validationErrors);

        // Return true if no errors, otherwise false
        return Object.keys(validationErrors).length === 0;
    };

    const handleChange = (value, name) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: null })); // Clear error for the field being edited
    };

    const handleColorChange = card_color => {
        setFormData(prev => ({ ...prev, card_color: card_color.hex }));
    };

    const handleSubmit = async () => {

        if (!validateForm()) {
            console.error("Form has validation errors.");
            return; // Stop if there are validation errors
        }
        console.log("Updating card with ID:", card.id); // Debug log to verify ID
        console.log("DrawerView card prop:", card);


        // 1) If a new CV file is chosen, create a DB record
        if (formData.cv && formData.cv.file) {
            await createFile({
            typeId: 1, // 1 for CV
            fileUrl: URL.createObjectURL(formData.cv.file),
            fileName: formData.cv.file.name,
            extens: '.pdf',
            description: `CV uploaded via DrawerView`,
            ApplicationIds: Number(card.id)
            });
        }
    
        // 2) If a new Cover Letter file is chosen, create a DB record
        if (formData.coverLetter && formData.coverLetter.file) {
            await createFile({
            typeId: 2, // 2 for Cover Letter
            fileUrl: URL.createObjectURL(formData.coverLetter.file),
            fileName: formData.coverLetter.file.name,
            extens: '.pdf',
            description: `Cover Letter uploaded via DrawerView`,
            ApplicationIds: Number(card.id)
            });
        }
        
        const updatedData = {
            company: formData.company,
            position: formData.position,
            deadline: formData.deadline ? dayjs(formData.deadline).format('YYYY-MM-DD') : null,
            location: formData.location,
            url: formData.url,
            notes: formData.notes,  // This will now be included even if empty or null
            salary: formData.salary,
            interview_stage: formData.interview_stage,
            date_applied: formData.date_applied ? dayjs(formData.date_applied).format('YYYY-MM-DD') : null,
            card_color: formData.card_color,
            statusId: formData.StatusId || card.StatusId,
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

    const calculateProgress = (fields) => {
        const filled = fields.filter((field) => {
            const value = formData[field];
            console.log(value);
            return value !== null && value !== undefined && value !== ''; // Check for filled fields
        }).length;

        return `${filled}/${fields.length}`;
    };

    const detailsFields = [
        'company',
        'position',
        'notes',
        'StatusId',
        'date_applied',
        'deadline',
        'salary',
        'url',
        'card_color',
        'location'
    ];

    const documentsFields = ['cv', 'coverLetter'];
    const notesFields = ['notes'];

    const calculateProgressPercentage = (fields) => {
        const filled = fields.filter((field) => {
            const value = formData[field];
            return value !== null && value !== undefined && value !== '';
        }).length;

        const total = fields.length;
        return Math.round((filled / total) * 100); // Return percentage
    };

    const getCircularProgressColor = (percentage) => {
        if (percentage === 100) {
            return '#28a745'; // Green for 100% completion
        } else if (percentage >= 50) {
            return '#ffc107'; // Yellow for 50%-99% completion
        } else {
            return '#dc3545'; // Red for less than 50% completion
        }
    };





    return (

        <Drawer open={show} onClose={onClose} size={drawerSize} placement={drawerPlacement}>
            <Drawer.Header>
                <Drawer.Title>Edit Card</Drawer.Title>
                <FlexboxGrid justify="space-between" className="drawer-links">
                    <FlexboxGrid.Item>
                        <div id="ddn">
                            <a
                                onClick={() => setCurrentView('details')}
                                className={currentView === 'details' ? 'active' : ''}
                            >
                                Details
                                <div className="progress-ring">
                                    <CircularProgress
                                        variant="determinate"
                                        value={calculateProgressPercentage(detailsFields)}
                                        size={40}
                                        thickness={4}
                                        style={{
                                            color: getCircularProgressColor(calculateProgressPercentage(detailsFields))
                                        }}
                                    />
                                    <span className="progress-percentage">
                                        {calculateProgressPercentage(detailsFields)}%
                                    </span>
                                </div>
                            </a>
                            <Divider vertical />
                            <a
                                onClick={() => setCurrentView('documents')}
                                className={currentView === 'documents' ? 'active' : ''}
                            >
                                Documents
                                <div className="progress-ring">
                                    <CircularProgress
                                        variant="determinate"
                                        value={calculateProgressPercentage(documentsFields)}
                                        size={40}
                                        thickness={4}
                                        style={{
                                            color: getCircularProgressColor(calculateProgressPercentage(documentsFields)),
                                        }}
                                    />
                                    <span className="progress-percentage">
                                        {calculateProgressPercentage(documentsFields)}%
                                    </span>
                                </div>
                            </a>
                            <Divider vertical />
                            <a
                                onClick={() => setCurrentView('notes')}
                                className={currentView === 'notes' ? 'active' : ''}
                            >
                                Notes
                                <div className="progress-ring">
                                    <CircularProgress
                                        variant="determinate"
                                        value={calculateProgressPercentage(notesFields)}
                                        size={40}
                                        thickness={4}
                                        style={{
                                            color: getCircularProgressColor(calculateProgressPercentage(notesFields)),
                                        }}
                                    />
                                    <span className="progress-percentage">
                                        {calculateProgressPercentage(notesFields)}%
                                    </span>
                                </div>
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
                                            value={formData.deadline instanceof Date && !isNaN(formData.deadline) ? formData.deadline : null}
                                            onChange={value => handleChange(value, 'deadline')}
                                        />
                                        {errors.deadline && (
                                            <FormHelperText id="error" error>
                                                {errors.deadline}
                                            </FormHelperText>
                                        )}

                                    </Form.Group>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Group controlId="salary" className="form-group">
                                        <Form.ControlLabel className="formControlLabel">Salary (£)</Form.ControlLabel>
                                        <Form.Control
                                            name="salary"
                                            value={formData.salary}
                                            onChange={(value) => {
                                                const numericValue = value.replace(/[^0-9.]/g, '');
                                                handleChange(numericValue, 'salary');
                                            }}
                                            className="full-width"
                                            // placeholder="Enter Salary"
                                            maxLength={10}

                                        />
                                        {errors.salary && (
                                            <FormHelperText id="error" error>
                                                {errors.salary}
                                            </FormHelperText>
                                        )}
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
                        {/* Show existing files for this application */}
                            {appFiles.length > 0 && (
                                <div style={{ marginBottom: '1rem' }}>
                                <h5>Existing Files for this Application:</h5>
                                {appFiles.map(file => (
                                    <div key={file.fileId} style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                                    <InsertDriveFileIcon style={{ marginRight: '5px' }} />
                                    {file.fileName} ({file.fileType})
                                    </div>
                                ))}
                                </div>
                            )}
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
                                                    <span>{formData.cv ? 'Click to replace file' : 'Click to upload'}</span> or drag and drop
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
                                                    <span>{formData.coverLetter ? 'Click to replace file' : 'Click to upload'}</span> or drag and drop
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
