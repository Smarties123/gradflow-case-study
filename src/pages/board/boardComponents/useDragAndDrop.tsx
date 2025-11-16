// ./boardComponents/useDragAndDrop.tsx

import { useState, useContext } from 'react';
import { BoardContext } from '../BoardContext';
import { useUser } from '../../../components/User/UserContext';
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';

export const useDragAndDrop = (handleDeleteCard, setActiveId) => {
    const [isDraggingCard, setIsDraggingCard] = useState(false);
    const { user } = useUser();
    const context = useContext(BoardContext);
    const { columns, setColumns, onDragEnd, columnOrder, setColumnOrder } = context!;

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
            // In demo mode, just delete locally
            handleDeleteCard(Number(activeId));
        } else {
            // Delegate the rest of the logic to onDragEnd in BoardContext

            // If a column was dragged, update local state only
            if (event.active.data?.current?.type === 'column') {
                if (!event.over) return;
                // Compute the new column order based on the drag event
                const activeId = Number(event.active.id);
                const overId = Number(event.over.id);
                const oldIndex = columns.findIndex(col => col.id === activeId);
                const newIndex = columns.findIndex(col => col.id === overId);
                if (oldIndex !== -1 && newIndex !== -1) {
                    const newColumns = [...columns];
                    const [movedColumn] = newColumns.splice(oldIndex, 1);
                    newColumns.splice(newIndex, 0, movedColumn);
                    const newColumnOrder = newColumns.map(col => col.id);
                    setColumns(newColumns);
                    setColumnOrder(newColumnOrder);
                    // In demo mode, no backend save needed
                }
            }
            await onDragEnd(event);

        }
    };

    return { isDraggingCard, onDragStart, handleDragEnd };
};