// Board.tsx

import './Board.less';

import React, { useContext, useRef, useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  pointerWithin,
  defaultDropAnimationSideEffects,
  MeasuringStrategy,
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
// import BinPopup from '../../components/BinPopup/BinPopup';
import ColumnComponent from './boardComponents/Column';
import CardComponent from '../../components/CardComponent/CardComponent'; // **Add this line**
import { useBoardHandlers } from './boardComponents/useBoardHandlers';
import { useFetchApplications } from './boardComponents/useFetchApplications';
import { useDragAndDrop } from './boardComponents/useDragAndDrop';
import Skeleton from 'react-loading-skeleton';
import { PremiumUpgradeModal } from '@/components/PremiumUpgradeModal';
import 'react-loading-skeleton/dist/skeleton.css';

const Board: React.FC = () => {
  const context = useContext(BoardContext);
  const { user } = useUser();

  const { columns, setColumns, updateCard, updateStatusLocally } = context!;

  const [isDeleteCardModalOpen, setIsDeleteCardModalOpen] = useState(false);


  const {
    editingColumnId,
    newTitle,
    showDropdown,
    isDrawerOpen,
    selectedCard,
    isModalOpen,
    activeColumn,
    isDeleteModalOpen,
    showPremiumModal,
    premiumModal,
    handleIconClick,
    handleTitleChange,
    handleTitleBlur,
    handleTitleKeyPress,
    handleDropdownClick,
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

  useEffect(() => {
    console.log("premiumModal changed to", premiumModal);
  }, [premiumModal]);


  const { isDraggingCard, onDragStart, handleDragEnd } = useDragAndDrop(handleDeleteCard, setActiveId);

  // Updated sensors with better constraints
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        delay: 0,
        tolerance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );


  const { loading, error } = useFetchApplications(setColumns);

  // const [isSkeletonLoading, setIsSkeletonLoading] = useState(true);


  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      window.location.href = '/signin';
    }
  }, [user]);

  // React.useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setIsSkeletonLoading(false);
  //   }, 5000); // 5 seconds

  //   return () => clearTimeout(timer);
  // }, []);


  if (loading) {
    return (
      <div className="skeleton-container">
        {/* Skeleton for the board container */}
        <div className="board">
          <div className="column-container" style={{ width: '23%', padding: '0px', border: 'none' }}>
            <Skeleton height="83vh" width="100%" />
          </div>
          <div className="column-container" style={{ width: '23%', padding: '0px', border: 'none' }}>
            <Skeleton height="83vh" width="100%" />
          </div>
          <div className="column-container" style={{ width: '23%', padding: '0px', border: 'none' }}>
            <Skeleton height="83vh" width="100%" />
          </div>
          <div className="column-container" style={{ width: '23%', padding: '0px', border: 'none' }}>
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


  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        measuring={{
          droppable: {
            strategy: MeasuringStrategy.Always,
          },
        }}
        autoScroll={{
          enabled: true,
          threshold: { x: 0.2, y: 0.2 },
          speed: {
            x: 10,
            y: 10
          },
          acceleration: 15,
          interval: 5,
        }}
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
                <div key={column.id} className="column-wrapper">
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
                    handleAddButtonClick={handleAddButtonClick}
                    handleCardSelect={handleCardSelect}
                    user={user}
                    handleFavoriteToggle={handleFavoriteToggle}
                    handleDeleteCard={handleDeleteCard}
                    handleDeleteColumnModal={handleDeleteColumnModal}
                    isDraggingCard={isDraggingCard}
                    activeId={activeId}
                  />
                </div>
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
              user={user}
              updateStatusLocally={updateStatusLocally}
              columnName={selectedCard.columnName}
              updateStatus={handleUpdateStatus}
              statuses={columns.map(col => ({ StatusId: col.id, StatusName: col.title }))}
              triggerDeleteModal={() => setIsDeleteCardModalOpen(true)}

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


          <PremiumUpgradeModal
            isOpen={premiumModal}
            onClose={() => showPremiumModal(false)}
            featureName="unlimited application tracking"
          />


          {/* DELETE POPUP */}
          {isDeleteCardModalOpen && (
            <DeleteModal
              isOpen={isDeleteCardModalOpen}
              onClose={() => setIsDeleteCardModalOpen(false)}
              onNo={() => setIsDeleteCardModalOpen(false)}
              onYes={() => {
                // Let the card component handle animation via a global signal
                setIsDeleteCardModalOpen(false);
                setTimeout(() => {
                  if (selectedCard?.id) {
                    document.dispatchEvent(new CustomEvent('triggerCardDelete', {
                      detail: { cardId: selectedCard.id }
                    }));
                  }
                }, 300); // Let modal close first
              }}

              title="Are you sure you want to delete this card?"
            />
          )}

          <div className="column-container" id="add-new-column">
            <button className="add-new-button" onClick={handleAddNewColumn}>
              Add New Status
            </button>
          </div>
        </div>

        {/* Add the bin as a droppable area */}
        {/* <div ref={setBinNodeRef} className="bin-drop-area">
          <BinPopup isDragging={isDraggingCard} />
        </div> */}

        {/* Add the DragOverlay */}
        <DragOverlay>
          {activeId ? (
            (() => {
              const card = getCardById(activeId);
              return card ? (
                <CardComponent
                  card={card}
                  onSelect={handleCardSelect}
                  user={user}
                  handleFavoriteToggle={handleFavoriteToggle}
                  onDelete={handleDeleteCard}
                  dragOverlay={true}
                />
              ) : null;
            })()
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default Board;
