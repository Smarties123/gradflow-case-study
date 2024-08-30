import React, { useContext, useState } from 'react';
import './Modal.less';
import { BoardContext } from '@/pages/board/BoardContext';
import { useUser } from '@/components/User/UserContext'; // Import the user context

const Modal = ({ isOpen, onClose, activeColumn, columns, theme }) => {
    const { addCardToColumn } = useContext(BoardContext);
    const { user } = useUser(); // Access the user context here

    if (!isOpen) return null;

    const [company, setCompany] = useState('');
    const [position, setPosition] = useState('');
    const [deadline, setDeadline] = useState('');
    const [location, setLocation] = useState('');
    const [url, setUrl] = useState('');
    const [selectedColumn, setSelectedColumn] = useState(activeColumn ? activeColumn.id : columns[0]?.id);

    const date_applied = new Date().toLocaleDateString('en-GB'); // Format as dd-mm-yyyy
    const card_color = '#ff6200';

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (company && position) {
            // console.log(deadline);
            const [day, month, year] = date_applied.split('/');
            const formattedDeadline = `${year}-${month}-${day}`; //Format for PostGRE
            const card = {
                id: Date.now(), // Unique ID for the card
                company,
                position,
                deadline,
                location,
                url,
                date_applied: formattedDeadline,
                card_color,
                userId: user ? user.id : null, // Attach the user ID from the context
            };

            console.log('Adding card to column:', selectedColumn);

            // Send data to the server
            try {
                const response = await fetch('http://localhost:3001/addjob', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`, // Attach the token for authentication
                    },
                    body: JSON.stringify(card),
                });

                if (response.ok) {
                    console.log('Job added successfully');
                } else {
                    console.error('Failed to add job');
                }
            } catch (err) {
                console.error('Error adding job:', err);
            }

            // Add the card to the selected or active column locally
            addCardToColumn(activeColumn ? activeColumn.id : selectedColumn, card);

            // Close the modal after adding the card
            onClose();
        } else {
            console.log('Company and position are required.');
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className={`modal-content ${theme === 'dark' ? 'rs-theme-dark' : ''}`} onClick={(e) => e.stopPropagation()}>
                <h2>Add Job</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-wrapper">
                        <label className="bordered-label">Company</label>
                        <input
                            type="text"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder="Ex. Apple"
                        />
                    </div>
                    <div className="input-wrapper">
                        <label className="bordered-label">Position</label>
                        <input
                            type="text"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            className="border-input"
                            placeholder="Ex. Software Engineer"
                        />
                    </div>
                    <div className="input-wrapper">
                        <label className="bordered-label">Deadline</label>
                        <input
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="border-input"
                            placeholder="dd-MM-yyyy"
                        />
                    </div>
                    <div className="input-wrapper">
                        <label className="bordered-label">Location</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="border-input"
                            placeholder="London"
                        />
                    </div>
                    <div className="input-wrapper">
                        <label className="bordered-label">URL</label>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="border-input"
                            placeholder="https://jobs.apple.com/"
                        />
                    </div>
                    {activeColumn ? (
                        <div className="input-wrapper">
                            <label className="bordered-label">Column</label>
                            <input
                                type="text"
                                value={activeColumn.title}
                                disabled
                                className="border-input"
                                style={{ color: 'grey', fontWeight: 900 }}
                            />
                        </div>
                    ) : (
                        <div className="input-wrapper">
                            <label className="bordered-label">Choose a Column</label>
                            <select
                                value={selectedColumn}
                                onChange={(e) => setSelectedColumn(parseInt(e.target.value))}
                                className="border-input dropdown-input"
                            >
                                {columns.map((col) => (
                                    <option key={col.id} value={col.id}>
                                        {col.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div className="modal-buttons">
                        <button type="button" className="cancel-button" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="add-card-button">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;
