import React from 'react';
import { Modal, Button } from 'rsuite';



// Modal Component for Delete Account
const DeleteButtonModal = ({ isOpen, onClose, onDelete }) => {
    return (
        <Modal open={isOpen} onClose={onClose} size="xs">
            <Modal.Header>
                <Modal.Title>Delete Account</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete your account? This action cannot be undone.
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onDelete} appearance="primary" style={{ backgroundColor: '#FF6200' }}>
                    Delete
                </Button>
                <Button onClick={onClose} appearance="subtle">
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteButtonModal;
