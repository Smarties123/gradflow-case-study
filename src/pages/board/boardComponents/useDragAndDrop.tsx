// ./boardComponents/useDragAndDrop.ts

import { useState, useContext } from 'react';
import { BoardContext } from '../BoardContext';
import { useScroll } from './useScroll';
import { useUser } from '../../../components/User/UserContext';

export const useDragAndDrop = (handleDeleteCard) => {
  const [isDraggingCard, setIsDraggingCard] = useState(false);
  const { handleScroll, stopScrolling } = useScroll(isDraggingCard);
  const { user } = useUser();
  const context = useContext(BoardContext);

  const onDragStart = () => {
    setIsDraggingCard(true);
    window.addEventListener('mousemove', handleScroll);
  };

  const handleDragEnd = async (result) => {
    stopScrolling();
    window.removeEventListener('mousemove', handleScroll);
    setIsDraggingCard(false);

    if (!result.destination) {
      return;
    }

    const binDropped = result.destination.droppableId === 'bin';

    if (binDropped) {
      const cardId = result.draggableId;

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/applications/${cardId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });

        if (response.ok) {
          handleDeleteCard(Number(cardId));
        } else {
          console.error('Failed to delete the card.');
        }
      } catch (error) {
        console.error('Error deleting the card:', error);
      }
    } else {
      context.onDragEnd(result);
    }
  };

  return { isDraggingCard, onDragStart, handleDragEnd };
};
