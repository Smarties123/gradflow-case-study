import React from 'react';
import { Grid, Row, Col, Button, SelectPicker } from 'rsuite';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Button as RemoveFile } from '@mui/material';
import { IoMdRemove } from 'react-icons/io';
import { MdDelete } from 'react-icons/md';

const DocumentsView = ({
  card,
  formData,
  appFiles,
  hoveredFileId,
  setHoveredFileId,
  openFile,
  handleRemove,
  handleDelete,
  handleFileUpload,
  removeFile,
  attachFileSelections,
  setAttachFileSelections,
  handleAttachFiles,
  unusedFilesData
}) => {
  return (
    <div className="document-section">
      {/* Existing files for this application */}
      {appFiles.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <h5>Existing Files for this Application:</h5>
          {appFiles.map((file) => (
            <div
              key={file.fileId}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '5px'
              }}
              onMouseEnter={() => setHoveredFileId(file.fileId)}
              onMouseLeave={() => setHoveredFileId(null)}
            >
              {/* Left side: Icon + filename (click to open) */}
              <div
                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => openFile(file)}
              >
                <InsertDriveFileIcon style={{ marginRight: '5px' }} />
                <span>
                  {file.fileName} ({file.fileType})
                </span>
              </div>

              {/* Right side: Remove + Delete icons (only visible on hover) */}
              {hoveredFileId === file.fileId && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <IoMdRemove
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleRemove(file)}
                  />
                  <MdDelete
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleDelete(file.fileId)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Attach existing files */}
      {unusedFilesData?.length > 0 && (
        <div className="attach-existing-file">
          <h5>Attach an Existing File:</h5>
          <div className="attach-file-row">
            <SelectPicker
              data={unusedFilesData}
              value={attachFileSelections}
              onChange={(val) => setAttachFileSelections(val)}
              placeholder="Select File(s)"
              style={{ width: 300 }}
              searchable
              multiple
            />
            <Button appearance="primary" onClick={handleAttachFiles}>
              Attach
            </Button>
          </div>
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
                    <span>
                      {formData.cv ? 'Click to replace file' : 'Click to upload'}
                    </span>{' '}
                    or drag and drop
                    <br />
                    (Max. File size: 25 MB)
                  </p>
                </div>
              </label>

              {/* Uploaded CV display */}
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
            <div
              id="coverLetter"
              className={`document-card ${
                formData.coverLetter ? 'coverLetter-uploaded' : ''
              }`}
            >
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
                    <span>
                      {formData.coverLetter ? 'Click to replace file' : 'Click to upload'}
                    </span>{' '}
                    or drag and drop
                    <br />
                    (Max. File size: 25 MB)
                  </p>
                </div>
              </label>

              {/* Uploaded Cover Letter display */}
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
  );
};

export default DocumentsView;
