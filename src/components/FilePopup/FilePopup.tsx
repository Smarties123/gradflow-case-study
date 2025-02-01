import React, { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import './FilePopup.less';
import AwesomeButton from '../../components/AwesomeButton/AwesomeButton';
import Select from 'react-select';
import { useFileData } from '../../hooks/useFileData';

const FilePopup = ({ isOpen, toggle, selectedFile, applications, onLocalUpdate }) => {
  if (!isOpen) return null;

  const { updateFile } = useFileData();

  // Local state for editable fields
  const [title, setTitle] = useState(selectedFile?.name || '');
  const [description, setDescription] = useState(selectedFile?.description || '');
  const [docType, setDocType] = useState(
    selectedFile?.documentType === 'CV' ? 'CV' : 'CL'
  );
  const [assignedJobs, setAssignedJobs] = useState([]);

  // Filter function for the AsyncSelect
  const filterApplications = (inputValue) => {
    return applications
      .filter((jobObj) =>
        // jobObj.label might be "Software Eng..."
        jobObj.label.toLowerCase().includes(inputValue.toLowerCase())
      )
      .map((jobObj) => ({ label: jobObj.label, value: jobObj.value }));
  };

  // Promise-based function for AsyncSelect
  const loadOptions = (inputValue) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(filterApplications(inputValue));
      }, 1000);
    });

  // Document type dropdown options
  const documentOptions = [
    { value: 'CV', label: 'CV' },
    { value: 'CL', label: 'Cover Letter' },
  ];

  // Reset local state each time a new file is passed in
  useEffect(() => {
    if (selectedFile) {
      setTitle(selectedFile.name || '');
      setDescription(selectedFile.description || '');
      setDocType(selectedFile.documentType === 'CV' ? 'CV' : 'CL');
      setAssignedJobs([]);
    }
  }, [selectedFile]);

  // Handle "Update" click
  const handleUpdate = async () => {
    // console.log('handleUpdate triggered!');
    // Prefer fileId if available
    const fileId = selectedFile?.fileId || selectedFile?.id;
    if (!fileId) return;
  
    const typeId = docType === 'CV' ? 1 : 2;
    let applicationsId = null;
    if (assignedJobs.length > 0) {
      applicationsId = assignedJobs[0].value;
    }
  
    const updatePayload = {
      fileName: title,
      typeId,
      applicationsId,
      description,
    };
  
    // Pass the proper identifier to updateFile
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
            <h4>Edit Document</h4>

            <div className="form-group">
              <label>
                Title<span className="required"> *</span>
              </label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>
                Document Type<span className="required">*</span>
              </label>
              <Select
                options={documentOptions}
                value={documentOptions.find((opt) => opt.value === docType)}
                onChange={(selected) => setDocType(selected.value)}
              />
            </div>

            <div className="form-group">
              <label>
                Assign to Job<span className="required">*</span>
              </label>
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
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
              />
            </div>

            <AwesomeButton className="fileUpdate" onClick={handleUpdate}>
              <span>Update</span>
            </AwesomeButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilePopup;
