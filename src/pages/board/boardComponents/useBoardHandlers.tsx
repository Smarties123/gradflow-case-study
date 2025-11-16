// ./boardComponents/useBoardHandlers.ts

import { useState, useContext } from 'react';
import { BoardContext } from '../BoardContext';
import { Column, Card } from '../types';
import { useUser } from '../../../components/User/UserContext';
import { notifyError } from '@/App';

export const useBoardHandlers = (columns, setColumns) => {
  const { user } = useUser();
  const [editingColumnId, setEditingColumnId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const [selectedColumnId, setSelectedColumnId] = useState<number | null>(null);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [premiumModal, showPremiumModal] = useState<boolean>(false);

  // Deleting Column
  const [columnToDelete, setColumnToDelete] = useState<number | null>(null);

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

      // Update local state only in demo mode
      setColumns(prev =>
        prev.map(col =>
          col.id === editingColumnId ? { ...col, title: newTitle } : col
        )
      );

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
        notifyError('Cannot delete a column with cards.');
        alert('Cannot delete a column with cards.');
        return;
      }

      // In demo mode, just update local state
      setColumns(prevColumns => prevColumns.filter(col => col.id !== columnId));
      setColumnToDelete(-1);
    }
    setShowDropdown(null);
  };

  const handleDeleteColumnModal = (columnId: number) => {
    setColumnToDelete(columnId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCardOrColumn = () => {
    if (columnToDelete !== null && columnToDelete !== -1) {
      handleDropdownOptionSelect(2, columnToDelete);
    }
    //   if (cardId !== -1) {
    //     handleDeleteCard(cardId);
    //   }
  };

  const handleDeleteCard = (cardId: number | string) => {
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

  const checkApplicationLimit = () => {
    const totalApps = columns.reduce((sum, c) => sum + c.cards.length, 0);
    const MAX_APPLICATIONS = user?.isMember ? Infinity : 3;

    return {
      totalApps,
      maxApps: MAX_APPLICATIONS,
      hasReachedLimit: totalApps >= MAX_APPLICATIONS,
      isAtLimit: totalApps >= MAX_APPLICATIONS
    };
  };

  const checkUserPremiumStatus = () => {
    return user?.isMember;
  };

  const handleAddButtonClick = (column: Column) => {
    const { hasReachedLimit } = checkApplicationLimit();

    if (hasReachedLimit) {
      console.log("Application limit reached. Upgrade to Premium to add more.");
      showPremiumModal(true);
      return;
    }

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

    // Generate a new ID for the column (use max existing ID + 1)
    const maxId = Math.max(...columns.map(col => col.id), 0);
    const newColumnId = maxId + 1;

    const newColumn: Column = {
      id: newColumnId,
      title: newColumnTitle,
      cards: [],
    };

    // In demo mode, just update local state
    setColumns(prevColumns => [...prevColumns, newColumn]);
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
    showMoveModal,
    selectedColumnId,
    isDeleteModalOpen,
    premiumModal,
    showPremiumModal,
    checkUserPremiumStatus,
    checkApplicationLimit,
    handleIconClick,
    handleTitleChange,
    handleTitleBlur,
    handleTitleKeyPress,
    handleDropdownClick,
    handleDropdownOptionSelect,
    handleDeleteColumnModal,
    handleDeleteCard,
    handleDeleteCardOrColumn,
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
