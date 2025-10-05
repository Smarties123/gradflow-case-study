// ColumnComponent.tsx

import React from 'react';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

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
  handleDeleteColumnModal: (columnId: number) => void;
  isDraggingCard: boolean;
  activeId: string | null;
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
  handleDeleteColumnModal,
  isDraggingCard,
  activeId,
}) => {
  // Make the column sortable using useSortable
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: String(column.id),
    data: {
      type: 'column',
      column,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Make the cards area droppable
  const { setNodeRef: setCardsRef } = useDroppable({
    id: String(column.id),
  });

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`column-container ${isDragging ? 'dragging' : ''}`}
    >
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
        handleDeleteColumnModal={handleDeleteColumnModal}
        handleDropdownOptionSelect={handleDropdownOptionSelect}
      />

      <div className="column-drag-area" {...attributes} {...listeners}>
        <div className="column-header-drag-handle" />
      </div>

      <AwesomeButton className="addNew" onClick={() => handleAddButtonClick(column)}>
        <span>Add New</span>
      </AwesomeButton>

      <div ref={setCardsRef} className="droppable-area">
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

