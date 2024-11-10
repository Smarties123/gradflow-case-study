// ColumnComponent.tsx

import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';

import ColumnHeader from './ColumnHeader';
import AwesomeButton from '../../../components/AwesomeButton/AwesomeButton';
import CardComponent from '../../../components/CardComponent/CardComponent';
import { Column, Card } from '../types';

type ColumnProps = {
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
  handleAddButtonClick: (column: Column) => void;
  handleCardSelect: (card: Card) => void;
  user: any;
  handleFavoriteToggle: (updatedCard: any) => void;
  handleDeleteCard: (cardId: number) => void;
  isDraggingCard: boolean;
  activeId: string | null; // **Add this prop**

};

const ColumnComponent: React.FC<ColumnProps> = ({
  column,
  editingColumnId,
  newTitle,
  showDropdown,
  handleIconClick,
  handleDropdownClick,
  handleTitleChange,
  handleTitleBlur,
  handleTitleKeyPress,
  handleDropdownOptionSelect,
  handleAddButtonClick,
  handleCardSelect,
  user,
  handleFavoriteToggle,
  handleDeleteCard,
  isDraggingCard,
  activeId, // **Destructure activeId**

}) => {
  // Make the column droppable using useDroppable
  const { setNodeRef } = useDroppable({
    id: String(column.id),
  });

  return (
    <div className="column-container">
      <ColumnHeader
        column={column}
        editingColumnId={editingColumnId}
        newTitle={newTitle}
        showDropdown={showDropdown}
        handleIconClick={handleIconClick}
        handleDropdownClick={handleDropdownClick}
        handleTitleChange={handleTitleChange}
        handleTitleBlur={handleTitleBlur}
        handleTitleKeyPress={handleTitleKeyPress}
        handleDropdownOptionSelect={handleDropdownOptionSelect}
      />
      <AwesomeButton className="addNew" onClick={() => handleAddButtonClick(column)}>
        <span>Add New</span>
      </AwesomeButton>

      {/* Wrap the droppable area and cards in SortableContext */}
      <div ref={setNodeRef} className="droppable-area">
        <SortableContext
          items={column.cards.map((card) => String(card.id))}
          strategy={verticalListSortingStrategy}
        >
          {column.cards.map((card) => (
            <CardComponent
              key={card.id}
              card={card}
              onSelect={handleCardSelect}
              user={user}
              onFavoriteToggle={handleFavoriteToggle}
              onDelete={handleDeleteCard}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default ColumnComponent;

