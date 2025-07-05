import React, { useContext, useState, useEffect } from 'react';
import './Modal.less';
import { BoardContext } from '@/pages/board/BoardContext';
import { useUser } from '@/components/User/UserContext';
import { FormHelperText } from '@mui/material'; // Import FormHelperText from MUI
import dayjs from 'dayjs';
import Github from '@uiw/react-color-github';  // Import the color picker
import 'animate.css';
import { useTransition, animated } from 'react-spring'; // ✅ Import useTransition


const Modal = ({ isOpen, onClose, activeColumn, columns, theme }) => {
    const { addCardToColumn, updateCard } = useContext(BoardContext);
    const { user } = useUser();

    if (!isOpen) return null;

    const [modalVisible, setModalVisible] = useState(isOpen);
    const [company, setCompany] = useState('');
    const [position, setPosition] = useState('');
    const [deadline, setDeadline] = useState('');
    const [location, setLocation] = useState('');
    const [url, setUrl] = useState('');
    const [selectedColumn, setSelectedColumn] = useState(activeColumn ? activeColumn.id : columns[0]?.id);
    const [companyLogo, setCompanyLogo] = useState('');
    const [errors, setErrors] = useState({});
    const [companySuggestions, setCompanySuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestionSelected, setSuggestionSelected] = useState(false);
    const [selectedColor, setSelectedColor] = useState('');
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
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

    // useEffect(() => {
    //     const handleAnimationEnd = () => {
    //         if (animation === 'animate__animated animate__zoomOut') {
    //             onClose(); // Close the modal after the zoom out animation finishes
    //         }
    //     };

    //     // Add event listener for animation end
    //     const modalContent = document.querySelector('.modal-content');
    //     if (modalContent) {
    //         modalContent.addEventListener('animationend', handleAnimationEnd);
    //     }

    //     // Cleanup the event listener when the component unmounts
    //     return () => {
    //         if (modalContent) {
    //             modalContent.removeEventListener('animationend', handleAnimationEnd);
    //         }
    //     };
    // }, [animation, onClose]);

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

    // Handle the deadline change
    const handleDeadlineChange = (e) => {
        const selectedDate = e.target.value;
        setDeadline(selectedDate);

        // Validate if the selected date is in the past
        const selectedDay = dayjs(selectedDate);
        if (selectedDay.isBefore(dayjs(), 'day')) {
            setErrors(prevErrors => ({
                ...prevErrors,
                deadline: 'Deadline cannot be in the past',
            }));
        } else {
            setErrors(prevErrors => ({
                ...prevErrors,
                deadline: '',
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!company) newErrors.company = 'Company is required';
        if (!position) newErrors.position = 'Position is required';

        if (deadline && deadline !== '') {
            const selectedDate = dayjs(deadline);

            // Check if the date is valid
            if (!selectedDate.isValid()) {
                newErrors.deadline = 'Please enter a valid date';
            }


        }
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
                card_color: selectedColor,
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
                    const savedCard = await response.json();
                    console.log("Saved card data:", savedCard);

                    const newCardId = savedCard.job?.ApplicationId;
                    if (newCardId) {

                        addCardToColumn(activeColumn ? activeColumn.id : selectedColumn, { ...card, id: String(newCardId) });
                        handleClose();
                        // setModalVisible(false);
                        await fetchCardDetails(newCardId);  // Wait for background fetch
                    }
                } else {
                    console.error('Failed to add job');
                }
                // Close modal regardless of success or failure in adding job
                // setModalAnimation({ opacity: 0, transform: 'scale(0.8)' });
                // setTimeout(onClose, 200); // Delay the onClose handler to allow animation to complete
            } catch (err) {
                console.error('Error adding job:', err);
                // Close modal even if there's an error
                // setModalAnimation({ opacity: 0, transform: 'scale(0.8)' });
                handleClose();
            }
        }
    };

    // Fetch the full card details in the background and update it locally
    const fetchCardDetails = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/applications/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
            });

            if (response.ok) {
                const fullCardData = await response.json();
                console.log("Fetched full card data:", fullCardData);
                updateCard(id, fullCardData);
            } else {
                console.error('Failed to fetch the full card data');
            }
        } catch (error) {
            console.error('Error fetching card details:', error);
        }
    };


    const handleClose = () => {
        setModalVisible(false); // Trigger leave animation
        setTimeout(() => onClose(), 250); // Wait for animation to finish
    };



    const transitions = useTransition(modalVisible, {
        from: { opacity: 0, transform: "translateY(-40px)" },
        enter: { opacity: 1, transform: "translateY(0px)" },
        leave: { opacity: 0, transform: "translateY(-40px)" }
    });

    return transitions(
        (styles, item) =>
            item && (
                <div className="modal-overlay" onClick={handleClose}>
                    {/* ✅ Animated Modal Wrapper */}
                    <animated.div
                        style={styles}
                        className={`modal-content ${theme === 'dark' ? 'rs-theme-dark' : ''}`}
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
                    >
                        <h2>Add Job</h2>

                        <div className="input-wrapper">
                            <label className="bordered-label">Company<span className="required">*</span></label>
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
                            <label className="bordered-label">Position<span className="required">*</span></label>
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
                                onChange={handleDeadlineChange}
                                className="border-input"
                                placeholder="dd/mm/yyyy"
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
                            <div className="input-wrapper" style={{ marginBottom: '4vb', }}>
                                <label className="bordered-label">Choose a Status</label>
                                    <select
                                    value={selectedColumn}
                                    onChange={e => setSelectedColumn(parseInt(e.target.value))}
                                    className="border-input dropdown-input"
                                    >
                                    {columns.map(col => (
                                        <option
                                        key={col.id}
                                        value={col.id}
                                        style={{
                                            backgroundColor: theme === 'dark' ? '#333' : '#fff',
                                            color:            theme === 'dark' ? '#fff' : '#000',
                                        }}
                                        >
                                        {col.title}
                                        </option>
                                    ))}
                                    </select>

                            </div>
                        )}

                        {/* Color Picker as an Input */}
                        <div className="input-wrapper">
                            <label style={{ backgroundColor: 'transparent', top: '-20px' }} className="bordered-label">Card Color</label>
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
                            <button type="button" className="cancel-button" onClick={handleClose}>
                                Cancel
                            </button>
                            <button onClick={handleSubmit} className="add-card-button">
                                Save
                            </button>
                        </div>

                    </animated.div>
                </div>
            )
    );
};

export default Modal;
