import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';
import './FilePopup.less';
import AwesomeButton from '../../components/AwesomeButton/AwesomeButton';
import Select from 'react-select';


const FilePopup = ({ isOpen, toggle, selectedFile, applications }) => {
  if (!isOpen) return null; // Don't render the popup if it's not open

  // Local state for editable fields
  const [title, setTitle] = useState(selectedFile?.name || '');
  const [description, setDescription] = useState(selectedFile?.description || '');



  // Filter function for the AsyncSelect
  const filterApplications = (inputValue) => {
    return applications
      .filter((job) =>
        job.toLowerCase().includes(inputValue.toLowerCase())
      )
      .map((job) => ({ label: job, value: job })); // Convert to label-value pairs
  };

  // Promise-based function for AsyncSelect
  const loadOptions = (inputValue) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(filterApplications(inputValue));
      }, 1000); // Simulate network delay
    });

  const documentOptions = [
    { value: 'CV', label: 'CV' },
    { value: 'Cover Letter', label: 'Cover Letter' },
  ];

  return (
    <div className="file-popup-container">
      <div className="file-popup-content">
        {/* Close Button */}
        <button className="close-button" onClick={toggle}
        >
          &times;
        </button>

        <div className="file-popup-body">
          {/* Left Column: File Preview */}
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

          {/* Right Column: File Details */}
          <div className="file-details">
            <h4>Edit Document</h4>

            {/* Title */}
            <div className="form-group">
              <label>Title<span className="required"> *</span></label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)} // Update title state
              />
            </div>

            {/* Document Type */}
            <div className="form-group">
              <label>Document Type<span className="required">*</span></label>
              <input
                type="text"
                className="form-control"
                value={selectedFile?.documentType || 'Unknown'}
                disabled
              />
            </div>

            {/* Assign to Job with AsyncSelect */}
            <div className="form-group">
              <label>Assign to Job<span className="required">*</span></label>
              <AsyncSelect
                cacheOptions
                defaultOptions={applications.map((job) => ({
                  label: job,
                  value: job,
                }))}
                loadOptions={loadOptions}
                isMulti
                placeholder="Search and select jobs..."
                className="react-select-container"
                classNamePrefix="react-select"


              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)} // Update description state
                rows="3"
              ></textarea>
            </div>

            {/* Update Button */}
            <AwesomeButton className="fileUpdate">
              <span>Update</span>
            </AwesomeButton>
          </div>
        </div>
      </div>
    </div >
  );
};

export default FilePopup;
