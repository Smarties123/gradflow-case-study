import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Column, Card } from './types';
import { useUser } from '@/components/User/UserContext';
import { DragEndEvent } from '@dnd-kit/core';

interface BoardContextType {
    columns: Column[];
    setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
    addCardToColumn: (columnId: number, card: Card) => void;
    updateCard: (id: string, updatedData: Partial<Card>) => void;
    onDragEnd: (event: DragEndEvent) => void;
    updateStatusLocally: (cardId: string, newStatusId: number) => void;
    filterBoard: (searchResults: any[]) => void;
}

// Create the context
export const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const BoardProvider: React.FC<{ children: ReactNode; user: any }> = ({ children, user }) => {
    const [columns, setColumns] = useState<Column[]>([]);

    const addCardToColumn = (columnId: number, card: Card) => {
        setColumns(prevColumns =>
            prevColumns.map(col =>
                col.id === columnId
                    ? { ...col, cards: [...col.cards, card] }
                    : col
            )
        );
    };

    const updateCard = (id: string, updatedData: Partial<Card>) => {
        setColumns(prevColumns =>
            prevColumns.map(col => {
                const updatedCards = col.cards.map(card =>
                    card.id === id ? { ...card, ...updatedData } : card
                );
                return { ...col, cards: updatedCards };
            })
        );
    };

    const updateStatusLocally = (cardId: string, newStatusId: number) => {
        setColumns(prevColumns => {
            let movedCard: Card | null = null;

            // Remove the card from the old column
            const updatedColumns = prevColumns.map(column => {
                if (column.cards.some(card => card.id === cardId)) {
                    movedCard = column.cards.find(card => card.id === cardId) || null;
                    return { ...column, cards: column.cards.filter(card => card.id !== cardId) };
                }
                return column;
            });

            if (!movedCard) return prevColumns;

            // Add the card to the new column
            return updatedColumns.map(column => {
                if (column.id === newStatusId) {
                    return { ...column, cards: [...column.cards, movedCard as Card] };
                }
                return column;
            });
        });
    };

    const onDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) {
            return;
        }

        const activeId = String(active.id);
        const overId = String(over.id);

        if (activeId === overId) {
            return;
        }

        // Check if we're dragging a column
        if (active.data.current?.type === 'column') {
            const oldIndex = columns.findIndex(col => col.id === Number(activeId));
            const newIndex = columns.findIndex(col => col.id === Number(overId));

            if (oldIndex !== -1 && newIndex !== -1) {
                const newColumns = [...columns];
                const [movedColumn] = newColumns.splice(oldIndex, 1);
                newColumns.splice(newIndex, 0, movedColumn);
                setColumns(newColumns);
                return;
            }
        }

        // Handle card dragging
        const sourceColumn = columns.find(column =>
            column.cards.some(card => card.id === activeId)
        );

        let destinationColumn = columns.find(column =>
            column.cards.some(card => card.id === overId)
        );

        // If overId is a column ID
        if (!destinationColumn) {
            destinationColumn = columns.find(column => column.id === Number(overId));
        }

        if (!sourceColumn || !destinationColumn) {
            console.error("Error: Invalid column IDs in drag event.");
            return;
        }

        const activeCardIndex = sourceColumn.cards.findIndex(
            card => card.id === activeId
        );

        let overCardIndex = destinationColumn.cards.findIndex(
            card => card.id === overId
        );

        if (overCardIndex === -1) {
            // If overId is a column ID, append to the end
            overCardIndex = destinationColumn.cards.length;
        }

        if (sourceColumn.id === destinationColumn.id) {
            // Moving within the same column
            const updatedCards = [...sourceColumn.cards];
            const [movedCard] = updatedCards.splice(activeCardIndex, 1);
            updatedCards.splice(overCardIndex, 0, movedCard);

            const updatedColumn = { ...sourceColumn, cards: updatedCards };

            // Update state
            setColumns(prevColumns =>
                prevColumns.map(col => (col.id === updatedColumn.id ? updatedColumn : col))
            );
        } else {
            // Moving between different columns
            const sourceCards = [...sourceColumn.cards];
            const destinationCards = [...destinationColumn.cards];

            const [movedCard] = sourceCards.splice(activeCardIndex, 1);
            const updatedCard: Card = {
                ...movedCard,
                id: movedCard.id,
                company: movedCard.company,
                position: movedCard.position,
                deadline: movedCard.deadline,
                location: movedCard.location,
                url: movedCard.url,
                notes: movedCard.notes,
                salary: movedCard.salary,
                interview_stage: movedCard.interview_stage,
                data_applied: movedCard.data_applied,
                card_color: movedCard.card_color,
                job_id: movedCard.job_id,
                Favourite: movedCard.Favourite
            };

            destinationCards.splice(overCardIndex, 0, updatedCard);

            const updatedColumns = columns.map(col => {
                if (col.id === sourceColumn.id) {
                    return { ...col, cards: sourceCards };
                } else if (col.id === destinationColumn.id) {
                    return { ...col, cards: destinationCards };
                } else {
                    return col;
                }
            });

            setColumns(updatedColumns);

            // Update the backend to persist the status change
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/applications/${activeId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`,
                    },
                    body: JSON.stringify({
                        statusId: destinationColumn.id,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to update application status');
                }

                console.log('Application status updated:', await response.json());
            } catch (error) {
                console.error('Error updating status:', error);
            }
        }
    };

    const filterBoard = (searchResults: any[]) => {
        setColumns((prevColumns) =>
            prevColumns.map((column) => ({
                ...column,
                cards: column.cards.filter((card) =>
                    searchResults.some((result) => String(result.ApplicationId) === String(card.id))
                ),
            }))
        );
    };

    return (
        <BoardContext.Provider
            value={{
                columns,
                setColumns,
                addCardToColumn,
                updateCard,
                onDragEnd,
                updateStatusLocally,
                filterBoard,
            }}>
            {children}
        </BoardContext.Provider>
    );
};