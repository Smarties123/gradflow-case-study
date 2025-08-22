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
          {/* Pricing Sections */}
          <div className="pricing-container">
            <div
              className={`pricing-section ${selectedPlan === 'monthly' ? 'selected' : ''}`}
              onClick={() => setSelectedPlan('monthly')}
            >
              <div className="pricing-header">
                <h3 className="pricing-title">Monthly</h3>
                {selectedPlan === 'monthly' && (
                  <div className="selected-indicator">
                    <Check size={16} />
                  </div>
                )}
              </div>
              <div className="pricing-price">
                £2.99
                {/* <span className="pricing-period">/month</span> */}
              </div>
            </div>

            <div className="pricing-divider"></div>

            <div
              className={`pricing-section ${selectedPlan === 'yearly' ? 'selected' : ''}`}
              onClick={() => setSelectedPlan('yearly')}
            >
              <div className="pricing-header">
                <h3 className="pricing-title">Yearly</h3>
                {selectedPlan === 'yearly' && (
                  <div className="selected-indicator">
                    <Check size={16} />
                  </div>
                )}
              </div>
              <div className="pricing-price">
                £30.00
                {/* <span className="pricing-period">/year</span> */}
              </div>
              <div className="pricing-savings">Save £5.88!</div>
            </div>
          </div>

          {/* Features */}
          <div className="feature-list-container">
            <h3 className="feature-heading">
              <Zap className="feature-zap-icon" size={20} />
              What you&apos;ll get:
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