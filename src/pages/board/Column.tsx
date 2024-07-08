import React from 'react';
import './Column.less';
import CardComponent from './CardComponent';
import { Droppable, Draggable } from 'react-beautiful-dnd';


const Column = ({ column, onAddButtonClick, columnIndex }) => {
    return (
        <Droppable droppableId={String(column.id)}>
            {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="column">
                    <h2>{column.title}</h2>
                    <button onClick={
                        onAddButtonClick(column)
                    }

                    >Add New </button>
                    {column.cards.map((card, index) => (
                        <Draggable key={card.id} draggableId={String(card.id)} index={index}>
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                    <CardComponent card={card} />
                                </div>
                            )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                </div>
            )
            }
        </Droppable >
    );
};
export default Column;
