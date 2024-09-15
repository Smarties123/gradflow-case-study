import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { initialColumns as defaultInitialColumns } from '@/data/initialColumns';
import { Column, Card } from './types';
import { useUser } from '@/components/User/UserContext';



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

// Modify the props to accept 'user'
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
            card.id === id ? { ...card, ...updatedData, Favourite: updatedData.Favourite || card.Favourite } : card
          );
          return { ...col, cards: updatedCards };
        })
      );
    };
  
    const onDragEnd = async (result: any) => {
      const { source, destination } = result;
  
      // Exit if there's no destination (item dropped outside)
      if (!destination) return;
  
      const startColumn = columns.find(col => col.id === parseInt(source.droppableId));
      const finishColumn = columns.find(col => col.id === parseInt(destination.droppableId));
  
      if (!startColumn || !finishColumn) return;
  
      // Create a copy of the cards from the start column
      const startCards = Array.from(startColumn.cards);
      const [movedCard] = startCards.splice(source.index, 1); // Remove the card from its original column
  
      if (startColumn === finishColumn) {
        startCards.splice(destination.index, 0, movedCard);
        const newColumn = { ...startColumn, cards: startCards };
        setColumns(prevColumns => prevColumns.map(col => (col.id === newColumn.id ? newColumn : col)));
      } else {
        const finishCards = Array.from(finishColumn.cards);
        finishCards.splice(destination.index, 0, movedCard);
  
        const newStartColumn = { ...startColumn, cards: startCards };
        const newFinishColumn = { ...finishColumn, cards: finishCards };
  
        setColumns(prevColumns =>
          prevColumns.map(col => {
            if (col.id === newStartColumn.id) return newStartColumn;
            if (col.id === newFinishColumn.id) return newFinishColumn;
            return col;
          })
        );
      }
  
      try {
        // Ensure the user token is available
        if (!user || !user.token) {
          throw new Error('User not authenticated');
        }
  
        const response = await fetch(`http://localhost:3001/applications/${movedCard.id}/move`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            applicationStatus: finishColumn.title, // Map the column title to status
            applicationStatusId: finishColumn.id,  // Send column id as applicationStatusId
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to update application status');
        }
  
        const updatedApplication = await response.json();
        console.log('Application status updated:', updatedApplication);
      } catch (error) {
        console.error('Error updating status:', error);
      }
    };
  
    return (
      <BoardContext.Provider value={{ columns, setColumns, addCardToColumn, updateCard, onDragEnd }}>
        {children}
      </BoardContext.Provider>
    );
  };

