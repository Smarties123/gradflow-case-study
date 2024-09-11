import React, { useEffect, useState } from 'react';
import './CardComponent.less'; 
import { FaStar } from 'react-icons/fa'; 
import { MdShare } from 'react-icons/md'; 
import { VscInfo } from 'react-icons/vsc'; 
import { IconButton } from 'rsuite'; 
import { useUser } from '@/components/User/UserContext';

const CardComponent = ({ card, onSelect, user, onFavoriteToggle, provided, snapshot }) => {
    const [isFavorited, setIsFavorited] = useState(card.Favourite || false);
    const [isHolding, setIsHolding] = useState(false); 
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

    const handleMouseDown = () => {
        pressTimer = setTimeout(() => {
            setIsHolding(true); 
        }, 300);
    };

    const handleMouseUp = () => {
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
                    <h3 className="company-name">{card.company}</h3>
                </div>
                <p className="position">{card.position}</p>
            </div>

                {/* <MdShare 
                    className="share-icon" 
                    onClick={stopPropagation}
                    onMouseDown={stopPropagation} 
                    onMouseUp={stopPropagation} 
                /> */}
            {/* </div> */}
            {/* <div className="card-details">
                <h3 className="company-name">{card.company}</h3>
                <p className="position">{card.position}</p>
            </div> */}

            <div className="right-icons">
                <FaStar
                    className={`star-icon ${isFavorited ? 'favorited' : ''}`}
                    onClick={handleToggleFavorite}
                    onMouseDown={stopPropagation} 
                    onMouseUp={stopPropagation} 
                    style={{ color: isFavorited ? 'yellow' : 'grey' }}
                />
                {/* <IconButton className="info-icon"
                    icon={<VscInfo />}
                    onClick={(e) => {
                        stopPropagation(e); // Prevent triggering onSelect
                        onSelect(card); // Open drawer on info click
                    }}
                    onMouseDown={stopPropagation}
                    onMouseUp={stopPropagation}
                /> */}
            </div>
        </div>
    );
};

export default CardComponent;
