import React, { useContext, useState, useEffect } from 'react';
import './Modal.less';
import { BoardContext } from '@/pages/board/BoardContext';
import { useUser } from '@/components/User/UserContext';
import { FormHelperText } from '@mui/material'; // Import FormHelperText from MUI
import dayjs from 'dayjs';
import Github from '@uiw/react-color-github';  // Import the color picker



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
    const [suggestionSelected, setSuggestionSelected] = useState(false);
    const [selectedColor, setSelectedColor] = useState(''); // No default color initially
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false); // Toggle state for color picker visibility
    const colorOptions = ['#ff6200', '#1abc9c', '#3498db', '#9b59b6', '#e74c3c', '#f1c40f', '#2ecc71', '#e67e22'];

    useEffect(() => {
        const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
        setSelectedColor(randomColor);
    }, [isOpen]); // This effect runs whenever the modal is opened


    useEffect(() => {
        if (company.length > 2 && !suggestionSelected) {  // Only fetch suggestions if no suggestion was selected
            const fetchCompanySuggestions = async () => {
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/company-search?q=${company}`, {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setCompanySuggestions(data);
                        setShowSuggestions(true);  // Show the suggestions
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
            setShowSuggestions(false);  // Hide the suggestions if input is too short
        }
    }, [company, suggestionSelected]);  // Include suggestionSelected in the dependency array

    // Handle suggestion click to select the suggestion
    const handleSuggestionClick = (suggestion) => {
        setCompany(suggestion.name);
        setCompanyLogo(suggestion.logo_url);  // Save the logo URL
        setShowSuggestions(false);  // Hide the dropdown
        setSuggestionSelected(true);  // Set the flag to true once a suggestion is selected
    };

    // Handle blur event to save only text without logo and URL when user clicks offscreen
    const handleBlur = (e) => {
        if (!companySuggestions.length || !showSuggestions) {
            setCompanyLogo('');
            setUrl('');
        }
        setTimeout(() => setShowSuggestions(false), 150);  // Hide suggestions after a delay
    };

    // Handle key press event to select the first suggestion on 'Enter'
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && companySuggestions.length > 0) {
            e.preventDefault();  // Prevent default 'Enter' behavior
            const firstSuggestion = companySuggestions[0];
            setCompany(firstSuggestion.name);
            setCompanyLogo(firstSuggestion.logo_url);  // Save the logo URL
            setShowSuggestions(false);  // Hide the dropdown
            setSuggestionSelected(true);  // Set the flag to true once a suggestion is selected
        }
    };

    // Reset the flag when input is cleared or changed significantly
    const handleInputChange = (e) => {
        setCompany(e.target.value);
        if (e.target.value === '') {
            setSuggestionSelected(false);  // Reset the flag when input is cleared
            setCompanyLogo('');
        }
    };






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

    const toggleColorPicker = () => {
        setIsColorPickerOpen(!isColorPickerOpen); // Toggle the color picker visibility
    };

    const handleColorChange = (color) => {
        setSelectedColor(color.hex); // Set selected color
        setIsColorPickerOpen(false); // Close color picker after selection
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const card = {
                company,
                position,
                deadline: deadline ? dayjs(deadline).format('YYYY-MM-DD') : null,
                location: location || null,
                url: url || null,
                companyLogo: companyLogo || null,
                date_applied: dayjs().format('YYYY-MM-DD'),
                card_color: selectedColor,  // Use the selected color
                userId: user ? user.id : null,
                statusId: activeColumn ? activeColumn.id : selectedColumn,
            };

            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/addjob`, {
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
                                onChange={handleInputChange}
                                placeholder="Ex. Apple"
                                autoComplete="off"
                                onBlur={handleBlur}  // Handle blur event
                                onKeyDown={handleKeyDown}  // Handle 'Enter' key press
                            />
                            {showSuggestions && companySuggestions.length > 0 && ( // Inside JSX for suggestions dropdown
                                <ul className="suggestions-list">
                                    {companySuggestions.slice(0, 5).map((suggestion, index) => (
                                        <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                                            <div className="suggestion-item">
                                                <img src={suggestion.logo_url} alt={suggestion.name} className="company-logo-modal" />
                                                <div className="company-details">
                                                    <span className="company-name-modal">{suggestion.name}</span>
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
                            <label className="bordered-label">Status</label>
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
                            <label className="bordered-label">Choose a Status</label>
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

                    {/* Color Picker as an Input */}
                    <div className="input-wrapper" style={{ position: 'relative' }}>
                        <label className="bordered-label">Card Color</label>
                        {/* Color Box that shows the selected color */}
                        <div
                            className="color-selector-box"
                            style={{
                                backgroundColor: selectedColor,
                                width: '100%',
                                height: '40px',
                                cursor: 'pointer',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                marginTop: '20px',
                            }}
                            onClick={toggleColorPicker}
                        ></div>
                        {/* Conditionally render color picker */}
                        {isColorPickerOpen && (
                            <div className="color-picker-dropdown"
                                style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    zIndex: 1000,
                                    marginTop: '5px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                                }}
                            >
                                <Github color={selectedColor} onChange={handleColorChange} />
                            </div>
                        )}
                    </div>

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
