import React from 'react';
import { Modal, Button } from 'rsuite';
import { FaDiscord, FaWhatsapp } from 'react-icons/fa';

import './FeedbackPopup.less';

const OnDemandFeedbackPopup: React.FC<{ show: boolean; onClose: () => void }> = ({ show, onClose }) => {
  return (
    <Modal
      open={show}
      onClose={onClose}
      size="md"
      backdrop={true} // Enables closing on outside click
      className="feedback-popup"
    >
      <Modal.Body>
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSdwUqo5WWBf7u0N-gA1HaGptiOrVk_5wEaBxQB0Lp3QD1i6Qw/viewform?embedded=true"
          width="100%"
          height="500"
          frameBorder="0"
        >
        </iframe>
      </Modal.Body>
      <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexGrow: 1, flexWrap: 'wrap', marginLeft: '35px' }}>
          <Button
            appearance="ghost"
            color="blue"
            onClick={() => window.open('https://discord.gg/b8KVbKqPDZ')}
            style={{ marginRight: '8px' }}
          >
            <FaDiscord style={{ marginRight: '4px', verticalAlign: 'text-top' }} />
            Join Discord Community
          </Button>
          <Button
            appearance="ghost"
            color="green"
            onClick={() => window.open('https://chat.whatsapp.com/JU6wzPwffwyIWKhwdnl79Z')}
            style={{ marginLeft: '8px' }}
          >
            <FaWhatsapp style={{ marginRight: '4px', verticalAlign: 'text-top' }} />
            Join WhatsApp Community
          </Button>
        </div>
        {/* Close button at the bottom right */}
        <Button onClick={onClose} appearance="subtle">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OnDemandFeedbackPopup;
