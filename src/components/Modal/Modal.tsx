import React, { useContext, useState } from 'react';
import './Modal.less';
import { BoardContext } from '@/pages/board/BoardContext';
import { useUser } from '@/components/User/UserContext';
import { FormHelperText } from '@mui/material'; // Import FormHelperText from MUI
import dayjs from 'dayjs';

const Modal = ({ isOpen, onClose, activeColumn, columns, theme }) => {
    const { addCardToColumn } = useContext(BoardContext);
    const { user } = useUser();

    if (!isOpen) return null;

    const [company, setCompany] = useState('');
    const [position, setPosition] = useState('');
    const [deadline, setDeadline] = useState('');
    const [location, setLocation] = useState('');
    const [url, setUrl] = useState('');
    const [selectedColumn, setSelectedColumn] = useState(activeColumn ? activeColumn.id : columns[0]?.id);

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!company) newErrors.company = 'Company is required';
        if (!position) newErrors.position = 'Position is required';
        if (!deadline) {
            newErrors.deadline = 'Deadline is required';
        } else {
            const selectedDate = dayjs(deadline);
            if (selectedDate.isBefore(dayjs(), 'day')) {
                newErrors.deadline = 'Deadline cannot be in the past';
            }
        }
        if (!location) newErrors.location = 'Location is required';
        if (!url) newErrors.url = 'URL is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const card = {
                id: Date.now(),
                company,
                position,
                deadline: dayjs(deadline).format('YYYY-MM-DD'),
                location,
                url,
                date_applied: dayjs().format('YYYY-MM-DD'),
                card_color: '#ff6200',
                userId: user ? user.id : null,
            };

            try {
                const response = await fetch('http://localhost:3001/addjob', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`,
                    },
                    body: JSON.stringify(card),
                });

                if (response.ok) {
                    addCardToColumn(activeColumn ? activeColumn.id : selectedColumn, card);
                    onClose();
                } else {
                    console.error('Failed to add job');
                }
            } catch (err) {
                console.error('Error adding job:', err);
            }
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
                        {errors.company && <FormHelperText error>{errors.company}</FormHelperText>}
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
                        {errors.position && <FormHelperText error>{errors.position}</FormHelperText>}
                    </div>
                    <div className="input-wrapper">
                        <label className="bordered-label">Deadline</label>
                        <input
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="border-input"
                        />
                        {errors.deadline && <FormHelperText error>{errors.deadline}</FormHelperText>}
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
                        {errors.location && <FormHelperText error>{errors.location}</FormHelperText>}
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
                        {errors.url && <FormHelperText error>{errors.url}</FormHelperText>}
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
