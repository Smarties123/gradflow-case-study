import React from 'react';
import '../Modal/Modal.less';
import './DeleteCardModal.less';

const DeleteCardModal = ({ isOpen, onClose, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content`} onClick={e => e.stopPropagation()}>
        <h3 id="title">Are you sure you want to delete this card?</h3>
        <div className="modal-buttons">
          <button type="button" className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="delete-button" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Default export
export default DeleteCardModal;
