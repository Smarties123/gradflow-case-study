import React, { useContext, useState, useEffect } from 'react';
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

    const [companyLogo, setCompanyLogo] = useState('');

    const [errors, setErrors] = useState({});

    const [companySuggestions, setCompanySuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false); // Add this

    useEffect(() => {
        if (company.length > 2) {
            const fetchCompanySuggestions = async () => {
                try {
                    const response = await fetch(`http://localhost:3001/company-search?q=${company}`, {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setCompanySuggestions(data);
                        setShowSuggestions(true); // Show the suggestions
                    } else {
                        console.error('Failed to fetch company suggestions');
                    }
                } catch (error) {
                    console.error('Error fetching company suggestions:', error);
                }
            };
            fetchCompanySuggestions();
        } else {
            setCompanySuggestions([]);
            setShowSuggestions(false); // Hide the suggestions if input is too short
        }
    }, [company]);
    
    
    const validateForm = () => {
        const newErrors = {};
        if (!company) newErrors.company = 'Company is required';
        if (!position) newErrors.position = 'Position is required';
        // if (!deadline) {
        //     newErrors.deadline = 'Deadline is required';
        // } else {
        //     const selectedDate = dayjs(deadline);
        //     if (selectedDate.isBefore(dayjs(), 'day')) {
        //         newErrors.deadline = 'Deadline cannot be in the past';
        //     }
        // }
        // if (!location) newErrors.location = 'Location is required';
        // if (!url) newErrors.url = 'URL is required';

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
                companyLogo,
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
                        <div className="company-input-wrapper">
                            <input
                                type="text"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                placeholder="Ex. Apple"
                                autoComplete="off"
                                // onFocus={() => setShowSuggestions(true)} // Show suggestions on focus
                                // onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} // Hide suggestions after a short delay
                            />
                            {showSuggestions && companySuggestions.length > 0 && (
                                <ul className="suggestions-list">
                                    {companySuggestions.slice(0, 5).map((suggestion, index) => (
                                        <li key={index} onClick={() => {
                                            setCompany(suggestion.name);
                                            setUrl(suggestion.domain);
                                            setCompanyLogo(suggestion.logo_url); // Save the logo URL
                                            setShowSuggestions(false); // Hide the dropdown
                                        }}>
                                            <div className="suggestion-item">
                                                <img src={suggestion.logo_url} alt={suggestion.name} className="company-logo-modal" />
                                                <div className="company-details">
                                                    <span className="company-name-modal">{suggestion.name}</span>
                                                    <span className="company-domain-modal">{suggestion.domain}</span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {companyLogo && (
                                <img src={companyLogo} alt={company} className="selected-company-logo" />
                            )}
                        </div>
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
