import React, { useState } from 'react';
import { Modal, InputGroup, Input, Button, Tag } from 'rsuite';
import './Share.less';

interface ShareModalProps {
    isModalOpen: boolean;
    handleCloseModal: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ isModalOpen, handleCloseModal }) => {
    const [email, setEmail] = useState("");
    const [invitedList, setInvitedList] = useState<string[]>([]);

    const handleShare = () => {
        if (email) {
            setInvitedList([...invitedList, email]);
            setEmail("");
        }
    };

    const removeInvite = (emailToRemove: string) => {
        setInvitedList(invitedList.filter(item => item !== emailToRemove));
    };

    return (
        <Modal open={isModalOpen} onClose={handleCloseModal}>
            <Modal.Body>
                <div className="modal-container">
                    <p className="modal-description"><b>Share</b> your board<br />
                        with an advisor,<br /> friends or family</p>
                    <div className="input-group-container">
                        <InputGroup inside size="lg" className="share-input">
                            <Input
                                value={email}
                                onChange={value => setEmail(value)}
                                placeholder="Enter email address"
                            />
                        </InputGroup>
                        <Button
                            onClick={handleShare}
                            className="share-button"
                        >
                            Share
                        </Button>
                    </div>
                    <hr></hr>
                    <div className="invited-list">
                        {invitedList.map((invited, index) => (
                            <Tag
                                key={index}
                                closable
                                onClose={() => removeInvite(invited)}
                            >
                                {invited}
                            </Tag>
                        ))}
                    </div>
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button onClick={handleCloseModal} appearance="subtle">
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ShareModal;
