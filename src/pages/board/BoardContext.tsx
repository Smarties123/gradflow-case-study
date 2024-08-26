import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { initialColumns as defaultInitialColumns } from '@/data/initialColumns';
import { Column, Card } from './types';

// Define the shape of the context
interface BoardContextType {
    columns: Column[];
    setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
    addCardToColumn: (columnId: number, card: Card) => void;
    updateCard: (id: number, updatedData: Partial<Card>) => void;
    onDragEnd: (result: any) => void;
}

// Create the context
export const BoardContext = createContext<BoardContextType | undefined>(undefined);

// Create the provider component
export const BoardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [columns, setColumns] = useState<Column[]>([]);

    // Load initial columns when the component mounts
    useEffect(() => {
        setColumns(defaultInitialColumns);
    }, []);

    // Function to add a card to a specific column
    const addCardToColumn = (columnId: number, card: Card) => {
        setColumns(prevColumns =>
            prevColumns.map(col =>
                col.id === columnId ? { ...col, cards: [...col.cards, { ...card, id: Date.now() }] } : col
            )
        );
    };

    // Function to update a card
    const updateCard = (id: number, updatedData: Partial<Card>) => {
        setColumns(prevColumns =>
            prevColumns.map(col => {
                const updatedCards = col.cards.map(card =>
                    card.id === id ? { ...card, ...updatedData } : card
                );
                return { ...col, cards: updatedCards };
            })
        );
    };

    // Function to handle drag and drop
    const onDragEnd = (result: any) => {
        const { source, destination } = result;

        // Exit if there's no destination (item dropped outside)
        if (!destination) return;

        // Exit if the item is dropped in the same position
        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        const startColumn = columns.find(col => col.id === parseInt(source.droppableId));
        const finishColumn = columns.find(col => col.id === parseInt(destination.droppableId));

        if (!startColumn || !finishColumn) return;

        const startCards = Array.from(startColumn.cards);
        const [movedCard] = startCards.splice(source.index, 1);

        if (startColumn === finishColumn) {
            // If the card is dropped in the same column
            startCards.splice(destination.index, 0, movedCard);
            const newColumn = { ...startColumn, cards: startCards };
            setColumns(prevColumns =>
                prevColumns.map(col => col.id === newColumn.id ? newColumn : col)
            );
        } else {
            // If the card is moved to a different column
            const finishCards = Array.from(finishColumn.cards);
            finishCards.splice(destination.index, 0, movedCard);

            const newStartColumn = { ...startColumn, cards: startCards };
            const newFinishColumn = { ...finishColumn, cards: finishCards };

            // Update the state with new columns
            setColumns(prevColumns =>
                prevColumns.map(col => {
                    if (col.id === newStartColumn.id) return newStartColumn;
                    if (col.id === newFinishColumn.id) return newFinishColumn;
                    return col;
                })
            );
        }
    };

    return (
        <BoardContext.Provider value={{ columns, setColumns, addCardToColumn, updateCard, onDragEnd }}>
            {children}
        </BoardContext.Provider>
    );
};
