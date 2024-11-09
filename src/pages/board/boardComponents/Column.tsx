// ./boardComponents/Column.tsx

import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
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
}) => {
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
      <AwesomeButton
        className='addNew'
        onClick={() => handleAddButtonClick(column)}>
        <span>Add New</span>
      </AwesomeButton>

      <Droppable droppableId={String(column.id)}>
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="droppable-area">
            {column.cards.map((card, index) => (
              <Draggable key={card.id} draggableId={String(card.id)} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <CardComponent
                      card={card}
                      onSelect={handleCardSelect}
                      user={user}
                      onFavoriteToggle={handleFavoriteToggle}
                      provided={provided}
                      snapshot={snapshot}
                      onDelete={handleDeleteCard}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default ColumnComponent;
