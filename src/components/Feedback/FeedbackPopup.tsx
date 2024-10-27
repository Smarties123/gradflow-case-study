import React from 'react';
import { Modal, Button } from 'rsuite';
import { FaDiscord, FaWhatsapp } from 'react-icons/fa';

import './FeedbackPopup.less';

const FeedbackPopup: React.FC<{ show: boolean; onClose: () => void }> = ({ show, onClose }) => {
  return (
    <Modal
      open={show}
      onClose={onClose}
      size="md"
      backdrop="true" // Enables closing on outside click
      className="feedback-popup"
    >
      <Modal.Header>
        <Modal.Title>Feedback </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSf9mml8GbC5HsctSGR4f9UF54Hy89K4Oy5LVzRuW5m3F2fnMw/viewform?embedded=true"
          width="100%"
          height="500"
          frameBorder="0"
        // marginHeight={0}
        // marginWidth={0}
        // title="Feedback Form"
        >
          Loading…
        </iframe>
      </Modal.Body>
      <Modal.Footer>
        <Button
          appearance="ghost"
          color="blue"
          onClick={() => window.open('https://discord.gg/your-discord-link')}
        >
          <FaDiscord style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Join Discord Community
        </Button>
        <Button
          appearance="ghost"
          color="green"
          onClick={() => window.open('https://chat.whatsapp.com/your-whatsapp-link')}
        >
          <FaWhatsapp style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Join WhatsApp Community
        </Button>
      </Modal.Footer>
      {/* Close button at the bottom right */}
      {/* <Button className="close-button" onClick={onClose}>
        Close
      </Button> */}
    </Modal>
  );
};

export default FeedbackPopup;
