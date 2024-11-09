// ./boardComponents/useDragAndDrop.tsx

import { useState, useContext } from 'react';
import { BoardContext } from '../BoardContext';
import { useUser } from '../../../components/User/UserContext';
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';

export const useDragAndDrop = (handleDeleteCard) => {
  const [isDraggingCard, setIsDraggingCard] = useState(false);
  const { user } = useUser();
  const context = useContext(BoardContext);
  const { columns, setColumns } = context!;

  const onDragStart = (event: DragStartEvent) => {
    setIsDraggingCard(true);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setIsDraggingCard(false);

    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (overId === 'bin') {
      // Handle deletion
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/applications/${activeId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });

        if (response.ok) {
          handleDeleteCard(Number(activeId));
        } else {
          console.error('Failed to delete the card.');
        }
      } catch (error) {
        console.error('Error deleting the card:', error);
      }
    } else {
      // Handle reordering
      const sourceColumn = columns.find(column =>
        column.cards.some(card => String(card.id) === String(activeId))
      );
      const destinationColumn = columns.find(column =>
        column.cards.some(card => String(card.id) === String(overId))
      );

      if (!sourceColumn || !destinationColumn) return;

      const activeCardIndex = sourceColumn.cards.findIndex(
        card => String(card.id) === String(activeId)
      );
      const overCardIndex = destinationColumn.cards.findIndex(
        card => String(card.id) === String(overId)
      );

      if (sourceColumn.id === destinationColumn.id) {
        // Move within the same column
        const updatedCards = [...sourceColumn.cards];
        updatedCards.splice(activeCardIndex, 1);
        updatedCards.splice(overCardIndex, 0, sourceColumn.cards[activeCardIndex]);

        const updatedColumns = columns.map(column =>
          column.id === sourceColumn.id ? { ...column, cards: updatedCards } : column
        );
        setColumns(updatedColumns);
      } else {
        // Move to a different column
        const sourceCards = [...sourceColumn.cards];
        const destinationCards = [...destinationColumn.cards];

        const [movedCard] = sourceCards.splice(activeCardIndex, 1);
        destinationCards.splice(overCardIndex, 0, movedCard);

        const updatedColumns = columns.map(column => {
          if (column.id === sourceColumn.id) {
            return { ...column, cards: sourceCards };
          } else if (column.id === destinationColumn.id) {
            return { ...column, cards: destinationCards };
          } else {
            return column;
          }
        });

        setColumns(updatedColumns);
      }
    }
  };

  return { isDraggingCard, onDragStart, handleDragEnd };
};
