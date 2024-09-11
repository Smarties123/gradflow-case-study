import React from 'react';

const DeleteCardModal = ({ isOpen, onClose, onDelete }) => {
    if (!isOpen) return null;

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h3 style={styles.title}>Are you sure you want to delete this card?</h3>
                <div style={styles.buttonContainer}>
                    <button style={styles.cancelButton} onClick={onClose}>
                        Cancel
                    </button>
                    <button style={styles.deleteButton} onClick={onDelete}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

// Inline styling for the modal
const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        minWidth: '300px',
        maxWidth: '90%',
        textAlign: 'center',
    },
    title: {
        marginBottom: '20px',
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#333',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '10px',
    },
    cancelButton: {
        backgroundColor: '#ccc',
        color: '#333',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    deleteButton: {
        backgroundColor: '#ff6200',  // Similar color to the add card button
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
};

// Default export
export default DeleteCardModal;
