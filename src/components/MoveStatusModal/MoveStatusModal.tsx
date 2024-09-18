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
    <div className="move-status-modal-overlay">
      <div className="move-status-modal">
        <h2>Move List</h2>
        <label htmlFor="position">Position</label>
        <select
          id="position"
          value={newPosition}
          onChange={(e) => setNewPosition(Number(e.target.value))}
        >
          {Array.from({ length: totalColumns }, (_, i) => i + 1).map((pos) => (
            <option key={pos} value={pos}>
              Position {pos} {pos === currentOrder ? '(Current)' : ''}
            </option>
          ))}
        </select>
        <div className="move-status-modal-actions">
          <button className="discard-btn" onClick={onClose}>Discard</button>
          <button className="move-btn" onClick={handleMove}>Move</button>
        </div>
      </div>
    </div>
  );
};

export default MoveStatusModal;
