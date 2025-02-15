import React, { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import './FilePopup.less';
import AwesomeButton from '../../components/AwesomeButton/AwesomeButton';
import Select from 'react-select';
import { useFileData } from '../../hooks/useFileData';

const FilePopup = ({
  isOpen,
  toggle,
  selectedFile,
  applications,
  onLocalUpdate,
  // NEW: allow readOnly, default to false
  readOnly = false
}) => {
  if (!isOpen) return null;

  const { updateFile } = useFileData();

  // Local state for editable fields
  const [title, setTitle] = useState(selectedFile?.name || '');
  const [description, setDescription] = useState(selectedFile?.description || '');
  const [docType, setDocType] = useState(
    selectedFile?.documentType === 'CV' ? 'CV' : 'CL'
  );

  // The multi-selected apps
  const [assignedJobs, setAssignedJobs] = useState([]);

  // Document type dropdown options
  const documentOptions = [
    { value: 'CV', label: 'CV' },
    { value: 'CL', label: 'Cover Letter' }
  ];

  // Filter function for the AsyncSelect
  const filterApplications = (inputValue) => {
    return applications
      .filter((jobObj) =>
        jobObj.label.toLowerCase().includes(inputValue.toLowerCase())
      )
      .map((jobObj) => ({ label: jobObj.label, value: jobObj.value }));
  };

  // Promise-based function for AsyncSelect
  const loadOptions = (inputValue) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(filterApplications(inputValue));
      }, 300);
    });

  // 1) On mount OR whenever "selectedFile" changes,
  //    set local states: title, description, docType, assignedJobs
  useEffect(() => {
    if (selectedFile) {
      setTitle(selectedFile.name || '');
      setDescription(selectedFile.description || '');
      setDocType(selectedFile.documentType === 'CV' ? 'CV' : 'CL');

      // If the file has an array of assigned apps (ApplicationIds),
      // map them to { label, value } objects for react-select
      if (Array.isArray(selectedFile.ApplicationIds)) {
        const matched = selectedFile.ApplicationIds.map((appId) => {
          const found = applications.find((a) => a.value === appId);
          return found
            ? { label: found.label, value: found.value }
            : { label: `App #${appId}`, value: appId };
        });
        setAssignedJobs(matched);
      } else {
        setAssignedJobs([]);
      }
    }
  }, [selectedFile, applications]);

  // 2) Handle "Update" (only relevant if not read-only)
  const handleUpdate = async () => {
    const fileId = selectedFile?.fileId || selectedFile?.id;
    if (!fileId) return;

    // convert docType back to a numeric typeId
    const typeId = docType === 'CV' ? 1 : 2;

    // get the array of app IDs from assignedJobs
    const applicationsIds = assignedJobs.map((j) => j.value);

    // build payload
    const updatePayload = {
      fileName: title,
      typeId,
      applicationsIds,
      description,
    };

    const updatedFile = await updateFile(fileId, updatePayload);
    if (updatedFile) {
      onLocalUpdate(updatedFile);
    }
    toggle();
  };

  return (
    <div className="file-popup-container">
      <div className="file-popup-content">
        <button className="close-button" onClick={toggle}>
          &times;
        </button>

        <div className="file-popup-body">
          <div className="file-preview">
            <iframe
              src={selectedFile?.url}
              style={{
                width: '100%',
                height: '100%',
                border: '1px solid #ddd',
                borderRadius: '4px',
              }}
              title={selectedFile?.name}
            />
          </div>

          <div className="file-details">
            {/* Change heading based on readOnly */}
            <h4>{readOnly ? 'Document Info' : 'Edit Document'}</h4>

            {/* Title */}
            <div className="form-group">
              <label>
                Title<span className="required"> *</span>
              </label>
              {readOnly ? (
                <div style={{ marginTop: '8px' }}>{title}</div>
              ) : (
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              )}
            </div>

            {/* Document Type */}
            <div className="form-group">
              <label>
                Document Type<span className="required">*</span>
              </label>
              {readOnly ? (
                <div style={{ marginTop: '8px' }}>
                  {docType === 'CV' ? 'CV' : 'Cover Letter'}
                </div>
              ) : (
                <Select
                  options={documentOptions}
                  value={documentOptions.find((opt) => opt.value === docType)}
                  onChange={(selected) => setDocType(selected.value)}
                />
              )}
            </div>

            {/* Assign to Job(s) */}
            <div className="form-group">
              <label>Assign to Job (Multi-Select)</label>
              {readOnly ? (
                <div style={{ marginTop: '8px' }}>
                  {assignedJobs.length
                    ? assignedJobs.map((job) => job.label).join(', ')
                    : 'No jobs assigned'}
                </div>
              ) : (
                <AsyncSelect
                  cacheOptions
                  defaultOptions={applications}
                  loadOptions={loadOptions}
                  isMulti
                  placeholder="Search and select jobs..."
                  className="react-select-container"
                  classNamePrefix="react-select"
                  value={assignedJobs}
                  onChange={(selected) => setAssignedJobs(selected || [])}
                />
              )}
            </div>

            {/* Description */}
            <div className="form-group">
              <label>Description</label>
              {readOnly ? (
                <div style={{ marginTop: '8px' }}>
                  {description || 'No description'}
                </div>
              ) : (
                <textarea
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                />
              )}
            </div>

            {/* Only show update button if not readOnly */}
            {!readOnly && (
              <AwesomeButton className="fileUpdate" onClick={handleUpdate}>
                <span>Update</span>
              </AwesomeButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilePopup;
