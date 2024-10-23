import React, { useState } from 'react';
import './TutorialPopup.less';

const TutorialPopup = () => {
    const [step, setStep] = useState(1);

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1); // Move to the next step
        }
    };

    const handlePrev = () => {
        if (step > 1) {
            setStep(step - 1); // Move to the previous step
        }
    };

    const handleClose = () => {
        setStep(0); // Close the popup when clicked
    };

    return (
        step > 0 && (
            <div className="popup-overlay">
                <div className="popup-content">
                    {step === 1 && (
                        <div>
                            <h2>Step 1</h2>
                            <p>Click on the "Add New" button to add a new job application card.</p>
                        </div>
                    )}
                    {step === 2 && (
                        <div>
                            <h2>Step 2</h2>
                            <p>Fill in the basic details of the card for the new job application.</p>
                        </div>
                    )}
                    {step === 3 && (
                        <div>
                            <h2>Step 3</h2>
                            <p>Click on a created card to view further details about the job application.</p>
                        </div>
                    )}

                    <div className="popup-footer">
                        <button onClick={handlePrev} disabled={step === 1}>
                            Previous
                        </button>
                        {step < 3 && <button onClick={handleNext}>Next</button>}
                        {step === 3 && <button id="finish" onClick={handleClose}>Finish</button>}
                    </div>
                </div>
            </div>
        )
    );
};

export default TutorialPopup;
