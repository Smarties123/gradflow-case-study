import React from 'react';
import '../Modal/Modal.less';

const DeleteModal = ({ isOpen, onClose, onYes, onNo, title = "test" }) => {
    if (!isOpen) return null;

    const handleDelete = () => {
        onYes();  // Call the function passed in for delete confirmation
        onClose(); // Close the modal after confirming deletion
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className={`modal-content`} onClick={(e) => e.stopPropagation()}>
                <h2>Are You Sure?</h2>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="input-wrapper">
                        <label className="bordered-label">Delete Column</label>
                        <input
                            type="text"
                            placeholder={title}
                            className="border-input"
                        />
                    </div>
                    <div className="modal-buttons">
                        <button type="button" className="cancel-button" onClick={onNo}>
                            Cancel
                        </button>
                        <button type="button" className="delete-button" onClick={handleDelete}>
                            Delete
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DeleteModal;
