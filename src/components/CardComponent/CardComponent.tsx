import React, { useEffect, useState } from 'react';
import './CardComponent.less'; // Make sure the CSS file is linked
import { FaStar } from 'react-icons/fa';
import { MdShare } from 'react-icons/md'; // Assuming use of share icon for external link
import { Icon } from '@rsuite/icons';
import { VscInfo } from 'react-icons/vsc'; // Assuming use of info icon
import { IconButton } from 'rsuite';
import { useUser } from '@/components/User/UserContext';

const CardComponent = ({ card, onSelect, user, onFavoriteToggle }) => {
    // State should be derived from props and updated when the card prop changes
    const [isFavorited, setIsFavorited] = useState(card.Favourite || false);

    // Sync state with props when card.Favourite changes
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
                onFavoriteToggle(updatedCard.application); // Call parent update
            } else {
                console.error('Failed to update favorite status');
            }
        } catch (error) {
            console.error('Error updating favorite status:', error);
        }
    };


    return (
        <div style={{ backgroundColor: card.card_color }} className="card">
            <div className="left-icons">
                {/* Dynamically render the company logo */}
                {card.companyLogo ? (
                    <img src={card.companyLogo} alt={card.company} className="company-logo" />
                ) : null}

                {/* Display the share icon below the company logo */}
                <MdShare className="share-icon" />
            </div>
            <div className="card-details">
                <h3 className="company-name">{card.company}</h3>
                <p className="position">{card.position}</p>
            </div>

            <div className="right-icons">
                <FaStar
                    className={`star-icon ${isFavorited ? 'favorited' : ''}`}
                    onClick={handleToggleFavorite}
                    style={{ color: isFavorited ? 'yellow' : 'grey' }}
                />
                <IconButton className="info-icon"
                    icon={<Icon as={VscInfo} />}
                    onClick={() => onSelect(card)}
                />
            </div>
        </div>
    );
};

export default CardComponent;
