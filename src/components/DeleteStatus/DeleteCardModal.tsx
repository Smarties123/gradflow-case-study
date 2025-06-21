import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './DeleteCardModal.less';            // you can rename & tweak this .less
import { useTransition, animated } from 'react-spring';

const STANDARD_REASONS = [
  'Rejected by company',
  'Position filled',
  'Found another role',
  'No response from company',
  'Other',
];

const DeleteCardModal = ({ isOpen, onClose, onYes, title }) => {
  const [selected, setSelected] = useState('');
  const [otherText, setOtherText] = useState('');

  // reset when opened
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
    const reason = selected === 'Other' ? otherText.trim() : selected;
    onYes(reason);
    onClose();
  };

  const disableDelete =
    !selected || (selected === 'Other' && otherText.trim().length === 0);

  return transitions(
    (styles, item) =>
      item && (
        <div className="ds-overlay" onClick={onClose}>
          <animated.div
            style={styles}
            className="ds-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="ds-title">{title}</h2>

            <div className="ds-reasons">
              {STANDARD_REASONS.map((r) => (
                <label key={r} className="ds-reason">
                  <input
                    type="radio"
                    name="deleteReason"
                    value={r}
                    checked={selected === r}
                    onChange={() => setSelected(r)}
                  />
                  {r}
                </label>
              ))}

              {selected === 'Other' && (
                <textarea
                  className="ds-other-input"
                  placeholder="Type your reason..."
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                  rows={3}
                />
              )}
            </div>

            <div className="ds-buttons">
              <button className="ds-btn ds-cancel" onClick={onClose}>
                Cancel
              </button>
              <button
                className="ds-btn ds-delete"
                onClick={handleDelete}
                disabled={disableDelete}
              >
                Delete
              </button>
            </div>
          </animated.div>
        </div>
      )
  );
};

DeleteCardModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onYes: PropTypes.func.isRequired,   // receives `reason: string`
  title: PropTypes.string.isRequired,
};

export default DeleteCardModal;
