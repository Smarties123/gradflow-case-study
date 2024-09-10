import React from 'react';
import './CardComponent.less'; // Make sure the CSS file is linked
import { FaStar } from 'react-icons/fa';
import { MdShare } from 'react-icons/md'; // Assuming use of share icon for external link
import { Icon } from '@rsuite/icons';
import { VscInfo } from 'react-icons/vsc'; // Assuming use of info icon
import { IconButton } from 'rsuite';

const CardComponent = ({ card, onSelect }) => {

    const handleAddClick = () => {
        console.log("Card Clicked", card);
    };

    return (
        <div style={{ backgroundColor: card.card_color }} className="card" onClick={handleAddClick}>
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
                <FaStar className="star-icon" />
                <IconButton className="info-icon"
                    icon={<Icon as={VscInfo} />}
                    onClick={() => onSelect(card)}
                />
            </div>
        </div>
    );
};

export default CardComponent;
