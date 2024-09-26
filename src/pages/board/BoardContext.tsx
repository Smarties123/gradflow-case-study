import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { initialColumns as defaultInitialColumns } from '@/data/initialColumns';
import { Column, Card } from './types';

// Define the shape of the context
interface BoardContextType {
    columns: Column[];
    setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
    addCardToColumn: (columnId: number, card: Card) => void;
    updateCard: (id: number, updatedData: Partial<Card>) => void;
    onDragEnd: (result: any) => void;  // Removed user from argument
}

// Create the context
export const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const BoardProvider: React.FC<{ children: ReactNode; user: any }> = ({ children, user }) => {
    const [columns, setColumns] = useState<Column[]>([]);

    useEffect(() => {
        setColumns(defaultInitialColumns);
    }, []);

    const addCardToColumn = (columnId: number, card: Card) => {
        setColumns(prevColumns =>
            prevColumns.map(col =>
                col.id === columnId
                    ? { ...col, cards: [...col.cards, { ...card, companyLogo: card.companyLogo || '', id: Date.now() }] }
                    : col
            )
        );
    };

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

  const updateStatusLocally = (cardId: number, newStatusId: number) => {
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

        if (!movedCard) return prevColumns; // If no card found, return original columns

        // Add the card to the new column
        return updatedColumns.map(column => {
            if (column.id === newStatusId) {
                return { ...column, cards: [...column.cards, { ...movedCard, StatusId: newStatusId }] };
            }
            return column;
        });
    });
};

  

    const onDragEnd = async (result) => {
      const { source, destination } = result;
    
      if (!destination) {
        return; // Dropped outside any droppable
      }
    
      const startColumn = columns.find(col => col.id === parseInt(source.droppableId));
      const finishColumn = columns.find(col => col.id === parseInt(destination.droppableId));
    
      if (!startColumn || !finishColumn) {
        return;
      }
    
      // Moving within the same column
      if (startColumn === finishColumn) {
        const updatedCards = Array.from(startColumn.cards);
        const [movedCard] = updatedCards.splice(source.index, 1);
        updatedCards.splice(destination.index, 0, movedCard);
    
        const updatedColumn = { ...startColumn, cards: updatedCards };
    
        setColumns(prevColumns =>
          prevColumns.map(col => (col.id === updatedColumn.id ? updatedColumn : col))
        );


    };

    const onDragEnd = async (result) => {
      const { source, destination } = result;
    
      if (!destination) {
        return; // Dropped outside any droppable
      }
    
      const startColumn = columns.find(col => col.id === parseInt(source.droppableId));
      const finishColumn = columns.find(col => col.id === parseInt(destination.droppableId));
    
      if (!startColumn || !finishColumn) {
        return;
      }
    
      // Moving within the same column
      if (startColumn === finishColumn) {
        const updatedCards = Array.from(startColumn.cards);
        const [movedCard] = updatedCards.splice(source.index, 1);
        updatedCards.splice(destination.index, 0, movedCard);
    
        const updatedColumn = { ...startColumn, cards: updatedCards };
    
        setColumns(prevColumns =>
          prevColumns.map(col => (col.id === updatedColumn.id ? updatedColumn : col))
        );

      } else {
        // Moving between columns
        const startCards = Array.from(startColumn.cards);
        const finishCards = Array.from(finishColumn.cards);
        const [movedCard] = startCards.splice(source.index, 1);
    
        finishCards.splice(destination.index, 0, movedCard);
    
        const updatedStartColumn = { ...startColumn, cards: startCards };
        const updatedFinishColumn = { ...finishColumn, cards: finishCards };
    
        setColumns(prevColumns =>
          prevColumns.map(col => {
            if (col.id === updatedStartColumn.id) return updatedStartColumn;
            if (col.id === updatedFinishColumn.id) return updatedFinishColumn;
            return col;
          })
        );
      }
    
      // Update the backend
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/applications/${result.draggableId}/status`, {
          method: 'PUT',  // Now using the status-specific update route

          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            statusId: destination.droppableId,  // Update statusId based on new column
          }),
        });
        console.log("Updating status of application with ID:", id);  // Add this in `updateApplicationStatus`

    
        if (!response.ok) {
          throw new Error('Failed to update application status');
        }
    
        console.log('Application status updated:', await response.json());
      } catch (error) {
        console.error('Error updating status:', error);
      }
    };
    
    
      
      
      
      

    return (
      <BoardContext.Provider value={{ columns, setColumns, addCardToColumn, updateCard, onDragEnd, updateStatusLocally }}>
          {children}
      </BoardContext.Provider>
  );
};