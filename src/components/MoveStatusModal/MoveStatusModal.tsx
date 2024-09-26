import React, { useState, useEffect, useRef } from 'react';
import './MoveStatusModal.less'; // CSS styles for the modal

interface MoveStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentOrder: number;
  totalColumns: number;
  onMove: (newPosition: number) => void;
  columnNames: string[]; // Add column names as a new prop
}

// Function to capitalize the first letter and make the rest lowercase
const capitalizeFirstLetter = (str: string) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const MoveStatusModal: React.FC<MoveStatusModalProps> = ({
  isOpen,
  onClose,
  currentOrder,
  totalColumns,
  onMove,
  columnNames
}) => {
  const [newPosition, setNewPosition] = useState(currentOrder);
  const modalRef = useRef<HTMLDivElement>(null); // Create a reference for the modal

  // Close modal if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose(); // Close modal when clicking outside
      }
    };

    // Add event listener to detect clicks outside the modal
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up event listener when component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (!isOpen) {
    return null;
  }

  const handleMove = () => {
    if (newPosition !== currentOrder) {
      onMove(newPosition);
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef} onClick={e => e.stopPropagation()}>
        <h2>Move Column</h2>
        <div className="input-wrapper" id='input-wrapper'>
          <label className="bordered-label">Swap Column</label>
          <select
            className="border-input dropdown-input"
            value={newPosition}
            onChange={e => setNewPosition(Number(e.target.value))}
          >
            {Array.from({ length: totalColumns }, (_, i) => i + 1).map(pos => (
              <option key={pos} value={pos}>
                Position {pos} ({capitalizeFirstLetter(columnNames[pos - 1])}){' '}
                {pos === currentOrder ? '(Current)' : ''}
              </option>
            ))}
          </select>
        </div>
        <div className="modal-buttons">
          <button className="cancel-button" onClick={onClose}>
            Discard
          </button>
          <button className="add-card-button" onClick={handleMove}>
            Move
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoveStatusModal;
