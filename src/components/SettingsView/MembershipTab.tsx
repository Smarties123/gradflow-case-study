import React, { useState } from 'react';
import { FlexboxGrid, Col, Panel, Button, Tag, Modal } from 'rsuite';

interface Props {
  totalApps: number;
  cvCount: number;
  clCount: number;
  percentApps: number;
  percentCVs: number;
  percentCLs: number;
  filesLoading: boolean;
  onUpgrade: (plan: 'basic' | 'premium') => void;
  onDowngrade: () => void;
  member: boolean;
  appsGoal?: number; // rolling target for premium incentive
}

const MAX_APPLICATIONS = 20;

const MembershipTab: React.FC<Props> = ({
  totalApps,
  cvCount,
  clCount,
  percentApps,
  percentCVs,
  percentCLs,
  filesLoading,
  onUpgrade,
  onDowngrade,
  member = false,
  appsGoal,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleDowngradeClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmDowngrade = () => {
    setShowConfirmModal(false);
    onDowngrade();
  };
  const planDetails = member
    ? {
      title: 'Premium Plan',
      tag: <Tag color="orange">Premium Member</Tag>,
      features: [
        'Unlimited application tracking',
        'Comprehensive dashboard analytics',
        'Unlimited CVs & Cover Letters',
        'Customizable enhanced email notifications',
        'Assign up to 5 applications to a CV/CL',
      ],
    }
    : {
      title: 'Standard Plan',
      tag: <Tag color="green">Free Plan</Tag>,
      features: [
        'Track up to 20 active applications',
        'Access to basic dashboards',
        'Store up to 5 CVs, including Cover Letters',
        'Standard email notifications',
      ],
    };

  return (
    <div className="membership-tab">
      {/* ───────────── USAGE ───────────── */}
      <h5 className="subject-title">Usage</h5>
      <div className="usage-bars">
        {[
          {
            label: 'Applications',
            count: totalApps,
            percent: percentApps,
            fillClass: 'fill-apps',
          },
          {
            label: 'CVs',
            count: filesLoading ? '…' : cvCount,
            percent: percentCVs,
            fillClass: 'fill-cvs',
          },
          {
            label: 'Cover Letters',
            count: filesLoading ? '…' : clCount,
            percent: percentCLs,
            fillClass: 'fill-cl',
          },
        ].map((item) => (
          <div className="usage-item" key={item.label}>
            <div className="usage-label">
              <span>{item.label}</span>
              <span>
                {item.count}
                {item.label === 'Applications'
                  ? ` / ${member ? '∞' : MAX_APPLICATIONS}`
                  : ''}
              </span>
            </div>
            <div className="liquid-bar">
              <div
                className={`liquid-fill ${item.fillClass}`}
                style={{ width: `${item.percent}%` }}
              />
            </div>
            {item.label === 'Applications' && member && (
              <div className="usage-tip">
                Next milestone: {appsGoal ?? MAX_APPLICATIONS} applications — keep going!
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ───────────── CURRENT PLAN ───────────── */}
      <h5 style={{ paddingTop: '30px' }} className="subject-title">
        Your Plan
      </h5>

      <div className="current-plan-row">
        <div className="col-span-16">
          <Panel bordered className={`plan-card ${member ? 'premium' : 'basic'}`}>
            <h6 style={{ marginBottom: 5 }}>{planDetails.title}</h6>
            {planDetails.tag}
            <ul style={{ paddingLeft: 16, paddingTop: 10 }}>
              {planDetails.features.map((f, idx) => (
                <li key={idx}>{f}</li>
              ))}
            </ul>
          </Panel>
        </div>
        {!member ? (
          <div>
            <Button style={{ width: '-webkit-fill-available' }} appearance="primary" onClick={() => onUpgrade('premium')}>
              Upgrade To Premium
            </Button>
          </div>
        ) : (
          <div>
              <Button style={{ width: '-webkit-fill-available' }} appearance="ghost" onClick={handleDowngradeClick}>
              Downgrade to Standard
            </Button>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <Modal open={showConfirmModal} onClose={() => setShowConfirmModal(false)} size="xs">
        <Modal.Header>
          <Modal.Title>Confirm Downgrade</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to downgrade to the Standard plan?</p>
          <p>You will lose access to premium features including:</p>
          <ul>
            <li>Unlimited application tracking</li>
            <li>Comprehensive dashboard analytics</li>
            <li>Unlimited CVs & Cover Letters</li>
            <li>Enhanced email notifications</li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowConfirmModal(false)} appearance="subtle">
            Cancel
          </Button>
          <Button onClick={handleConfirmDowngrade} appearance="primary" color="red">
            Yes, Downgrade
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MembershipTab;
