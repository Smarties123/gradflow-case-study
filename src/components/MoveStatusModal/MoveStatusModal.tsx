import React, { useState } from 'react';
import './MoveStatusModal.less'; // CSS styles for the modal

interface MoveStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentOrder: number;
  totalColumns: number;
  onMove: (newPosition: number) => void;
}

const MoveStatusModal: React.FC<MoveStatusModalProps> = ({ isOpen, onClose, currentOrder, totalColumns, onMove }) => {
  const [newPosition, setNewPosition] = useState(currentOrder);

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
      <div className={`modal-content`} onClick={(e) => e.stopPropagation()}>
        <h2>Move Column</h2>
        <div className="input-wrapper">
          <label className="bordered-label">Swap Column</label>
          <select
            className="border-input dropdown-input"
            value={newPosition}
            onChange={(e) => setNewPosition(Number(e.target.value))}
          >
            {Array.from({ length: totalColumns }, (_, i) => i + 1).map((pos) => (
              <option key={pos} value={pos}>
                Position {pos} {pos === currentOrder ? '(Current)' : ''}
              </option>
            ))}
          </select>
        </div>
        <div className="modal-buttons">
          <button className="cancel-button" onClick={onClose}>Discard</button>
          <button className="add-card-button" onClick={handleMove}>Move</button>
        </div>
      </div>
    </div>
  );
};

export default MoveStatusModal;
