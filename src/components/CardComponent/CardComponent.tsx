import React, { useEffect, useState } from 'react';
import './CardComponent.less'; 
import { IoMdStar, IoMdTrash, IoMdLink } from "react-icons/io";
import { useUser } from '@/components/User/UserContext';
import DeleteCardModal from './DeleteCardModal'; // Import the new modal

const CardComponent = ({ card, onSelect, user, onFavoriteToggle, provided, snapshot, onDelete }) => {
    const [isFavorited, setIsFavorited] = useState(card.Favourite || false);
    const [isHolding, setIsHolding] = useState(false); 
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Manage modal state

    let pressTimer = null;

    useEffect(() => {
        setIsFavorited(card.Favourite);
    }, [card.Favourite]);

    const handleToggleFavorite = async (e) => {
        e.stopPropagation(); // Prevent triggering the card's onClick event
        const newFavoriteStatus = !isFavorited;
        setIsFavorited(newFavoriteStatus);

        try {
            const response = await fetch(`http://localhost:3001/applications/${card.id}/favorite`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify({ isFavorited: newFavoriteStatus })
            });

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

    const handleMouseDown = (e) => {
        if (isDeleteModalOpen) return;

        if (e.target.tagName !== 'BUTTON' && !e.target.closest('.icon-buttons')) {
            pressTimer = setTimeout(() => {
                setIsHolding(true); 
            }, 300);
        }
    };

    const handleMouseUp = () => {
        if (isDeleteModalOpen) return;

        clearTimeout(pressTimer); 
        if (!isHolding) {
            onSelect(card); 
        } else {
            setIsHolding(false); 
        }
    };

    const stopPropagation = (e) => {
        e.stopPropagation();
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        setIsDeleteModalOpen(true); // Show the delete modal
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3001/applications/${card.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`, 
                },
            });

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

    const handleCloseModal = () => {
        setIsDeleteModalOpen(false); 
    }

    // Truncate logic
    const truncateText = (text, limit) => {
        return text.length > limit ? text.substring(0, limit) + '...' : text;
    };

    return (
        <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            style={{ backgroundColor: card.card_color }}
            className={`card ${snapshot.isDragging ? 'is-dragging' : ''} ${isHolding ? 'is-holding' : ''}`}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
        >
            <div className="card-content">
                <div className="left-icons">
                    {card.companyLogo ? (
                        <img src={card.companyLogo} alt={card.company} className="company-logo-small" />
                    ) : null}
                    {/* Truncate company name to 22 characters */}
                    <h3 className="company-name">{truncateText(card.company, 22)}</h3>
                </div>
                {/* Truncate position to 25 characters */}
                <p className="position">{truncateText(card.position, 30)}</p>
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
                                const isValidUrl = card.url.startsWith('http://') || card.url.startsWith('https://');
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
                        onMouseDown={(e) => { e.stopPropagation(); }}  
                        onMouseUp={(e) => { e.stopPropagation(); }}    
                    />
                </div>
            </div>

            <DeleteCardModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseModal}
                onDelete={handleConfirmDelete} 
            />

        </div>
    );
};

export default CardComponent;
