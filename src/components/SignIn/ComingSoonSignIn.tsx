import React from 'react';
import { Button} from 'rsuite';
import * as errors from '@/images/errors';
import './ComingSoonSignIn.less';

const ComingSoonSignIn = ({ onClose }) => (
  <div className="coming-soon-container">
    <img src={errors['Error404Img']} alt="Coming Soon" />
    <h3 className="coming-soon-message-heading">
      Coming Soon!
    </h3>
    <p className="coming-soon-message-text">
      The Sign In with University feature is coming soon! We're hard at work creating exciting new features. Stay tuned for updates!
    </p>
    <Button
      appearance="primary"
      color="cyan"
      onClick={onClose}
      className="coming-soon-close-button"
    >
      Close
    </Button>
  </div>
);
export default ComingSoonSignIn;
