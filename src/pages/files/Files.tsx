import React, { useState, useEffect } from 'react';
import { Row, Col, Progress } from 'rsuite';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import './Files.less';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';
import FilePopup from '../../components/FilePopup/FilePopup';

// Pull in the user from context:
import { useUser } from '../../components/User/UserContext';
// Pull in the board data hook to sync application data
import { useBoardData } from '../../hooks/useBoardData';
// Pull in fileData hook (now has createFile, deleteFile, etc.)
import { useFileData } from '../../hooks/useFileData';

const Files = () => {
  // For local "uploading" states
  const [uploadingCvFiles, setUploadingCvFiles] = useState([]);
  const [uploadingCoverLetterFiles, setUploadingCoverLetterFiles] = useState([]);

  // For opening a modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // For listing existing applications from the board data
  const [applications, setApplications] = useState([]);

  // Grab the user, then call useBoardData(user)
  const { user } = useUser();
  const { columns, loading: boardLoading } = useBoardData(user);

  // Load existing files from the DB using our custom hook
  const {
    files,
    loading,
    error,
    createFile,
    deleteFile,
    // We'll still do global updates, but also maintain local updates
    updateFile,
  } = useFileData();

  // 1) Create a local mirror of the DB's file list
  const [localFiles, setLocalFiles] = useState(files);

  // 2) Whenever the global "files" changes (e.g. after refetch), sync to local
  useEffect(() => {
    setLocalFiles(files);
  }, [files]);

  // 3) Callback to immediately update local state after an edit
  const handleLocalFileUpdate = (updatedFile) => {
    if (!updatedFile) return;
    setLocalFiles((prev) =>
      prev.map((f) =>
        f.fileId === updatedFile.fileId ? updatedFile : f
      )
    );
  };

  // 4) Build final arrays (CV & CL) from localFiles
  //    Merge with local "uploading" files for display
  const dbCvFiles = localFiles
    .filter((f) => f.fileType === 'CV')
    .map((f) => ({
      id: f.fileId,
      name: f.fileName,
      size: '---',
      progress: 100,
      status: 'completed',
      url: f.fileUrl,
      isDbFile: true,
      description: f.description,
      applicationsId: f.applicationsId
    }));

  const dbCoverLetterFiles = localFiles
    .filter((f) => f.fileType === 'CL')
    .map((f) => ({
      id: f.fileId,
      name: f.fileName,
      size: '---',
      progress: 100,
      status: 'completed',
      url: f.fileUrl,
      isDbFile: true,
      description: f.description,
      applicationsId: f.applicationsId
    }));

  // Combine DB files with local "uploading" files
  const cvFiles = [...dbCvFiles, ...uploadingCvFiles];
  const coverLetterFiles = [...dbCoverLetterFiles, ...uploadingCoverLetterFiles];

  // 5) If we need application data from board, set up the local array
  useEffect(() => {
    if (!boardLoading && columns?.length > 0) {
      const newApplications = columns.flatMap((col) =>
        col.cards.map((card) => ({
          label: `${card.position} (${col.title})`,
          value: card.id
        }))
      );
      setApplications(newApplications);
    }
  }, [boardLoading, columns]);

  // 6) Handle file uploads (CV / Cover Letter)
  const handleFileUpload = (e, fileType: 'cv' | 'coverLetter') => {
    const uploadedFiles = Array.from(e.target.files || []);

    const newFiles = uploadedFiles.map((file) => ({
      id: uuidv4(),
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      progress: 0,
      status: 'uploading',
      url: URL.createObjectURL(file),
      isDbFile: false,
    }));

    if (fileType === 'cv') {
      setUploadingCvFiles((prev) => [...prev, ...newFiles]);
    } else {
      setUploadingCoverLetterFiles((prev) => [...prev, ...newFiles]);
    }

    newFiles.forEach((file) => animateUpload(file, fileType));
  };

  const animateUpload = (file, fileType) => {
    const interval = setInterval(() => {
      if (fileType === 'cv') {
        setUploadingCvFiles((prevFiles) =>
          prevFiles.map((f) =>
            f.id === file.id
              ? {
                  ...f,
                  progress: Math.min(f.progress + getRandomIncrement(3, 10), 100),
                  status: f.progress >= 97 ? 'completed' : 'uploading',
                }
              : f
          )
        );
      } else {
        setUploadingCoverLetterFiles((prevFiles) =>
          prevFiles.map((f) =>
            f.id === file.id
              ? {
                  ...f,
                  progress: Math.min(f.progress + getRandomIncrement(3, 10), 100),
                  status: f.progress >= 97 ? 'completed' : 'uploading',
                }
              : f
          )
        );
      }
    }, 100);

    // After ~2s, "upload" is "done"
    setTimeout(() => {
      clearInterval(interval);

      // Create the file in DB
      const body = {
        typeId: fileType === 'cv' ? 1 : 2,
        fileUrl: file.url,
        fileName: file.name,
        extens: '.pdf',
        description: `Uploaded from UI (${fileType})`,
      };
      createFile(body);

      // Remove from local uploading
      if (fileType === 'cv') {
        setUploadingCvFiles((prev) => prev.filter((f) => f.id !== file.id));
      } else {
        setUploadingCoverLetterFiles((prev) => prev.filter((f) => f.id !== file.id));
      }
    }, 2000);
  };

  const getRandomIncrement = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  // 7) Handle removal from local UI + DB
  const removeFile = (fileId: string | number, fileType: 'CV' | 'CL') => {
    if (typeof fileId === 'number') {
      deleteFile(fileId);
    } else {
      if (fileType === 'CV') {
        setUploadingCvFiles((prev) => prev.filter((f) => f.id !== fileId));
      } else {
        setUploadingCoverLetterFiles((prev) => prev.filter((f) => f.id !== fileId));
      }
    }
  };

  // 8) Modal handling
  const openFileInModal = (file, type) => {
    setSelectedFile({ ...file, documentType: type });
    setIsModalOpen(true);
  };
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const renderFiles = (filesArray, fileType: 'CV' | 'CL') => (
    <Row gutter={20}>
      {filesArray.map((file) => (
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

  // 9) Main Return
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
            <h4 className="upload-title">CL</h4>
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
          {renderFiles(coverLetterFiles, 'CL')}
        </Col>
      </Row>

      {/* Pass onLocalUpdate for immediate local UI changes */}
      <FilePopup
        isOpen={isModalOpen}
        toggle={toggleModal}
        selectedFile={selectedFile}
        applications={applications}
        onLocalUpdate={handleLocalFileUpdate}
      />
    </div>
  );
};

export default Files;
