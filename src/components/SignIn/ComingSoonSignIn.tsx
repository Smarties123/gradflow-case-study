import React from 'react';
import * as errors from '@/images/errors';
import './ComingSoonSignIn.less';

const ComingSoonSignIn = () => (
  <div className="coming-soon-page">
    <div className="item">
      <img src={errors['Error404Img']} alt="Coming Soon" />
      <div className="text">
        <h3 className="coming-soon-message">
          The Sign In with university feature is coming soon! We're hard at work creating exciting new features. Stay tuned for updates!
        </h3>
      </div>
    </div>
  </div>
);

export default ComingSoonSignIn;
