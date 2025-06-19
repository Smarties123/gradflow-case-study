// ./boardComponents/useDragAndDrop.tsx

import { useState, useContext } from 'react';
import { BoardContext } from '../BoardContext';
import { useUser } from '../../../components/User/UserContext';
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';

export const useDragAndDrop = (handleDeleteCard, setActiveId) => {
    const [isDraggingCard, setIsDraggingCard] = useState(false);
    const { user } = useUser();
    const context = useContext(BoardContext);
    const { columns, setColumns, onDragEnd } = context!;

    const onDragStart = (event: DragStartEvent) => {
        setIsDraggingCard(true);
        setActiveId(event.active.id);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        setIsDraggingCard(false);
        setActiveId(null);

        const { active, over } = event;

        if (!over) {
            return;
        }

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
            // Delegate the rest of the logic to onDragEnd in BoardContext
            await onDragEnd(event);

            // If a column was dragged, save the new order to the backend
            if (event.active.data?.current?.type === 'column') {
                if (!user) return;
                const columnOrder = columns.map(col => col.id);
                try {
                    await fetch(`${process.env.REACT_APP_API_URL}/api/users/columnorder`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${user.token}`,
                            'Content-Type': 'application/json',
                        },

                        body: JSON.stringify({ columnOrder }),
                    });

                } catch (error) {
                    console.error('Failed to save column order:', error);
                }
            }
        }
    };

    return { isDraggingCard, onDragStart, handleDragEnd };
};