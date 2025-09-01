import React, { useState, useEffect } from 'react';
import { Row, Col, Progress } from 'rsuite';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import './Files.less';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';
import FilePopup from '../../components/FilePopup/FilePopup';
import { PremiumUpgradeModal } from '../../components/PremiumUpgradeModal';

import { useUser } from '../../components/User/UserContext';
import { useBoardData } from '../../hooks/useBoardData';
import { useFileData } from '../../hooks/useFileData';
// import { SelectPicker } from 'rsuite';

const Files = () => {
  // --------------------------------
  // STATES
  // --------------------------------
  const [uploadingCvFiles, setUploadingCvFiles] = useState([]);
  const [uploadingCoverLetterFiles, setUploadingCoverLetterFiles] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [premiumFeatureName, setPremiumFeatureName] = useState('');

  const [applications, setApplications] = useState([]);
  const [selectedAppCV, setSelectedAppCV] = useState(null);
  const [selectedAppCL, setSelectedAppCL] = useState(null);

  const { user } = useUser();
  const { columns, loading: boardLoading } = useBoardData(user);

  const {
    files,
    loading,
    error,
    createFile,
    deleteFile,
    updateFile,
    uploadAndCreateFile, // <-- The important new function
  } = useFileData();

  // Mirror DB's file list locally
  const [localFiles, setLocalFiles] = useState(files);

  useEffect(() => {
    setLocalFiles(files);
  }, [files]);

  // --------------------------------
  // UPDATING LOCAL STATE AFTER EDIT
  // --------------------------------
  const handleLocalFileUpdate = (updatedFile) => {
    if (!updatedFile) return;
    setLocalFiles((prev) =>
      prev.map((f) => (f.fileId === updatedFile.fileId ? updatedFile : f))
    );
  };

  // --------------------------------
  // SEPARATE OUT CV AND COVER LETTER
  // --------------------------------
  const dbCvFiles = localFiles
    .filter((f) => f.fileType === 'CV')
    .map((f) => ({
      id: f.fileId,
      fileId: f.fileId,
      name: f.fileName,
      size: '---',
      progress: 100,
      status: 'completed',
      url: f.fileUrl,
      isDbFile: true,
      description: f.description,
      ApplicationIds: f.ApplicationIds,
    }));

  const dbCoverLetterFiles = localFiles
    .filter((f) => f.fileType === 'CL')
    .map((f) => ({
      id: f.fileId,
      fileId: f.fileId,
      name: f.fileName,
      size: '---',
      progress: 100,
      status: 'completed',
      url: f.fileUrl,
      isDbFile: true,
      description: f.description,
      ApplicationIds: f.ApplicationIds,
    }));

  const cvFiles = [...dbCvFiles, ...uploadingCvFiles];
  const coverLetterFiles = [...dbCoverLetterFiles, ...uploadingCoverLetterFiles];

  // --------------------------------
  // GATHER ALL APPLICATIONS
  // --------------------------------
  useEffect(() => {
    if (!boardLoading && columns?.length > 0) {
      const newApplications = columns.flatMap((col) =>
        col.cards.map((card) => ({
          label: `${card.position} (${col.title})`,
          value: Number(card.id),
        }))
      );
      setApplications(newApplications);
    }
  }, [boardLoading, columns]);

  // --------------------------------
  // HANDLE UPLOAD
  // --------------------------------
  // fileType is 'CV' or 'CL'
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileType: 'CV' | 'CL'
  ) => {

    // Calculate total CV + Cover Letter count
    const totalCvCount = [...uploadingCvFiles, ...dbCvFiles].length;
    const totalClCount = [...uploadingCoverLetterFiles, ...dbCoverLetterFiles].length;
    const totalFilesCount = totalCvCount + totalClCount;

    const remainingSlots = 5 - totalFilesCount;

    if (!e.target.files || e.target.files.length === 0) return;

    if (remainingSlots <= 0 && !user?.isMember) {
      setIsPremiumModalOpen(true);
      return;
    }

    const uploadedFiles = Array.from(e.target.files || []).map((file) => ({
      id: uuidv4(),
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      progress: 0,
      status: 'uploading',
      url: URL.createObjectURL(file), // local preview
      isDbFile: false,
      file // store the actual File object
    }));



    // Upload only the files that fit within the remaining slots
    const filesToUpload = uploadedFiles.slice(0, remainingSlots);

    if (fileType === 'CV') {
      setUploadingCvFiles((prev) => [...prev, ...filesToUpload]);
    } else {
      setUploadingCoverLetterFiles((prev) => [...prev, ...filesToUpload]);
    }
  
    // Animate + upload only the allowed files
    filesToUpload.forEach((fileObj) => animateUpload(fileObj, fileType));
  
    // Reset the input value to allow re-selection
    e.target.value = '';
  };
  
  

  const animateUpload = (fileObj, fileType: 'CV' | 'CL') => {
    // Fake progress
    const interval = setInterval(() => {
      if (fileType === 'CV') {
        setUploadingCvFiles((prevFiles) =>
          prevFiles.map((f) =>
            f.id === fileObj.id
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
            f.id === fileObj.id
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

    // After ~2 seconds, do actual S3 upload + create file record
    setTimeout(async () => {
      clearInterval(interval);

      // docType: 'cv' or 'cl'
      const docType = fileType === 'CV' ? 'cv' : 'cl';
      const typeId = fileType === 'CV' ? 1 : 2;

      await uploadAndCreateFile({
        file: fileObj.file,
        docType,
        typeId,
        description: `Uploaded from Site (${fileType})`,
        applicationsIds:
          fileType === 'CV'
            ? selectedAppCV
              ? [selectedAppCV]
              : []
            : selectedAppCL
            ? [selectedAppCL]
            : [],
      });

      // Remove from uploading list
      if (fileType === 'CV') {
        setUploadingCvFiles((prev) => prev.filter((f) => f.id !== fileObj.id));
      } else {
        setUploadingCoverLetterFiles((prev) =>
          prev.filter((f) => f.id !== fileObj.id)
        );
      }
    }, 2000);
  };

  // Random increment for the “fake” progress bar
  const getRandomIncrement = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  // --------------------------------
  // HANDLE REMOVAL (LOCAL + DB)
  // --------------------------------
  const removeFile = (fileId: string | number, fileType: 'CV' | 'CL') => {
    if (typeof fileId === 'number') {
      // It's a DB file
      deleteFile(fileId);
    } else {
      // It's a local uploading file
      if (fileType === 'CV') {
        setUploadingCvFiles((prev) => prev.filter((f) => f.id !== fileId));
      } else {
        setUploadingCoverLetterFiles((prev) => prev.filter((f) => f.id !== fileId));
      }
    }
  };

  // --------------------------------
  // MODAL HANDLING
  // --------------------------------
  const openFileInModal = (file, type) => {
    setSelectedFile({ ...file, documentType: type });
    setIsModalOpen(true);
  };
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  // --------------------------------
  // RENDER FILE CARDS
  // --------------------------------
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
              {/* <p className="files-file-size">{file.size}</p> */}
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

  // --------------------------------
  // MAIN RETURN
  // --------------------------------
  return (
    <div className="files-page">
    <div className="scroll-container"> {/* Add Scroll Container */}

      <Row gutter={20} className="upload-section">
        {/* CV Column */}
        <Col xs={12}>
          <div className="upload-card">
              <div className="upload-header">
                <h4 className="upload-title">CV</h4>
              </div>
            {/* <SelectPicker
              data={applications}
              placeholder="Select Application (optional)"
              value={selectedAppCV}
              onChange={setSelectedAppCV}
              style={{ width: '100%', marginBottom: '1rem' }}
            /> */}
            <label htmlFor="cv-upload" className="upload-label">
              <div className="files-upload-area">
                <input
                  type="file"
                  id="cv-upload"
                  accept=".pdf,.doc,.docx"
                  multiple
                  onChange={(e) => handleFileUpload(e, 'CV')}
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
              <div className="upload-header">
                <h4 className="upload-title">Cover Letter</h4>
                <span className={`upload-count ${cvFiles.length + coverLetterFiles.length >= 5 ? 'at-limit' : ''}`}>
                  {cvFiles.length + coverLetterFiles.length}/5
                </span>
              </div>
            {/* <SelectPicker
              data={applications}
              placeholder="Select Application (optional)"
              value={selectedAppCL}
              onChange={setSelectedAppCL}
              style={{ width: '100%', marginBottom: '1rem' }}
            /> */}
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
                  onChange={(e) => handleFileUpload(e, 'CL')}
                  style={{ display: 'none' }}
                />
                <div className="upload-icon">
                  <UploadFileIcon />
                </div>
                <p className="upload-instructions">
                  <span style={{ color: '#7C41E3' }}>Click to Upload</span> or drag and
                  drop
                  <br />
                  (Max. File size: 25 MB per file)
                </p>
              </div>
            </label>
          </div>
          {renderFiles(coverLetterFiles, 'CL')}
        </Col>
      </Row>

      <FilePopup
        isOpen={isModalOpen}
        toggle={toggleModal}
        selectedFile={selectedFile}
        applications={applications}
        onLocalUpdate={handleLocalFileUpdate}
        readOnly={false}
      />

        <PremiumUpgradeModal
          isOpen={isPremiumModalOpen}
          onClose={() => setIsPremiumModalOpen(false)}
          featureName={premiumFeatureName}
        />
     </div> 
    </div>
  );
};

export default Files;
