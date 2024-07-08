import React, { useState } from 'react';
import './Modal.less';

const Modal = ({ isOpen, onClose, column, addCardToColumn }) => {
    if (!isOpen) return null;

    // Add Job Form: Company,Position, Deadline, Location, URL
    const [company, setCompany] = useState('');
    const [position, setPosition] = useState('');
    const [deadline, setDeadline] = useState('');
    const [location, setLocation] = useState('');
    const [url, setUrl] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (company && position) {
            addCardToColumn(column.id, { company, position, deadline, location, url });
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Add Job: {column.title}</h2>
                <form onSubmit={e => {
                    e.preventDefault();
                    handleSubmit(e);
                    // Handle form submission logic here
                    onClose(); // Close modal after form submission
                }}>
                    <input type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder="Company" />
                    <input type="text" value={position} onChange={e => setPosition(e.target.value)} placeholder="Position" />
                    <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} placeholder="Deadline" />
                    <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Location" />
                    <input type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="URL" />
                    <button type="submit">Add Card</button>
                </form>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default Modal;
