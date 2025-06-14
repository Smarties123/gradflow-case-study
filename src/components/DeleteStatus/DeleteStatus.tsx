import React, { useState } from 'react';
import './DeleteStatus.less';

interface DeleteStatusProps {
  isOpen: boolean;
  onClose: () => void;
  onNo: () => void;
  onYes: () => void;
  title: string;
  showDropdown?: boolean;
}

const DeleteStatus: React.FC<DeleteStatusProps> = ({
  isOpen,
  onClose,
  onNo,
  onYes,
  title,
  showDropdown = false,
}) => {
  const [deleteReason, setDeleteReason] = useState('');

  const deleteReasons = [
    'Not interested in the role',
    'Company not a good fit',
    'Salary expectations not met',
    'Location not suitable',
    'Found another opportunity',
    'Other'
  ];

  const handleSubmit = async () => {
    if (showDropdown && !deleteReason) {
      alert('Please select a reason for deletion');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deleteReason,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit delete reason');
      }

      onYes();
    } catch (error) {
      console.error('Error submitting delete reason:', error);
      onYes(); // Still proceed with deletion even if submission fails
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        {showDropdown && (
          <div className="delete-reason-dropdown">
            <label>Please select a reason for deletion:</label>
            <select
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              required
            >
              <option value="">Select a reason</option>
              {deleteReasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="modal-buttons">
          <button className="cancel-button" onClick={onNo}>
            No
          </button>
          <button className="delete-button" onClick={handleSubmit}>
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteStatus;
