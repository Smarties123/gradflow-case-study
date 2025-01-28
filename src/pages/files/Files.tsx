import React, { useState, useEffect } from 'react';
import { Row, Col, Progress } from 'rsuite';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import './Files.less';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';
import FilePopup from '../../components/FilePopup/FilePopup';

// If you have a UserContext that provides user + token:
import { useUser } from '../../components/User/UserContext';

const Files = () => {
  const [cvFiles, setCvFiles] = useState([]);
  const [coverLetterFiles, setCoverLetterFiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [applications, setApplications] = useState([]);

  // If you're using context to get the user object/token:
  const { user } = useUser() || {}; 
  // user?.token should contain your JWT, e.g. "Bearer <token>" is typically needed by your backend.

  // ----------------------------------------------------------------------
  // 1) FETCH user files from the backend
  // ----------------------------------------------------------------------
  const fetchUserFiles = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/files`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`, 
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }
      const data = await response.json();

      // Separate them into CV vs Cover Letter by fileType
      const cvList = data.filter((f) => f.fileType === 'CV');
      const coverLetterList = data.filter((f) => f.fileType === 'Cover Letter');

      // Convert them to a local structure
      const toLocalFormat = (file) => ({
        id: file.fileId,       // the DB’s fileId
        name: file.fileName,
        size: '---',           // or parse if you store file size
        progress: 100,         // already "complete"
        status: 'completed',
        url: file.fileUrl,     // S3 or your file URL
      });

      setCvFiles(cvList.map(toLocalFormat));
      setCoverLetterFiles(coverLetterList.map(toLocalFormat));
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  // ----------------------------------------------------------------------
  // 2) CREATE a new file record in the DB
  // ----------------------------------------------------------------------
  const createFileRecord = async (file, fileType) => {
    // `file` is our local representation (with a local "url" from URL.createObjectURL).
    // Typically, you'd do an actual S3 upload and pass the S3 URL in the request body.

    // Example body shape for your backend:
    const body = {
      typeId: fileType === 'cv' ? 1 : 2,  // 1 => CV, 2 => Cover Letter
      fileUrl: file.url,                  // Replace with real S3 URL if you do S3
      fileName: file.name,
      extns: '.pdf',                      // or parse from file.name
      description: `Uploaded from UI (${fileType})`,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/files`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error('Failed to create file record');
      }
      const { file: newFile } = await response.json();
      console.log('File record created in DB:', newFile);
      // If you want to refresh your list from DB after creating:
      fetchUserFiles();
    } catch (error) {
      console.error(error);
    }
  };

  // ----------------------------------------------------------------------
  // 3) DELETE a file record from the DB
  // ----------------------------------------------------------------------
  const deleteFileRecord = async (fileId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete file record');
      }
      console.log(`File with ID ${fileId} deleted in DB`);
      // Optionally re-fetch the list
      fetchUserFiles();
    } catch (error) {
      console.error(error);
    }
  };

  // ----------------------------------------------------------------------
  // 4) Fetch job applications (dummy data in this example)
  // ----------------------------------------------------------------------
  const fetchApplications = async () => {
    const dummyJobs = [
      'Frontend Developer (To Do)',
      'Backend Developer (Assessment)',
      'Data Analyst (To Do)',
      'Software Developer (Assessment)',
    ];
    setApplications(dummyJobs);
  };

  // ----------------------------------------------------------------------
  // useEffect to fetch data on mount (only if user token is available)
  // ----------------------------------------------------------------------
  useEffect(() => {
    fetchApplications();
    if (user?.token) {
      fetchUserFiles();
    }
  }, [user?.token]);

  // ----------------------------------------------------------------------
  // 5) Handle local file uploads
  // ----------------------------------------------------------------------
  const handleFileUpload = (e, fileType) => {
    const uploadedFiles = Array.from(e.target.files);
    const newFiles = uploadedFiles.map((file) => ({
      id: uuidv4(), // local unique ID
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`, 
      progress: 0,
      status: 'uploading',
      url: URL.createObjectURL(file), 
    }));

    if (fileType === 'cv') {
      setCvFiles((prevFiles) => [...prevFiles, ...newFiles]);
    } else if (fileType === 'coverLetter') {
      setCoverLetterFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }

    // Animate each file to simulate an "upload"
    newFiles.forEach((file) => animateUpload(file.id, fileType));
  };

  // ----------------------------------------------------------------------
  // Animate "upload" to 100%
  // ----------------------------------------------------------------------
  const animateUpload = (fileId, fileType) => {
    const interval = setInterval(() => {
      const updater = (prevFiles) =>
        prevFiles.map((file) =>
          file.id === fileId
            ? {
                ...file,
                progress: Math.min(file.progress + getRandomIncrement(3, 10), 100),
                status: file.progress >= 97 ? 'completed' : 'uploading',
              }
            : file
        );
      if (fileType === 'cv') {
        setCvFiles(updater);
      } else {
        setCoverLetterFiles(updater);
      }
    }, 100);

    // After 2s, stop interval, then "createFileRecord"
    setTimeout(() => {
      clearInterval(interval);

      // Grab the final file from state
      const finalFile =
        fileType === 'cv'
          ? cvFiles.find((f) => f.id === fileId)
          : coverLetterFiles.find((f) => f.id === fileId);

      if (finalFile) {
        createFileRecord(finalFile, fileType);
      }
    }, 2000);
  };

  // Helper to generate random increment
  const getRandomIncrement = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // ----------------------------------------------------------------------
  // 6) Remove file from local state (and optionally from DB)
  // ----------------------------------------------------------------------
  const removeFile = (fileId, fileType) => {
    if (fileType === 'CV') {
      setCvFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
    } else {
      setCoverLetterFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
    }

    // If the file `id` was actually the DB’s fileId, you can call:
    // deleteFileRecord(fileId);
    //
    // Otherwise, if `file.id` is just a UUID, you’d need to store the
    // DB ID somewhere (like file.dbId) to properly delete from DB.
  };

  // ----------------------------------------------------------------------
  // 7) Modal handling
  // ----------------------------------------------------------------------
  const openFileInModal = (file, type) => {
    setSelectedFile({ ...file, documentType: type });
    setIsModalOpen(true);
  };
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  // ----------------------------------------------------------------------
  // 8) Render files in rows
  // ----------------------------------------------------------------------
  const renderFiles = (files, fileType) => (
    <Row gutter={20}>
      {files.map((file) => (
        <Col xs={24} key={file.id} className="files-file-row">
          <div
            className="files-file-card"
            style={{
              borderColor: 'white',
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
                    ? '#28a745'
                    : fileType === 'CV'
                    ? 'blue'
                    : '#A020F0'
                }
                trailColor="#f0f0f0"
                showInfo={false}
              />
              {file.status === 'completed' && (
                <p
                  className="files-file-view-text"
                  onClick={() => openFileInModal(file, fileType)}
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

  // ----------------------------------------------------------------------
  // Return the main UI
  // ----------------------------------------------------------------------
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
                  (Max. File size: 25 MB per file)
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
              <div
                className="files-upload-area"
                style={{
                  borderColor: '#7C41E3',
                  borderWidth: '1px',
                  borderStyle: 'dashed',
                }}
              >
                <input
                  type="file"
                  id="cover-letter-upload"
                  accept=".pdf,.doc,.docx"
                  multiple
                  onChange={(e) => handleFileUpload(e, 'coverLetter')}
                  style={{ display: 'none' }}
                />
                <div className="upload-icon">
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
        </Col>
      </Row>

      <FilePopup
        isOpen={isModalOpen}
        toggle={toggleModal}
        selectedFile={selectedFile}
        applications={applications}
      />
    </div>
  );
};

export default Files;
