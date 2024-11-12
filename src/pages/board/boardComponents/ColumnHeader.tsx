// ./boardComponents/ColumnHeader.tsx

import React, { useRef, useEffect } from 'react';
import { IoMdMore, IoMdTrash } from "react-icons/io";
import { Column } from '../types';

type ColumnHeaderProps = {
  column: Column;
  editingColumnId: number | null;
  newTitle: string;
  showDropdown: number | null;
  handleIconClick: (columnId: number, title: string) => void;
  handleDropdownClick: (columnId: number) => void;
  handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTitleBlur: () => void;
  handleTitleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleDropdownOptionSelect: (option: number, columnId: number) => void;
  handleDeleteColumnModal: (columnId: number) => void;
};

const ColumnHeader: React.FC<ColumnHeaderProps> = ({
  column,
  editingColumnId,
  newTitle,
  showDropdown,
  handleIconClick,
  handleDropdownClick,
  handleTitleChange,
  handleTitleBlur,
  handleTitleKeyPress,
  handleDeleteColumnModal
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingColumnId === column.id && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingColumnId, column.id]);

  return (
    <div style={{ maxWidth: '100%' }} className={`column-header ${editingColumnId === column.id ? 'editing' : ''}`}>
      {editingColumnId !== column.id && (
        <p className="column-counter">{column.cards.length}</p>
      )}

      <div className="column-header-content">
        {editingColumnId === column.id ? (
          <div className='column-title-input'>
            <input
              ref={inputRef}
              type="text"
              value={newTitle}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              onKeyPress={handleTitleKeyPress}
              autoFocus
              maxLength={10}
              className='input-group'
              style={{ fontSize: 'inherit' }}
            />
          </div>
        ) : (
          <div className="column-title" onClick={() => handleIconClick(column.id, column.title)}>
            <h2>{column.title}</h2>
          </div>
        )}
      </div>
      {editingColumnId !== column.id && (
        <button
          className="icon-button"
          onClick={() => handleDropdownClick(column.id)}
        >
          <IoMdMore />
        </button>
      )}
      {showDropdown === column.id && (
        <div className="dropdown">
          <ul>
            {column.cards.length === 0 && (
              <li onClick={() => handleDeleteColumnModal(column.id)}>
                <IoMdTrash /> Delete Status
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ColumnHeader;
