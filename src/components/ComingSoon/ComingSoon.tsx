import React from 'react';
import * as errors from '@/images/errors';
import './ComingSoon.less';

const ComingSoon = ({ code = 404 }) => (
  <div className="coming-soon-page">
    <div className="item">
      <img src={errors[`Error${code}Img`]} alt="Coming Soon" />
      <div className="text">
        <h3 className="coming-soon-message">
          We're hard at work creating exciting new features for the website. Stay tuned for updates!
        </h3>
      </div>
    </div>
  </div>
);

export default ComingSoon;
