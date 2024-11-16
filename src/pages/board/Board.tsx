// Board.tsx

import './Board.less';

import React, { useContext, useRef, useState } from 'react';
import {
  DndContext,
  closestCorners,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  pointerWithin,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';

import Modal from '../../components/Modal/Modal';
import DrawerView from '../../components/DrawerView/DrawerView';
import { BoardContext } from './BoardContext';
import { useUser } from '../../components/User/UserContext';
import DeleteModal from '../../components/DeleteStatus/DeleteStatus';
import BinPopup from '../../components/BinPopup/BinPopup';
import ColumnComponent from './boardComponents/Column';
import CardComponent from '../../components/CardComponent/CardComponent'; // **Add this line**
import { useBoardHandlers } from './boardComponents/useBoardHandlers';
import { useFetchApplications } from './boardComponents/useFetchApplications';
import { useDragAndDrop } from './boardComponents/useDragAndDrop';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Board: React.FC = () => {
  const context = useContext(BoardContext);
  const { user } = useUser();

  const { columns, setColumns, updateCard, updateStatusLocally } = context!;

  const {
    editingColumnId,
    newTitle,
    showDropdown,
    isDrawerOpen,
    selectedCard,
    isModalOpen,
    activeColumn,
    isDeleteModalOpen,
    handleIconClick,
    handleTitleChange,
    handleTitleBlur,
    handleTitleKeyPress,
    handleDropdownClick,
    handleDropdownOptionSelect,
    // handleDeleteModal,
    handleDeleteCardOrColumn,
    handleDeleteColumnModal,
    handleDeleteCard,
    handleCardSelect,
    handleAddButtonClick,
    handleFavoriteToggle,
    handleAddNewColumn,
    handleUpdateStatus,
    setIsModalOpen,
    setIsDrawerOpen,
    setIsDeleteModalOpen,
  } = useBoardHandlers(columns, setColumns);

  // Initialize activeId state for DragOverlay
  const [activeId, setActiveId] = useState(null);

  const { isDraggingCard, onDragStart, handleDragEnd } = useDragAndDrop(handleDeleteCard, setActiveId);

  // Updated sensors using MouseSensor and TouchSensor with activationConstraint
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        delay: 100, // 300ms delay before drag starts
        tolerance: 5, // Allow slight movement before activation is canceled
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    })
  );

  const { setNodeRef: setBinNodeRef } = useDroppable({
    id: 'bin',
  });

  const containerRef = useRef<HTMLDivElement>(null);

  const { loading, error } = useFetchApplications(setColumns);

  const [isSkeletonLoading, setIsSkeletonLoading] = useState(true);


  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      window.location.href = '/signin';
    }
  }, [user]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsSkeletonLoading(false);
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, []);


  if (loading || isSkeletonLoading) {
    return (
      <div className="skeleton-container">
        {/* Skeleton for the board container */}
        <div className="board">
          <div className="column-container" style={{ width: '23%', padding: '0px', border: 'none' }}>
            <Skeleton height="83vh" width="100%" />
          </div>
          <div className="column-container" style={{ width: '23%', padding: '0px' }}>
            <Skeleton height="83vh" width="100%" />
          </div>
          <div className="column-container" style={{ width: '23%', padding: '0px' }}>
            <Skeleton height="83vh" width="100%" />
          </div>
          <div className="column-container" style={{ width: '23%', padding: '0px' }}>
            <Skeleton height="83vh" width="100%" />
          </div>
        </div>

      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Helper function to get card data by id
  const getCardById = (id: string | number) => {
    for (const column of columns) {
      const card = column.cards.find((card) => String(card.id) === String(id));
      if (card) {
        return card;
      }
    }
    return null;
  };

  // Updated handleDragStart and handleDragEnd
  const handleDragStart = (event: DragStartEvent) => {
    onDragStart(event);
  };

  // const handleDragEnd = (event: DragEndEvent) => {
  //   handleDragEnd(event);
  // };

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        autoScroll={true}
      // autoScroll={{
      //   enabled: true,
      //   threshold: { x: 0.1, y: 0.1 }, // Activate auto-scroll when cursor is within 10% of the edge
      //   speed: 5, // Reduce speed of auto-scroll
      //   acceleration: 10, // Adjust acceleration as needed
      //   interval: 20, // Adjust the interval between scroll updates
      // }}

      >

        <div className="board">
          <SortableContext
            items={columns.map(column => String(column.id))}
            strategy={horizontalListSortingStrategy}
          >
            {columns.length === 0 ? (
              <p>No columns available</p>
            ) : (
              columns.map(column => (
                <ColumnComponent
                  key={column.id}
                  column={column}
                  editingColumnId={editingColumnId}
                  newTitle={newTitle}
                  showDropdown={showDropdown}
                  handleIconClick={handleIconClick}
                  handleDropdownClick={handleDropdownClick}
                  handleTitleChange={handleTitleChange}
                  handleTitleBlur={handleTitleBlur}
                  handleTitleKeyPress={handleTitleKeyPress}
                  // handleDropdownOptionSelect={handleDropdownOptionSelect}
                  handleAddButtonClick={handleAddButtonClick}
                  handleCardSelect={handleCardSelect}
                  user={user}
                  handleFavoriteToggle={handleFavoriteToggle}
                  handleDeleteCard={handleDeleteCard}
                  handleDeleteColumnModal={handleDeleteColumnModal}
                  isDraggingCard={isDraggingCard}
                  activeId={activeId} // **Add this line**
                />
              ))
            )}
          </SortableContext>

          {/* Add New */}
          {isModalOpen && activeColumn && (
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              columns={columns}
              activeColumn={activeColumn}
              theme={undefined}
            />
          )}

          {/* Drawer View */}
          {isDrawerOpen && selectedCard && (
            <DrawerView
              show={isDrawerOpen}
              onClose={() => setIsDrawerOpen(false)}
              card={selectedCard}
              updateCard={updateCard}
              updateStatusLocally={updateStatusLocally}
              columnName={selectedCard.columnName}
              updateStatus={handleUpdateStatus}
              statuses={columns.map(col => ({ StatusId: col.id, StatusName: col.title }))}
            />
          )}

          {/* Delete Modal For Column */}
          {isDeleteModalOpen && (
            <DeleteModal
              isOpen={isDeleteModalOpen}
              onClose={() => setIsDeleteModalOpen(false)}
              onNo={() => setIsDeleteModalOpen(false)}
              onYes={() => handleDeleteCardOrColumn()}
              title={`Are you sure you want to delete this column?`}

            />
          )}

          <div className="column-container" id="add-new-column">
            <button className="add-new-button" onClick={handleAddNewColumn}>
              Add New Status
            </button>
          </div>
        </div>

        {/* Add the bin as a droppable area */}
        <div ref={setBinNodeRef} className="bin-drop-area">
          <BinPopup isDragging={isDraggingCard} />
        </div>

        {/* Add the DragOverlay */}
        <DragOverlay>
          {activeId ? (
            <CardComponent
              card={getCardById(activeId)}
              onSelect={handleCardSelect}
              user={user}
              handleFavoriteToggle={handleFavoriteToggle}
              onDelete={handleDeleteCard}
              dragOverlay={true}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default Board;

function useEffect(arg0: () => () => void, arg1: never[]) {
  throw new Error('Function not implemented.');
}
