import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../Modal/Modal.less';
import { useTransition, animated } from 'react-spring';

// This will be shown if showCardReasons
const CARD_REASONS = [
  'Rejected by company',
  'Position filled',
  'Found another role',
  'No response from company',
  'Other',
];

// This will be shown if showAccountReasons
const ACCOUNT_REASONS = [
  'Rejected by company',
  'Position filled',
  'Found another role',
  'No response from company',
  'Other',
];

const DeleteModal = ({ isOpen, onClose, onYes, onNo, title, showCardReasons, showAccountReasons }) => {
  const [selected, setSelected] = useState('');
  const [otherText, setOtherText] = useState('');

  // Reset whenever opened
  useEffect(() => {
    if (isOpen) {
      setSelected('');
      setOtherText('');
    }
  }, [isOpen]);

  const transitions = useTransition(isOpen, {
    from: { opacity: 0, transform: 'translateY(-40px)' },
    enter: { opacity: 1, transform: 'translateY(0px)' },
    leave: { opacity: 0, transform: 'translateY(-40px)' },
    config: { tension: 300, friction: 20 },
  });

  const handleDelete = () => {
    let reason = '';

    if (selected === 'Other' && otherText.trim().length > 0) {
      reason = otherText.trim();
    } else if (selected) {
      reason = selected;
    } else {
      reason = 'No reason provided'; // Or use an empty string: ''
    }

    onYes(reason);
    onClose();
  };


  const handleCancel = (e) => {
    e.stopPropagation();
    onClose();
  };


  // Choose the appropriate list of reasons to show
  const reasonOptions = showCardReasons ? CARD_REASONS : showAccountReasons ? ACCOUNT_REASONS : [];

  return transitions(
    (styles, item) =>
      item && (
        <div className="modal-overlay" onClick={onClose}>
          <animated.div
            style={styles}
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{title || 'Are You Sure?'}</h2>

            {/* Reason behind Delete a Card or Account */}
            {reasonOptions.length > 0 && (
              <div className="input-wrapper" style={{ marginTop: '1vb', marginBottom: '2vb' }}>
                <select
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                  className="border-input dropdown-input"
                >
                  <option value="" hidden>
                    Select a Reason
                  </option>
                  {reasonOptions.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>

              </div>
            )}

            <div className="modal-buttons">
              <button className="cancel-button" onClick={handleCancel}>
                Cancel
              </button>
              <button
                className="delete-button"
                style={{ backgroundColor: '#FF6200' }}
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </animated.div>
        </div>
      )
  );
};

DeleteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onYes: PropTypes.func.isRequired,      // now receives the reason string
  onNo: PropTypes.func.isRequired,
  title: PropTypes.string,
  showCardReasons: PropTypes.bool,
  showAccountReasons: PropTypes.bool,
};

export default DeleteModal;
