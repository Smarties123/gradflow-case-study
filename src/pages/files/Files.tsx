import React, { useState, useEffect } from 'react';
import { Row, Col, Progress } from 'rsuite';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import './Files.less';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';
import FilePopup from '../../components/FilePopup/FilePopup';

const Files = () => {
  const [cvFiles, setCvFiles] = useState([]);
  const [coverLetterFiles, setCoverLetterFiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  //I think when the page loads we call a function which fetch all applications and holds them. See if we can make this more efficient
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {

    // We just need name and status for example
    // Software Developer (To Do)
    // Data Analyst (Assessment)

    // Call the api and stuff in this function
    const dummyJobs = ['Frontend Developer (To Do)', 'Backend Developer (Assessment)', 'Data Analyst (To Do)', 'Software Developer (Assessment)'];

    setApplications(dummyJobs);

  };

  // Handle file uploads for both CV and Cover Letter sections
  const handleFileUpload = (e, fileType) => {
    const uploadedFiles = Array.from(e.target.files);
    const newFiles = uploadedFiles.map((file) => ({
      id: uuidv4(), // Generate a unique ID for each file
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`, // Convert size to KB
      progress: 0, // Start with 0% progress
      status: 'uploading', // Initial status
      url: URL.createObjectURL(file), // Create a temporary URL for the file
    }));

    // Add files to the corresponding section
    if (fileType === 'cv') {
      setCvFiles((prevFiles) => [...prevFiles, ...newFiles]);
    } else if (fileType === 'coverLetter') {
      setCoverLetterFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }

    // Start the upload animation for each file
    newFiles.forEach((file) => animateUpload(file.id, fileType));
  };


  const animateUpload = (fileId, fileType) => {
    const interval = setInterval(() => {
      const updater = (prevFiles) =>
        prevFiles.map((file) =>
          file.id === fileId
            ? {
              ...file,
              progress: Math.min(file.progress + getRandomIncrement(3, 10), 100), // Increment by random value
              status: file.progress >= 97 ? 'completed' : 'uploading', // Mark as completed when progress is >= 100%
            }
            : file
        );


      // Update the correct file list
      if (fileType === 'cv') {
        setCvFiles(updater);
      } else {
        setCoverLetterFiles(updater);
      }
    }, 100); // Update every 100ms

    // Stop the animation once it reaches 100%
    setTimeout(() => {
      clearInterval(interval);
    }, 2000); // Animation duration (2 seconds to reach 100%)
  };

  // Helper function to generate a random increment within a range
  const getRandomIncrement = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  const removeFile = (fileId, fileType) => {
    if (fileType === 'CV') {
      setCvFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
    } else {
      setCoverLetterFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
    }
  };

  const openFileInModal = (file, type) => {
    setSelectedFile({ ...file, documentType: type }); // Attach documentType to the selected file
    setIsModalOpen(true);
  };


  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const renderFiles = (files, fileType) => (
    <Row gutter={20}>
      {files.map((file, index) => (
        <Col xs={24} key={index} className="files-file-row">
          <div
            className="files-file-card"
            style={{
              borderColor: 'white', // Apply border color dynamically
              backgroundColor: fileType === 'CV' ? '#6597F7' : 'purple',
            }}
          >
            <InsertDriveFileIcon className="files-file-icon" />
            <div className="files-file-info">
              <p className="files-file-name">{file.name}</p>
              <p className="files-file-size">{file.size}</p>
              <Progress.Line
                percent={file.progress}
                strokeColor={
                  file.status === 'completed'
                    ? '#28a745' // Green for completed
                    : fileType === 'CV'
                      ? 'blue' // Blue for CV
                      : '#A020F0' // Purple for Cover Letter
                }
                trailColor="#f0f0f0"
                showInfo={false}
              />
              {file.status === 'completed' && (
                <p
                  className="files-file-view-text"
                  onClick={() => openFileInModal(file, fileType)} // Pass the document type
                >
                  Click to View
                </p>
              )}
            </div>
            <div className="files-file-actions">
              <span className="files-file-progress">{file.progress}%</span>
              <DeleteIcon
                className="delete-icon"
                onClick={() => removeFile(file.id, fileType)}
              />
            </div>
          </div>
        </Col>
      ))}
    </Row>
  );


  return (
    <div className="files-page">
      <Row gutter={20} className="upload-section">
        {/* CV Column */}
        <Col xs={12}>
          <div className="upload-card">
            <h4 className="upload-title">CV</h4>
            <label htmlFor="cv-upload" className="upload-label">
              <div className="files-upload-area">
                <input
                  type="file"
                  id="cv-upload"
                  accept=".pdf,.doc,.docx"
                  multiple
                  onChange={(e) => handleFileUpload(e, 'cv')}
                  style={{ display: 'none' }}
                />
                <div className="upload-icon">
                  <UploadFileIcon />
                </div>
                <p className="upload-instructions">
                  <span>Click to Upload</span> or drag and drop
                  <br />
                  (Max. File size: 25 MB per fie)
                </p>
              </div>
            </label>
          </div>
          {renderFiles(cvFiles, 'CV')}
        </Col>

        {/* Cover Letter Column */}
        <Col xs={12}>
          <div className="upload-card">
            <h4 className="upload-title">Cover Letter</h4>
            <label htmlFor="cover-letter-upload" className="upload-label">
              <div className="files-upload-area" style={{ borderColor: '#7C41E3', borderWidth: '1px', borderStyle: 'dashed' }}>
                <input
                  type="file"
                  id="cover-letter-upload"
                  accept=".pdf,.doc,.docx"
                  multiple
                  onChange={(e) => handleFileUpload(e, 'coverLetter')}
                  style={{ display: 'none' }}
                />
                <div className="upload-icon" >
                  <UploadFileIcon />
                </div>
                <p className="upload-instructions">
                  <span style={{ color: '#7C41E3' }}>Click to Upload</span> or drag and drop
                  <br />
                  (Max. File size: 25 MB per file)
                </p>
              </div>
            </label>
          </div>
          {renderFiles(coverLetterFiles, 'Cover Letter')}
        </Col >
      </Row >

      <FilePopup
        isOpen={isModalOpen}
        toggle={toggleModal}
        selectedFile={selectedFile}
        applications={applications}
      />
    </div >
  );
};

export default Files;
