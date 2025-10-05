import React from 'react';
import { X, Check, Sparkles, Crown, Zap } from 'lucide-react';
import './WelcomeToPremiumModal.less';

interface WelcomeToPremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeToPremiumModal: React.FC<WelcomeToPremiumModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const premiumFeatures = [
     'Unlimited Application Tracking',
    'Comprehensive dashboard analytics and insights',
    'Unlimited CVs & Cover Letters',
    'Assign up to 5 applications to a CV/CL'
  ];

  return (
    <div className="welcome-modal-overlay">
      <div className="welcome-modal-container">
        {/* Header */}
        <div className="welcome-modal-header">
          <button onClick={onClose} className="welcome-modal-close-button">
            <X size={20} />
          </button>

          <div className="welcome-modal-header-content">
            <div className="welcome-modal-icon-wrapper">
              <Crown className="welcome-modal-crown-icon" size={32} />
              <Sparkles className="welcome-modal-sparkles-icon" size={16} />
            </div>
            <h2 className="welcome-modal-title">Welcome to Premium! 🎉</h2>
          </div>

          <p className="welcome-modal-subtitle">
            Thank you for upgrading! You now have access to all premium features.
          </p>
        </div>

        {/* Content */}
        <div className="welcome-modal-content">
          {/* Features List */}
          <div className="welcome-feature-list-container">
            <h3 className="welcome-feature-heading">
              <Zap className="welcome-feature-zap-icon" size={20} />
              Your premium benefits:
            </h3>
            <div className="welcome-feature-list">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="welcome-feature-item">
                  <Check className="welcome-feature-check-icon" size={16} />
                  <span className="welcome-feature-text">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="welcome-cta-buttons-container">
            <button
              className="welcome-cta-button"
              onClick={onClose}
            >
              Start Using Premium Features
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};