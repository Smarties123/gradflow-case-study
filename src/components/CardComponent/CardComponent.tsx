import React, { useEffect, useState } from 'react';
import './CardComponent.less'; 
import { IoMdStar, IoMdTrash, IoMdLink} from "react-icons/io";
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
                <IoMdStar  
                    className={`star-icon ${isFavorited ? 'favorited' : ''}`}
                    onClick={handleToggleFavorite}
                    onMouseDown={stopPropagation} 
                    onMouseUp={stopPropagation} 
                    // style={{ color: isFavorited ? 'yellow' : 'grey' }}
                />
                {/* Add wrapper for link and delete icons */}
                <div className="icon-buttons">
                    <IoMdLink 
                        className="link-icon"
                        onClick={(e) => {
                            stopPropagation(e);
                            if (card.url) {
                                // Check if the URL already has a scheme (http or https)
                                const isValidUrl = card.url.startsWith('http://') || card.url.startsWith('https://');
                                const finalUrl = isValidUrl ? card.url : `https://${card.url}`;
                                
                                window.open(finalUrl, '_blank'); // Opens the final URL in a new tab                            } else {
                                console.log("No URL provided for this card");
                            }
                        }}
                        onMouseDown={stopPropagation}
                        onMouseUp={stopPropagation}
                    />
                    <IoMdTrash 
                        className="delete-icon"
                        onClick={(e) => {
                            stopPropagation(e);
                            // Add your delete functionality here
                            // console.log("Delete button clicked");
                        }}
                        onMouseDown={stopPropagation}
                        onMouseUp={stopPropagation}
                    />
                </div>
            </div>

        </div>
    );
};

export default CardComponent;
