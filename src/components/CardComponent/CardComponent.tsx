import React, { useEffect, useState } from 'react';
import './CardComponent.less';
import { IoMdStar, IoMdTrash, IoMdLink } from "react-icons/io";
import DeleteCardModal from './DeleteCardModal';

const CardComponent = ({ card, onSelect, user, onFavoriteToggle, provided, snapshot, onDelete }) => {
    const [isFavorited, setIsFavorited] = useState(card.Favourite || false);
    const [isHolding, setIsHolding] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isLongCompanyName, setIsLongCompanyName] = useState(false);

    let pressTimer = null;

    useEffect(() => {
        setIsFavorited(card.Favourite);

        // Check if the company name is longer than 22 characters
        if (card.company.length > 22) {
            setIsLongCompanyName(true);
        } else {
            setIsLongCompanyName(false);
        }
    }, [card.Favourite, card.company]);

    const handleToggleFavorite = async (e) => {
        e.stopPropagation();
        const newFavoriteStatus = !isFavorited;
        setIsFavorited(newFavoriteStatus);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/applications/${card.id}/favorite`, {
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
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/applications/${card.id}`, {
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
                        onMouseDown={stopPropagation}
                        onMouseUp={stopPropagation}
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
