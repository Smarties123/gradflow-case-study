import React from 'react';
import PropTypes from 'prop-types';
import '../Modal/Modal.less';

const DeleteModal = ({ isOpen, onClose, onYes, onNo, title }) => {
  if (!isOpen) return null;

  const handleDelete = () => {
    // e.stopPropagation();
    onYes();
    onClose();
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    onNo();
    onClose(); // Make sure to close the modal
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{title || "Are You Sure?"}</h2>
        <div className="modal-buttons">
          <button type="button" className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
          <button type="button" className="delete-button" style={{backgroundColor:'#FF6200'}} onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Define PropTypes for the component
DeleteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onYes: PropTypes.func.isRequired,
  onNo: PropTypes.func.isRequired,
  title: PropTypes.string, // Title is optional
};

export default DeleteModal;
