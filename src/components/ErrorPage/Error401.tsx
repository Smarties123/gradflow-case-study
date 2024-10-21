import React from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import './Error401.less'; // Custom styles if needed

const Error401 = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleBackToLogin = () => {
    navigate('/signin'); // Navigate to the login page
  };

  return (
    <div className="error-container">
      <div className="error-content">
        <h1 className="error-code">401</h1>
        <p className="error-message">Unauthorized Access</p>
        <button onClick={handleBackToLogin} className="btn-back-login">
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default Error401;
