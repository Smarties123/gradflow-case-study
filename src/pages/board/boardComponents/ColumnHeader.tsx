// ./boardComponents/ColumnHeader.tsx

import React, { useRef, useEffect } from 'react';
import { IoMdMore, IoMdTrash, IoMdCreate } from "react-icons/io";
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
      inputRef.current.select();
    }
  }, [editingColumnId, column.id]);

  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleIconClick(column.id, column.title);
    if (showDropdown === column.id) {
      handleDropdownClick(column.id);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleDeleteColumnModal(column.id);
  };

  return (
    <div className={`column-header ${editingColumnId === column.id ? 'editing' : ''}`}>
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
              maxLength={10}
              style={{ fontSize: 'inherit' }}
            />
          </div>
        ) : (
          <div className="column-title" onClick={handleTitleClick}>
            <h2>{column.title}</h2>
          </div>
        )}
      </div>

      {editingColumnId !== column.id && (
        <button
          className="icon-button"
          onClick={(e) => {
            e.stopPropagation();
            handleDropdownClick(column.id);
          }}
        >
          <IoMdMore />
        </button>
      )}

      {showDropdown === column.id && (
        <div className="dropdown">
          <ul>
            <li onClick={handleTitleClick}>
              <IoMdCreate /> Edit Title
            </li>
            <li onClick={handleDeleteClick}>
              <IoMdTrash /> Delete Status
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ColumnHeader;
