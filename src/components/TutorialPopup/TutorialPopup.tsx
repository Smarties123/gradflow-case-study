import React, { useState } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { MdEdit, MdInfo } from 'react-icons/md';
import { FaFileExcel, FaPlay, FaLock } from 'react-icons/fa';
import './TutorialPopup.less';

interface TutorialPopupProps {
    onClose: () => void;
}

const TutorialPopup: React.FC<TutorialPopupProps> = ({ onClose }) => {
    const [step, setStep] = useState(0); // 0 for welcome, 1-3 for tutorial steps
    const [mode, setMode] = useState(''); // 'excel' or 'start'

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        }
    };

    const handlePrev = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleClose = () => {
        setStep(0);
        setMode('');
        onClose();
    };

    const handleModeSelect = (selectedMode) => {
        if (selectedMode === 'excel') return; // Prevent selection of Excel mode
        setMode(selectedMode);
        setStep(1);
    };

    const steps = [
        {
            icon: <IoMdAdd className="tutorial-icon" />,
            title: "Add New Applications",
            description: "Click the 'Add New' button to create a new job application card. Fill in the company name, position, and other details to get started."
        },
        {
            icon: <MdEdit className="tutorial-icon" />,
            title: "Manage Your Applications",
            description: "Organize your applications by dragging cards between columns. Update status, add notes, and track your progress through the hiring process."
        },
        {
            icon: <MdInfo className="tutorial-icon" />,
            title: "View Details",
            description: "Click on any card to view and edit detailed information. Add documents, update status, and keep track of important dates and notes."
        }
    ];

    if (step === 0) {
        return (
            <div className="popup-overlay">
                <div className="popup-content welcome-content">
                    <h1>Welcome to GradFlow</h1>
                    <p className="welcome-subtitle">Choose how you'd like to get started</p>

                    <div className="welcome-options">
                        <div className="welcome-option coming-soon">
                            <div className="coming-soon-badge">
                                <FaLock className="lock-icon" />
                                <span>Coming Soon</span>
                            </div>
                            <FaFileExcel className="welcome-icon" />
                            <h3>Excel To Flow</h3>
                            <p>Import your existing job applications from Excel</p>
                        </div>

                        <div className="welcome-option" onClick={() => handleModeSelect('start')}>
                            <FaPlay className="welcome-icon" />
                            <h3>Start to Continue</h3>
                            <p>Begin managing your applications from scratch</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <div className="tutorial-step">
                    {steps[step - 1].icon}
                    <h2>{steps[step - 1].title}</h2>
                    <p>{steps[step - 1].description}</p>
                </div>

                <div className="step-indicator">
                    {[1, 2, 3].map((num) => (
                        <div
                            key={num}
                            className={`step-dot ${num === step ? 'active' : ''}`}
                        />
                    ))}
                </div>

                <div className="popup-footer">
                    <button
                        className="nav-button prev-button"
                        onClick={handlePrev}
                        disabled={step === 1}
                    >
                        Previous
                    </button>
                    {step < 3 ? (
                        <button
                            className="nav-button next-button"
                            onClick={handleNext}
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            className="nav-button finish-button"
                            onClick={handleClose}
                        >
                            Get Started
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TutorialPopup;
