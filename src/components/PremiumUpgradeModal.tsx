import React, { useState } from 'react';
import { X, Star, Check, Zap } from 'lucide-react';
import './PremiumUpgradeModal.css';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
}

export const PremiumUpgradeModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  featureName = 'this premium feature'
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

  if (!isOpen) return null;

  const premiumFeatures = [
    'Comprehensive dashboard analytics and insights',
    'Unlimited CVs & Cover Letters',
    'Enhanced email notifications with customization options',
    'Assign up to 5 applications to a CV / CL'
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <button onClick={onClose} className="modal-close-button">
            <X size={20} />
          </button>

          <div className="modal-header-content">
            <div className="modal-icon-wrapper">
              <Star className="modal-star-icon" size={24} />
            </div>
            <h2 className="modal-title">Upgrade to Premium</h2>
          </div>

          <p className="modal-subtitle">
            You've reached the application limit. Unlock {featureName} and more with GradFlow Premium.
          </p>
        </div>

        {/* Content */}
        <div className="modal-content" id="upgrade-modal">
          {/* Plan Toggle Button */}
          <button 
            onClick={() => setSelectedPlan(selectedPlan === 'monthly' ? 'yearly' : 'monthly')}
            className="plan-switch-button"
          >
            {selectedPlan === 'monthly' ? 'Switch to Yearly' : 'Switch to Monthly'}
          </button>

          {/* Pricing */}
          <div className="pricing-info">
            <div className="pricing-price">
              £{selectedPlan === 'monthly' ? '2.99' : '30.00'}
              <span className="pricing-period">
                /{selectedPlan === 'monthly' ? 'month' : 'year'}
              </span>
            </div>
            {/* {selectedPlan === 'yearly' && (
              <p className="pricing-savings">Save £17.99 annually!</p>
            )} */}
          </div>

          {/* Features */}
          <div className="feature-list-container">
            <h3 className="feature-heading">
              <Zap className="feature-zap-icon" size={20} />
              What you'll get:
            </h3>
            <div className="feature-list">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="feature-item">
                  <Check className="feature-check-icon" size={16} />
                  <span className="feature-text">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="cta-buttons-container">
            <button className="cta-upgrade-button">
              Upgrade to Premium
            </button>
          </div>

          {/* Trust indicators */}
          <div className="trust-indicators">
            <p className="trust-text">
              ✓ Cancel anytime • ✓ 14-day money-back guarantee • ✓ Secure payment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};