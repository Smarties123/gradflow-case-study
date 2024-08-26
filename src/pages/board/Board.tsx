import React, { useContext, useRef, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Modal from '../../components/Modal/Modal';
import CardComponent from '../../components/CardComponent/CardComponent';
import './Board.less';
import DrawerView from '../../components/DrawerView/DrawerView';
import { CiEdit } from "react-icons/ci";
import { BoardContext } from './BoardContext';
import FeedbackButton from '../../components/LandingPage/FeedbackButton';

const Board = () => {
  const context = useContext(BoardContext);

  if (!context) {
    console.error('BoardContext is undefined. Ensure BoardProvider is correctly wrapping the component.');
  }

  const { columns, setColumns, updateCard, onDragEnd } = context;

  if (!columns) {
    console.error('Columns are not defined in context.');
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeColumn, setActiveColumn] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [editingColumnId, setEditingColumnId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState<string>('');

  const ref = useRef(null);

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

  const handleCardSelect = (card) => {
    const column = columns.find(col => col.cards.some(c => c.id === card.id));
    const columnName = column ? column.title : 'Unknown Column';
    setSelectedCard({ ...card, columnName });
    setIsDrawerOpen(true);
  };

  const handleAddButtonClick = (column) => {
    setActiveColumn(column);
    setIsModalOpen(true);
  };

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board">
          {columns.length === 0 ? (
            <p>No columns available</p>
          ) : (
            columns.map(column => (
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
            ))
          )}
          {isModalOpen && activeColumn && (
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              columns={columns}
              activeColumn={activeColumn}
            />
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


      <FeedbackButton />
    </div>
  );
};

export default Board;
