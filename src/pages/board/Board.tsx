// Board.tsx

import './Board.less';

import React, { useContext, useRef } from 'react';
import {
  DndContext,
  closestCorners,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
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
import DeleteModal from '../../components/DeleteStatus/DeleteStatus'; // **Add this line**
import BinPopup from '../../components/BinPopup/BinPopup';
import ColumnComponent from './boardComponents/Column';
import { useBoardHandlers } from './boardComponents/useBoardHandlers';
import { useFetchApplications } from './boardComponents/useFetchApplications';
import { useDragAndDrop } from './boardComponents/useDragAndDrop';

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
  } = useBoardHandlers(columns, setColumns);

  const { isDraggingCard, onDragStart, handleDragEnd } = useDragAndDrop(handleDeleteCard);

  // **Keep this declaration**
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  const { setNodeRef: setBinNodeRef } = useDroppable({
    id: 'bin',
  });

  const containerRef = useRef<HTMLDivElement>(null);

  const { loading, error } = useFetchApplications(setColumns);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      window.location.href = '/signin';
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // **Remove this duplicate declaration**
  // const sensors = useSensors(
  //   useSensor(MouseSensor),
  //   useSensor(TouchSensor)
  // );

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragEnd={handleDragEnd}
        autoScroll={true}
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
                  handleDropdownOptionSelect={handleDropdownOptionSelect}
                  handleAddButtonClick={handleAddButtonClick}
                  handleCardSelect={handleCardSelect}
                  user={user}
                  handleFavoriteToggle={handleFavoriteToggle}
                  handleDeleteCard={handleDeleteCard}
                  isDraggingCard={isDraggingCard}
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
          <DeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onNo={() => setIsDeleteModalOpen(false)}
            onYes={handleDeleteCardOrColumn}
          />

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
      </DndContext>
    </div>
  );
};

export default Board;
