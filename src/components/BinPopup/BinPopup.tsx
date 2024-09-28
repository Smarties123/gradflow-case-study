// BinPopup.tsx
import React from 'react';
import { IoMdTrash } from 'react-icons/io';
import './BinPopup.less';

const BinPopup = ({ isDragging }) => {
  return (
    <div className={`bin-popup ${isDragging ? 'show' : ''}`}>
      <IoMdTrash className="trash-icon" />
    </div>
  );
};

export default BinPopup;
