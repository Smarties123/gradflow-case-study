// src/components/SettingsView/comingsoon.tsx
import React from 'react';
import * as errors from '@/images/errors';          // ✅ keep your central error/illustration import
import './ComingSoonMembership.less';               // 👉 create or reuse styling as you did for sign-up

/**
 * A simple, reusable placeholder shown while membership plans
 * are still under construction.
 */
const ComingSoonMembership: React.FC = () => (
  <div className="coming-soon-page">
    <div className="item">
      {/* You already have Error404Img in your image bundle – reuse it */}
      <img src={errors['Error404Img']} alt="Membership coming soon" />
      <div className="text">
        <h3 className="coming-soon-message">
          Our paid membership plans are nearly ready! <br />
          We’re polishing features and will launch very soon. <br />
          Stay tuned ✨
        </h3>
      </div>
    </div>
  </div>
);

export default ComingSoonMembership;
