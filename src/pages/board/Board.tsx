import React, { useContext, useEffect, useRef, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Modal from '../../components/Modal/Modal';
import CardComponent from '../../components/CardComponent/CardComponent';
import './Board.less';
import DrawerView from '../../components/DrawerView/DrawerView';
import { IoMdMore, IoMdMove, IoMdTrash } from "react-icons/io";  // Updated import for the icon
import { BoardContext } from './BoardContext';
import { useUser } from '../../components/User/UserContext';
import { Column, Card } from './types';
import FeedbackButton from '../../components/FeedbackButton/FeedbackButton';
import MoveStatusModal from '../../components/MoveStatusModal/MoveStatusModal';  // Import the modal

import DeleteModal from '../../components/DeleteStatus/DeleteStatus';

import BinPopup from '../../components/BinPopup/BinPopup';




const Board: React.FC = () => {
  const context = useContext(BoardContext);
  const { user } = useUser(); // Access the user credentials

  const [loading, setLoading] = useState<boolean>(true); // State to manage loading
  const [error, setError] = useState<string | null>(null); // State to manage errors
  const [isDraggingCard, setIsDraggingCard] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      window.location.href = '/signin';
    }
  }, [user]);

  // Fetch applications on component mount
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        // Fetch the user's statuses (columns)
        const statusResponse = await fetch(`${process.env.REACT_APP_API_URL}/status`, {
          headers: {
            'Authorization': `Bearer ${user?.token}`, // Attach the token
          },
        });

        if (!statusResponse.ok) {
          throw new Error('Failed to fetch statuses');
        }

        const statuses = await statusResponse.json();

        // Fetch the user's applications
        const jobResponse = await fetch(`${process.env.REACT_APP_API_URL}/applications`, {
          headers: {
            'Authorization': `Bearer ${user?.token}`, // Attach the token
          },
        });

        if (!jobResponse.ok) {
          throw new Error('Failed to fetch applications');
        }

        const jobs = await jobResponse.json();

        // Map the server data to match the Card interface
        const mappedJobs: Card[] = jobs.map((job: any) => ({
          id: String(job.ApplicationId),
          company: job.CompanyName,
          position: job.JobName,
          deadline: job.Deadline,
          location: job.Location,
          url: job.CompanyURL,
          notes: job.Notes || '',
          salary: job.Salary || 0, // Default to 0 if salary is null
          StatusId: job.StatusId,  // Use StatusId from the backend
          date_applied: job.DateApplied,
          card_color: job.Color || '#ffffff', // Default to white if color is not set
          companyLogo: job.CompanyLogo, // Add this to store the company logo
          Favourite: job.Favourite || false, // Ensure Favourite is included
        }));

        console.log(mappedJobs);

        // Group jobs into columns based on StatusId and Status from the user's statuses
        const groupedColumns = groupJobsIntoColumns(mappedJobs, statuses);
        setColumns(groupedColumns);
      } catch (error) {
        console.error('Error loading applications or statuses:', error);
        setError('Failed to load applications or statuses');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchApplications();
    }
  }, [user]);


  // Function to group jobs into columns based on some status
  const groupJobsIntoColumns = (jobs: Card[], statuses: any[]): Column[] => {
    // Create columns based on the user's specific statuses
    const columns: Column[] = statuses.map((status) => ({
      id: status.StatusId,
      title: status.StatusName,
      cards: []
    }));

    // Group jobs into the appropriate column based on StatusId
    jobs.forEach(job => {
      const statusIndex = columns.findIndex(col => col.id === job.StatusId); // Use StatusId from backend

      if (statusIndex >= 0) {
        columns[statusIndex].cards.push(job);
      } else {
        columns[0].cards.push(job); // Default to the first column if StatusId is unknown
      }
    });

    return columns;
  };



  //TO DO: SPINNERS FOR LOADING and Proper ERROR Pages
  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>{error}</div>;
  // }

  if (!context) {
    console.error('BoardContext is undefined. Ensure BoardProvider is correctly wrapping the component.');
  }

  const { columns, setColumns, updateCard, onDragEnd } = context!;

  if (!columns) {
    console.error('Columns are not defined in context.');
  }

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [editingColumnId, setEditingColumnId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState<string>('');

  const [showDropdown, setShowDropdown] = useState<number | null>(null);  // State to handle dropdown

  // const { columns, setColumns } = useContext(BoardContext);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number | null>(-1);


  const ref = useRef<HTMLInputElement>(null);

  const handleIconClick = (columnId: number, title: string) => {
    setEditingColumnId(columnId);
    setNewTitle(title);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const capitalizedTitle = e.target.value.toUpperCase();
    setNewTitle(capitalizedTitle);  // Always capitalize input
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

      // Send the updated column name (StatusName) to the backend
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/status/${editingColumnId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token}`, // Attach the token
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
    if (option === 1) {  // Move option
      setSelectedColumnId(columnId);  // Set the column ID that is being moved
      setShowMoveModal(true);  // Show the modal
    } else if (option === 2) {  // Delete option
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


  const handleMove = (newPosition: number) => {
    if (selectedColumnId !== null) {
      // Call backend to update the status order
      fetch(`${process.env.REACT_APP_API_URL}/status/${selectedColumnId}/move`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ newPosition }),
      })
        .then(response => {
          if (response.ok) {
            // Update frontend state accordingly
            setColumns((prevColumns) => {
              const newColumns = [...prevColumns];
              const movingColumn = newColumns.find(col => col.id === selectedColumnId);
              if (movingColumn) {
                newColumns.splice(movingColumn.StatusOrder - 1, 1); // Remove from current position
                newColumns.splice(newPosition - 1, 0, movingColumn); // Insert in new position
                newColumns.forEach((col, index) => col.StatusOrder = index + 1); // Recalculate order
              }
              return newColumns;
            });
          }
        });
    }
  };







  const onDragStart = () => {
    setIsDraggingCard(true);  // Ensure the bin popup appears when dragging starts
  };
  
  const handleDragEnd = async (result) => {
    setIsDraggingCard(false);  // Hide the bin icon when dragging ends
  
    if (!result.destination) {
      return;  // Dropped outside any column or droppable
    }
  
    // Check if the card is dropped over the bin
    const binDropped = result.destination.droppableId === 'bin';
  
    if (binDropped) {
      // Trigger the delete function here
      const cardId = result.draggableId;
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/applications/${cardId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user.token}`,  // Ensure you are using the correct token
          },
        });
  
        if (response.ok) {
          handleDeleteCard(cardId);  // Update state to remove the card
        } else {
          console.error('Failed to delete the card.');
        }
      } catch (error) {
        console.error('Error deleting the card:', error);
      }
    } else {
      // Handle card movement logic as usual
      context.onDragEnd(result);
    }
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

  const handleFavoriteToggle = (updatedCard) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) => ({
        ...column,
        cards: column.cards.map((card) =>
          card.id === updatedCard.ApplicationId ? { ...card, Favourite: updatedCard.Favourite } : card
        ),
      }))
    );
  };

  // Show Delete Modal
  const handleDeleteModal = (columnId: number) => {
    setDeleteId(columnId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteColumn = () => {
    // console.log("Delete Column");
    // console.log(deleteId);
    handleDropdownOptionSelect(2, deleteId);
  };



  //For Deleting Card
  const handleDeleteCard = (cardId) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) => ({
        ...column,
        cards: column.cards.filter((card) => card.id !== cardId),  // Remove the deleted card
      }))
    );
  };
  

  // For Adding new Status
  const handleAddNewColumn = async () => {
    const newColumnTitle = 'NEW STATUS';  // Ensure default title is capitalized

    try {
      // Send a request to the backend to create the new column in the database
      const response = await fetch(`${process.env.REACT_APP_API_URL}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`, // Attach the token
        },
        body: JSON.stringify({ statusName: newColumnTitle }), // Send the title to the backend
      });

      if (!response.ok) {
        throw new Error('Failed to create new column');
      }

      const newStatus = await response.json(); // Get the newly created column from the backend

      // Add the new column to the frontend's state
      const newColumn: Column = {
        id: newStatus.status.StatusId,  // Use the ID returned from the backend
        title: newStatus.status.StatusName, // Use the StatusName returned from the backend
        cards: [], // No cards in the new column yet
      };

      setColumns(prevColumns => [...prevColumns, newColumn]); // Add the new column to the existing ones
    } catch (error) {
      console.error('Error creating new column:', error);
    }
  };


  const handleUpdateStatus = (newStatus) => {
    if (selectedCard) {
        const updatedCard = { ...selectedCard, status: newStatus };
        setSelectedCard(updatedCard); // Update the selected card's status
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







  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={handleDragEnd}>
      <div className="board">
        {columns.length === 0 ? (
          <p>No columns available</p>
        ) : (
          columns.map(column => (
            <div key={column.id} className="column-container">
              <div style={{ maxWidth: '100%' }} className={`column-header ${editingColumnId === column.id ? 'editing' : ''}`}>
                {editingColumnId !== column.id && (
                  <p className="column-counter">{column.cards.length}</p>
                )}

                <div className="column-header-content">
                  {editingColumnId === column.id ? (
                    <div className='column-title-input'>
                      <input
                        ref={ref}
                        type="text"
                        value={newTitle}
                        onChange={handleTitleChange}
                        onBlur={handleTitleBlur}
                        onKeyPress={handleTitleKeyPress}
                        autoFocus
                        maxLength={10}
                        className='input-group'
                        style={{ fontSize: 'inherit' }}
                      />
                    </div>
                  ) : (
                    <div className="column-title" onClick={() => handleIconClick(column.id, column.title)}>
                      <h2>{column.title}</h2>
                    </div>
                  )}
                </div>
                {editingColumnId !== column.id && (
                  <button
                    className="icon-button"
                    onClick={() => handleDropdownClick(column.id)}
                  >
                    <IoMdMore />
                  </button>
                )}
                {showDropdown === column.id && (
                  <div className="dropdown">
                    <ul>
                      <li onClick={() => handleDropdownOptionSelect(1, column.id)}>
                        <IoMdMove /> Move Status
                      </li>
                      {column.cards.length === 0 && ( // Only show "Delete" if column has no cards
                        <li onClick={() => handleDeleteModal(column.id)}>
                          <IoMdTrash /> Delete Status
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
              <button onClick={() => handleAddButtonClick(column)}>Add New</button>
              <Droppable droppableId={String(column.id)}>
                {provided => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="droppable-area">
                    {column.cards.map((card, index) => (
                      <Draggable key={card.id} draggableId={String(card.id)} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <CardComponent
                              card={card}
                              onSelect={handleCardSelect}
                              user={user}
                              onFavoriteToggle={handleFavoriteToggle}
                              provided={provided}
                              snapshot={snapshot}  // Pass snapshot to detect drag state
                              onDelete={handleDeleteCard} // Pass delete handler
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))
        )}

        {/* Add New */}
        {isModalOpen && activeColumn && (
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            columns={columns}
            activeColumn={activeColumn} theme={undefined} />
        )}

        {/* Drawer View */}
        {isDrawerOpen && selectedCard && (
        <DrawerView
          show={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          card={selectedCard}
          updateCard={updateCard}
          columnName={selectedCard.columnName}
          updateStatus={handleUpdateStatus} // This updates the status when the user selects a new one
          statuses={columns.map(col => ({ StatusId: col.id, StatusName: col.title }))} // Ensure the statuses are passed correctly
        />



        )}

        {/* Moving Column */}
        {showMoveModal && selectedColumnId && (
          <MoveStatusModal
            isOpen={showMoveModal}
            onClose={() => setShowMoveModal(false)}
            currentOrder={columns.find(col => col.id === selectedColumnId)?.StatusOrder || 1}
            totalColumns={columns.length}
            onMove={handleMove}
            columnNames={columns.map(col => col.title)}  // Pass column names here
          />
        )}


        {/* Delete Modal */}
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onNo={() => setIsDeleteModalOpen(false)}
          onYes={handleDeleteColumn}
          title={null} />


        <div className="column-container" id="add-new-column">
          <button className="add-new-button" onClick={handleAddNewColumn}>
            Add New Status
          </button>
        </div>
      </div>


      {/* Add the bin as a droppable area */}
      <Droppable droppableId="bin">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="bin-drop-area">
            <BinPopup isDragging={isDraggingCard} />
            {provided.placeholder}
          </div>
        )}
      </Droppable>

    </DragDropContext>
  );

};

export default Board;
