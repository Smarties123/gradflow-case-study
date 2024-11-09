// ./boardComponents/useBoardHandlers.ts

import { useState, useContext } from 'react';
import { BoardContext } from '../BoardContext';
import { Column, Card } from '../types';
import { useUser } from '../../../components/User/UserContext';

export const useBoardHandlers = (columns, setColumns) => {
  const { user } = useUser();
  const [editingColumnId, setEditingColumnId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const [selectedColumnId, setSelectedColumnId] = useState<number | null>(null);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number>(-1);
  const [cardId, setCardId] = useState<number>(-1);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  // Handler functions
  const handleIconClick = (columnId: number, title: string) => {
    setEditingColumnId(columnId);
    setNewTitle(title);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const capitalizedTitle = e.target.value.toUpperCase();
    setNewTitle(capitalizedTitle);
  };

  const handleTitleBlur = async () => {
    if (editingColumnId !== null) {
      if (newTitle.trim() === '') {
        setEditingColumnId(null);
        return;
      }

      // Update local state
      setColumns(prev =>
        prev.map(col =>
          col.id === editingColumnId ? { ...col, title: newTitle } : col
        )
      );

      // Send the updated column name to the backend
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/status/${editingColumnId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token}`,
          },
          body: JSON.stringify({ statusName: newTitle }),
        });

        if (!response.ok) {
          throw new Error('Failed to update column name');
        }

        const updatedStatus = await response.json();
        console.log('StatusName updated:', updatedStatus);

      } catch (error) {
        console.error('Error updating column name:', error);
      }

      setEditingColumnId(null);
    }
  };

  const handleTitleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleBlur();
    }
  };

  const handleDropdownClick = (columnId: number) => {
    setShowDropdown(showDropdown === columnId ? null : columnId);
  };

  const handleDropdownOptionSelect = async (option: number, columnId: number) => {
    if (option === 2) {
      const column = columns.find(col => col.id === columnId);
      if (!column || column.cards.length > 0) {
        alert('Cannot delete a column with cards.');
        return;
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/status/${columnId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user?.token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete column');
        }

        setColumns(prevColumns => prevColumns.filter(col => col.id !== columnId));
        alert('Column deleted successfully');
      } catch (error) {
        console.error('Error deleting column:', error);
        alert('Failed to delete column');
      }
    }
    setShowDropdown(null);
  };

  const handleDeleteModal = (columnId: number) => {
    setDeleteId(columnId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCardOrColumn = () => {
    if (deleteId !== -1) {
      handleDropdownOptionSelect(2, deleteId);
    }
    if (cardId !== -1) {
      handleDeleteCard(cardId);
    }
  };

  const handleDeleteCard = (cardId: number) => {
    setColumns(prevColumns =>
      prevColumns.map(column => ({
        ...column,
        cards: column.cards.filter(card => card.id !== String(cardId)),
      }))
    );
  };

  const handleCardSelect = (card: Card) => {
    const column = columns.find(col => col.cards.some(c => c.id === card.id));
    const columnName = column ? column.title : 'Unknown Column';
    setSelectedCard({ ...card, columnName, companyLogo: card.companyLogo });
    setIsDrawerOpen(true);
  };

  const handleAddButtonClick = (column: Column) => {
    setActiveColumn(column);
    setIsModalOpen(true);
  };

  const handleFavoriteToggle = updatedCard => {
    setColumns(prevColumns =>
      prevColumns.map(column => ({
        ...column,
        cards: column.cards.map(card =>
          card.id === updatedCard.ApplicationId ? { ...card, Favourite: updatedCard.Favourite } : card
        ),
      }))
    );
  };

  const handleAddNewColumn = async () => {
    const newColumnTitle = 'NEW STATUS';

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ statusName: newColumnTitle }),
      });

      if (!response.ok) {
        throw new Error('Failed to create new column');
      }

      const newStatus = await response.json();

      const newColumn: Column = {
        id: newStatus.status.StatusId,
        title: newStatus.status.StatusName,
        cards: [],
      };

      setColumns(prevColumns => [...prevColumns, newColumn]);
    } catch (error) {
      console.error('Error creating new column:', error);
    }
  };

  const handleUpdateStatus = newStatus => {
    if (selectedCard) {
      const updatedCard = { ...selectedCard, status: newStatus };
      setSelectedCard(updatedCard);
      setColumns(prevColumns =>
        prevColumns.map(column => ({
          ...column,
          cards: column.cards.map(card =>
            card.id === updatedCard.id ? { ...card, status: newStatus } : card
          )
        }))
      );
    }
  };

  return {
    editingColumnId,
    newTitle,
    showDropdown,
    isDrawerOpen,
    selectedCard,
    isModalOpen,
    activeColumn,
    isDeleteModalOpen,
    showMoveModal,
    selectedColumnId,
    handleIconClick,
    handleTitleChange,
    handleTitleBlur,
    handleTitleKeyPress,
    handleDropdownClick,
    handleDropdownOptionSelect,
    handleDeleteModal,
    handleDeleteCardOrColumn,
    handleDeleteCard,
    handleCardSelect,
    handleAddButtonClick,
    handleFavoriteToggle,
    handleAddNewColumn,
    handleUpdateStatus,
    setIsModalOpen,
    setIsDrawerOpen,
    setIsDeleteModalOpen,
    setShowMoveModal,
  };
};
