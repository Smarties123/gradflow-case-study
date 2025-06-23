import React, { useState } from 'react';
import { Modal, Button, Form, RadioGroup, Radio } from 'rsuite';

interface DeleteButtonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (reason: string) => void;
}

const reasonOptions = [
  { label: 'Found a job', value: 'Found a job' },
  { label: 'Too expensive', value: 'Too expensive' },
  { label: 'Not using it enough', value: 'Not using it enough' },
  { label: 'Prefer another tool', value: 'Prefer another tool' },
  { label: 'Other…', value: 'Other' }
];

const DeleteButtonModal: React.FC<DeleteButtonModalProps> = ({ isOpen, onClose, onDelete }) => {
  const [reason, setReason] = useState<string>('');
  const [otherText, setOtherText] = useState<string>('');

  const handleDelete = () => {
    const finalReason = reason === 'Other' ? otherText.trim() || 'Other' : reason;
    onDelete(finalReason);
  };

  return (
    <Modal open={isOpen} onClose={onClose} size="xs">
      <Modal.Header>
        <Modal.Title>Delete Account</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>This action cannot be undone. Please tell us why you’re leaving:</p>
        <Form fluid>
          <Form.Group>
            <RadioGroup
              name="deleteReason"
              inline
              onChange={(val: string) => setReason(val)}
              value={reason}
            >
              {reasonOptions.map(opt => (
                <Radio key={opt.value} value={opt.value}>
                  {opt.label}
                </Radio>
              ))}
            </RadioGroup>
          </Form.Group>
          {reason === 'Other' && (
            <Form.Group>
              <Form.Control
                name="otherReason"
                placeholder="Your reason"
                value={otherText}
                onChange={(val: string) => setOtherText(val)}
              />
            </Form.Group>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={handleDelete}
          appearance="primary"
          disabled={!reason || (reason === 'Other' && !otherText.trim())}
          style={{ backgroundColor: '#FF6200' }}
        >
          Delete
        </Button>
        <Button onClick={onClose} appearance="subtle">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteButtonModal;
