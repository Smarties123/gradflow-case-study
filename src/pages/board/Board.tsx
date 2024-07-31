import React, { useRef, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Column as ColumnType, Card } from './types';
import Modal from './Modal';
import CardComponent from './CardComponent';
import './Board.less';
import DrawerView from './DrawerView';
import { FaCog } from 'react-icons/fa';
import { CiEdit } from "react-icons/ci";





const initialColumns: ColumnType[] = [
  { id: 1, title: 'Applied', cards: [] },
  { id: 2, title: 'Assessment', cards: [] },
  { id: 3, title: 'Rejected', cards: [] },
  { id: 4, title: 'Accepted', cards: [] }
];

const Board = () => {
  const [columns, setColumns] = useState(initialColumns);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const [editingColumnId, setEditingColumnId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState<string>('');

  const handleIconClick = (columnId: number, title: string) => {

    setEditingColumnId(columnId);
    setNewTitle(title);

  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    if (editingColumnId !== null) {
      if (newTitle.trim() === '') {
        // If the new title is empty or just whitespace, do not update
        setEditingColumnId(null);
        return;
      }

      setColumns(prev =>
        prev.map(col =>
          col.id === editingColumnId ? { ...col, title: newTitle } : col
        )
      );
      setEditingColumnId(null);
    }
  };

  const handleTitleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleBlur();
    }
  };

  const ref = useRef(null);





  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return; // Dropped outside the list

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return; // Dropped in the same place
    }

    const start = columns.find(col => col.id === parseInt(source.droppableId));
    const finish = columns.find(col => col.id === parseInt(destination.droppableId));
    if (!start || !finish) return;

    const startCards = Array.from(start.cards);
    const [movedCard] = startCards.splice(source.index, 1);

    if (start === finish) {
      startCards.splice(destination.index, 0, movedCard);
      const newColumn = { ...start, cards: startCards };
      setColumns(prev => prev.map(col => col.id === newColumn.id ? newColumn : col));
    } else {
      const finishCards = Array.from(finish.cards);
      finishCards.splice(destination.index, 0, movedCard);
      const newStart = { ...start, cards: startCards };
      const newFinish = { ...finish, cards: finishCards };

      const updatedMovedCard = { ...movedCard, columnId: finish.id };

      setColumns(prev => {
        const updatedColumns = prev.map(col => {
          if (col.id === newStart.id) return newStart;
          if (col.id === newFinish.id) return {
            ...newFinish,
            cards: newFinish.cards.map(card => card.id === movedCard.id ? updatedMovedCard : card)
          };
          return col;
        });

        // Print columns when a card has been moved to a different column
        // console.log('Columns after moving card:', updatedColumns);

        return updatedColumns;
      });

    }
  };

  const handleCardSelect = (card) => {
    const column = columns.find(col => col.cards.some(c => c.id === card.id));
    const columnName = column ? column.title : 'Unknown Column';  // Fallback if not found

    setSelectedCard({ ...card, columnName });
    setIsDrawerOpen(true);
  };

  const handleAddButtonClick = (column: ColumnType) => {
    setActiveColumn(column);
    setIsModalOpen(true);
  };

  const addCardToColumn = (columnId: number, card: Card) => {
    const updatedColumns = columns.map(col => {
      if (col.id === columnId) {
        return { ...col, cards: [...col.cards, { ...card, id: Date.now() }] };
      }
      return col;
    });
    setColumns(updatedColumns);
  };

  const updateCard = (id, updatedData) => {
    const updatedColumns = columns.map(col => {
      const updatedCards = col.cards.map(card => card.id === id ? { ...card, ...updatedData } : card);
      return { ...col, cards: updatedCards };
    });
    setColumns(updatedColumns);
  };


  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="board">
        {columns.map(column => (
          <div key={column.id} className="column-container">
            <div style={{ maxWidth: '100%' }} className={`column-header ${editingColumnId === column.id ? 'editing' : ''}`}>
              {editingColumnId !== column.id && (
                <p className="column-counter">{column.cards.length}</p>
              )}

              <div className="column-header-content">


                {editingColumnId === column.id ? (

                  <div className='column-title-input'>
                    <input
                      ref={ref}
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
                  <div className="column-title">
                    <h2>{column.title}</h2>
                  </div>
                )}
                {/* <button
                className="icon-button"
                onClick={() => handleIconClick(column.id, column.title)}
              >
                <CiEdit />
              </button> */}

              </div>
              {editingColumnId !== column.id && (
                <button
                  className="icon-button"
                  onClick={() => handleIconClick(column.id, column.title)}
                >
                  <CiEdit />
                </button>
              )}

            </div>
            <button onClick={() => handleAddButtonClick(column)}>Add New</button>
            <Droppable droppableId={String(column.id)}>
              {provided => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="droppable-area">

                  {column.cards.map((card, index) => (
                    <Draggable key={card.id} draggableId={String(card.id)} index={index}>
                      {provided => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <CardComponent card={card} onSelect={handleCardSelect} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
        {isModalOpen && activeColumn && (
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} column={activeColumn} addCardToColumn={addCardToColumn} />
        )}
        {isDrawerOpen && selectedCard && (
          <DrawerView
            show={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            card={selectedCard}
            updateCard={updateCard}
            columnName={selectedCard.columnName}
          />
        )}
      </div>
    </DragDropContext>
  );
};

export default Board;
