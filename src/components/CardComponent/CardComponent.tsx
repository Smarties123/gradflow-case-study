import React, { useEffect, useState } from 'react';
import './CardComponent.less';
import { IoMdStar, IoMdTrash, IoMdLink } from 'react-icons/io';
import DeleteModal from '../../components/DeleteStatus/DeleteStatus';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const CardComponent = ({
  card,
  onSelect,
  user,
  onFavoriteToggle,
  onDelete,
  dragOverlay = false,
}) => {
  const [isFavorited, setIsFavorited] = useState(card.Favourite || false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLongCompanyName, setIsLongCompanyName] = useState(false);

  useEffect(() => {
    setIsFavorited(card.Favourite);
    setIsLongCompanyName(card.company.length > 22);
  }, [card.Favourite, card.company]);

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    const newFavoriteStatus = !isFavorited;

    // Only update state if the status has changed
    setIsFavorited(newFavoriteStatus);


    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/applications/${card.id}/favorite`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ isFavorited: newFavoriteStatus }),
        }
      );

      if (response.ok) {
        const updatedCard = await response.json();
        onFavoriteToggle(updatedCard.application);
      } else {
        console.error('Failed to update favorite status');
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

  const handleCardClick = () => {
    // Only trigger selection if not dragging
    if (!isDragging) {
      onSelect(card);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/applications/${card.id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.ok) {
        onDelete(card.id);
        setIsDeleteModalOpen(false);
      } else {
        console.error('Failed to delete the application');
      }
    } catch (error) {
      console.error('Error deleting the application:', error);
    }
  };

  const stopPropagation = (e) => {
    e.stopPropagation(); // Prevent event bubbling
  };

  // Setup for drag-and-drop
  let style = {
    backgroundColor: card.card_color,
  };

  let attributes = {};
  let listeners = {};
  let isDragging = false;
  let setNodeRef = null;

  if (!dragOverlay) {
    const sortable = useSortable({
      id: String(card.id),
    });
    attributes = sortable.attributes;
    listeners = sortable.listeners;
    setNodeRef = sortable.setNodeRef;
    style = {
      ...style,
      transform: CSS.Transform.toString(sortable.transform),
      transition: sortable.transition,
    };
    isDragging = sortable.isDragging;
  } else {
    isDragging = true;
    setNodeRef = undefined; // Don't set ref for the overlay
  }

  // Make the card transparent when dragging
  if (isDragging && !dragOverlay) {
    style.opacity = 0;
  }

  return (
    <div
    ref={setNodeRef}
    style={style}
    {...attributes}
    {...listeners}
    className={`card ${isDragging ? 'is-dragging' : ''}`}
    onClick={handleCardClick}
    onContextMenu={(e) => {
      e.preventDefault();
      handleCardClick();
      
    }}
    onDoubleClick={handleCardClick}
    title="Click or right-click to open details"
  >
      <div className="card-content">
        <div className="left-icons">
          {card.companyLogo ? (
            <img
              src={card.companyLogo}
              alt={card.company}
              className="company-logo-small"
            />
          ) : null}
          {/* Apply 'scroll' class only if company name exceeds 22 characters */}
          <h3 className={`company-name ${isLongCompanyName ? 'scroll' : ''}`}>
            {card.company}
          </h3>
        </div>
        <p className="position">{card.position}</p>
      </div>

      <div className="right-icons">
        <IoMdStar
          className={`star-icon ${isFavorited ? 'favorited' : ''}`}
          onClick={handleToggleFavorite}
          onMouseDown={stopPropagation}
          onMouseUp={stopPropagation}
        />
        <div className="icon-buttons">
          <IoMdLink
            className="link-icon"
            onClick={(e) => {
              stopPropagation(e);
              if (card.url) {
                const isValidUrl =
                  card.url.startsWith('http://') || card.url.startsWith('https://');
                const finalUrl = isValidUrl ? card.url : `https://${card.url}`;
                window.open(finalUrl, '_blank');
              }
            }}
            onMouseDown={stopPropagation}
            onMouseUp={stopPropagation}
          />
          <IoMdTrash
            className="delete-icon"
            onClick={handleDeleteClick}
            onMouseDown={stopPropagation}
            onMouseUp={stopPropagation}
          />
        </div>
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onNo={() => setIsDeleteModalOpen(false)}
        onYes={handleConfirmDelete}
        title={`Are you sure you want to delete this card?`}
      />
    </div>
  );
};

export default CardComponent;