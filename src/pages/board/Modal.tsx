import React, { useState } from 'react';
import './Modal.less';

const Modal = ({ isOpen, onClose, column, addCardToColumn, theme }) => {
    if (!isOpen) return null;

    // Add Job Form: Company,Position, Deadline, Location, URL
    const [company, setCompany] = useState('');
    const [position, setPosition] = useState('');
    const [deadline, setDeadline] = useState('');
    const [location, setLocation] = useState('');
    const [url, setUrl] = useState('');
    const date_applied = useState(() => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        return `${day}-${month}-${year}`;
    });



    const handleSubmit = (e) => {
        e.preventDefault();
        if (company && position) {
            addCardToColumn(column.id, { company, position, deadline, location, url, date_applied });
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className={`modal-content ${theme === 'dark' ? 'rs-theme-dark' : ''}`} onClick={e => e.stopPropagation()}>
                <h2>Add Job</h2>
                <form onSubmit={e => {
                    e.preventDefault();
                    handleSubmit(e);
                    // Handle form submission logic here
                    onClose(); // Close modal after form submission
                }}>

                    <div className="input-wrapper">
                        <label className="bordered-label">Company</label>

                        <input
                            type="text"
                            value={company}
                            onChange={e => setCompany(e.target.value)}

                            placeholder="Ex. Apple"
                        />
                    </div>
                    <div className="input-wrapper">
                        <label className="bordered-label">Position</label>
                        <input
                            type="text"
                            value={position}
                            onChange={e => setPosition(e.target.value)}
                            className="border-input"
                            placeholder="Ex. Software Engineer"
                        />
                    </div>
                    <div className="input-wrapper">
                        <label className="bordered-label">Deadline</label>
                        <input
                            type="date"
                            value={deadline}
                            onChange={e => setDeadline(e.target.value)}
                            className="border-input"
                            placeholder="dd-MM-yyyy"
                        />
                    </div>
                    {/* <div className="input-wrapper">
                        <label className="bordered-label">Location</label>

                        <input
                            type="text"
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                            className="border-input"
                            placeholder="London"
                        />
                    </div>
                    <div className="input-wrapper">
                        <label className="bordered-label">URL</label>
                        <input
                            type="text"
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                            className="border-input"
                            placeholder="https://jobs.apple.com/"
                        />
                    </div> */}



                    <div className="modal-buttons">
                        <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
                        <button type="submit" className="add-card-button">Save</button>
                    </div>
                </form>
            </div >
        </div >
    );
};

export default Modal;
