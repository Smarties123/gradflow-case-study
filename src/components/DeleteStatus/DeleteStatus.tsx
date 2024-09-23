import React from 'react';
import '../Modal/Modal.less'; // Ensure your Modal styles are linked

const DeleteModal = ({ isOpen, onClose, onYes, onNo }) => {
    if (!isOpen) return null;

    const handleDelete = () => {
        onYes();  // Call the function passed in for delete confirmation
        onClose(); // Close the modal after confirming deletion
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className={`modal-content`} onClick={(e) => e.stopPropagation()}>
                <h2>Are You Sure?</h2>
                <div className="modal-buttons">
                    <button type="button" className="cancel-button" onClick={onNo}>
                        Cancel
                    </button>
                    <button type="button" className="delete-button" onClick={handleDelete}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
