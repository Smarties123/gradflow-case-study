import React, { useState } from 'react';
import { FaExternalLinkAlt, FaStar, FaTrash } from 'react-icons/fa';
import { VscEdit } from 'react-icons/vsc';
import { IoMdInformationCircleOutline } from "react-icons/io";

import { IconButton, ButtonGroup } from 'rsuite';


const Card = ({ card, onEdit, onDelete }) => {
    const [companyName, setCompanyName] = useState(card.companyName);
    const [companyPosition, setPosition] = useState(card.companyPosition);
    const [isEditing, setIsEditing] = useState(false);

    const handleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'companyName') {
            setCompanyName(value);
        } else if (name === 'position') {
            setPosition(value);
        }
    };

    return (
        <div style={styles.card}>
            <div style={styles.header}>
                {card.icon}
                <div style={styles.companyInfo}>
                    {isEditing ? (
                        <>
                            <input
                                type="text"
                                name="companyName"
                                value={companyName}
                                onChange={handleChange}
                                style={styles.input}
                            />
                            <input
                                type="text"
                                name="companyPosition"
                                value={companyPosition}
                                onChange={handleChange}
                                style={styles.input}
                            />
                        </>
                    ) : (
                        <>
                            <div style={styles.companyName}>{companyName}</div>
                            <div style={styles.companyPosition}>{companyPosition}</div>
                        </>
                    )}
                </div>
                {card.isFavorite && <FaStar style={styles.favoriteIcon} />}
            </div>
            <div style={styles.footer}>
                <a href={card.to} style={styles.externalLink}>
                    <FaExternalLinkAlt style={styles.externalLinkIcon} />
                </a>
                <ButtonGroup className="card-actions">
                    <IconButton
                        icon={<IoMdInformationCircleOutline />}
                        onClick={handleEdit}
                        style={styles.editButton}>

                    </IconButton>
                    <IconButton
                        icon={<VscEdit />}
                        size="sm"
                        onClick={onEdit}
                    />
                    <IconButton
                        icon={<FaTrash />}
                        size="sm"
                        onClick={onDelete}
                        style={styles.deleteButton}
                    />
                </ButtonGroup>
            </div>
        </div>
    );
};

const styles = {
    card: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#8B0000', // Dark red color
        color: 'white',
        padding: '10px',
        borderRadius: '10px',
        width: 'auto',
        marginBottom: '10px'
    },
    header: {
        display: 'flex',
        alignItems: 'center'
    },
    companyInfo: {
        marginLeft: '10px',
        flexGrow: 1
    },
    companyName: {
        fontSize: '18px',
        fontWeight: 'bold'
    },
    companyPosition: {
        fontSize: '14px'
    },
    favoriteIcon: {
        color: 'white',
        marginLeft: 'auto'
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '10px'
    },
    externalLink: {
        color: 'white',
        textDecoration: 'none'
    },
    externalLinkIcon: {
        marginLeft: 'auto'
    },
    editButton: {
        backgroundColor: 'transparent',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        textDecoration: 'underline'
    },
    deleteButton: {
        backgroundColor: 'transparent',
        border: 'none',
        color: 'white',
        cursor: 'pointer'
    },
    input: {
        backgroundColor: 'transparent',
        border: '1px solid white',
        color: 'white',
        padding: '5px',
        marginBottom: '5px',
        width: 'auto'
    }
};

export default Card;
