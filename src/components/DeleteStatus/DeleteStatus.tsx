import React from 'react';
import PropTypes from 'prop-types';
import '../Modal/Modal.less';
import { useTransition, animated } from 'react-spring';

const DeleteModal = ({ isOpen, onClose, onYes, onNo, title }) => {
  const transitions = useTransition(isOpen, {
    from: { opacity: 0, transform: 'translateY(-40px)' },
    enter: { opacity: 1, transform: 'translateY(0px)' },
    leave: { opacity: 0, transform: 'translateY(-40px)' },
    config: { tension: 300, friction: 20 },
  });

  const handleDelete = () => {
    onYes();
    onClose();
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    onNo();
    onClose();
  };

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
            <div className="modal-buttons">
              <button type="button" className="cancel-button" onClick={handleCancel}>
                Cancel
              </button>
              <button
                type="button"
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
  onYes: PropTypes.func.isRequired,
  onNo: PropTypes.func.isRequired,
  title: PropTypes.string,
};

export default DeleteModal;
