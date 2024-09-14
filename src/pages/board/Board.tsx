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

const Board: React.FC = () => {
  const context = useContext(BoardContext);
  const { user } = useUser(); // Access the user credentials

  const [loading, setLoading] = useState<boolean>(true); // State to manage loading
  const [error, setError] = useState<string | null>(null); // State to manage errors

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
        const response = await fetch('http://localhost:3001/applications', {
          headers: {
            'Authorization': `Bearer ${user?.token}`, // Attach the token
          },
        });

        if (response.ok) {
          const jobs = await response.json();

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
            interview_stage: job.ApplicationStatus || 'Unknown', // Default to 'Unknown' if null
            date_applied: job.DateApplied,
            card_color: job.Color || '#ffffff', // Default to white if color is not set
            companyLogo: job.CompanyLogo, // Add this to store the company logo          
            Favourite: job.Favourite || false, // Ensure Favourite is included
          }));
          console.log(mappedJobs);

          // Group jobs into columns based on some logic (e.g., job status)
          const groupedColumns = groupJobsIntoColumns(mappedJobs);
          setColumns(groupedColumns);
        } else {
          throw new Error('Failed to fetch applications');
        }
      } catch (error) {
        console.error('Error loading applications:', error);
        setError('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchApplications();
    }
  }, [user]);

  // Function to group jobs into columns based on some status
  const groupJobsIntoColumns = (jobs: Card[]): Column[] => {
    //we want to group by 'Status'
    const columns: Column[] = [
      { id: 1, title: 'Applied', cards: [] },
      { id: 2, title: 'Interview', cards: [] },
      { id: 3, title: 'Offered', cards: [] },
      { id: 4, title: 'Rejected', cards: [] },
    ];

    jobs.forEach(job => {
      switch (job.interview_stage) {
        case 'Applied':
          columns[0].cards.push(job);
          break;
        case 'Interview':
          columns[1].cards.push(job);
          break;
        case 'Offered':
          columns[2].cards.push(job);
          break;
        case 'Rejected':
          columns[3].cards.push(job);
          break;
        default:
          columns[0].cards.push(job); // Default to 'Applied' if status is unknown
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


  const ref = useRef<HTMLInputElement>(null);

  const handleIconClick = (columnId: number, title: string) => {
    setEditingColumnId(columnId);
    setNewTitle(title);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    if (editingColumnId !== null) {
      if (newTitle.trim() === '') {
        setEditingColumnId(null);
        return;
      }

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

  const handleDropdownOptionSelect = (option: number) => {
    console.log(`Option ${option} selected.`);
    setShowDropdown(null);  // Close the dropdown after selecting
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


  //For Deleting Card
  const handleDeleteCard = (cardId) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) => ({
        ...column,
        cards: column.cards.filter((card) => card.id !== cardId) // Remove the deleted card
      }))
    );
  };

  // For Adding new Status
  const handleAddNewColumn = () => {
    const newColumnId = columns.length + 1;
    const newColumn: Column = {
      id: newColumnId,
      title: 'New Status', // Default title
      cards: [],
    };

    setColumns([...columns, newColumn]); // Add new Status to the existing ones
  };




  return (
    <DragDropContext onDragEnd={onDragEnd as any}>
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
                      <li onClick={() => handleDropdownOptionSelect(1)}>
                        <IoMdMove /> Move Status
                      </li>
                      <li onClick={() => handleDropdownOptionSelect(2)}>
                        <IoMdTrash /> Delete Status
                      </li>
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
        {isModalOpen && activeColumn && (
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            columns={columns}
            activeColumn={activeColumn}
          />
        )}
        {isDrawerOpen && selectedCard && (
          <DrawerView
            show={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            card={selectedCard}
            updateCard={updateCard}
            columnName={selectedCard.columnName}
          />
        )}
        {/* Add the Add New Status Button */}
        <div className="column-container" id="add-new-column">
          <button className="add-new-button" onClick={handleAddNewColumn}>
            Add New Status
          </button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Board;
