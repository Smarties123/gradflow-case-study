// src/components/SettingsView/SettingsView.tsx
import React, { useState, useEffect } from 'react';
import {
  Drawer,
  FlexboxGrid,
  Divider,
  Form,
  Button,
  Checkbox,
  Col,
  Row,
  Grid,
  Panel
} from 'rsuite';
import { useNavigate } from 'react-router-dom';
import './SettingsView.less';
import { useUser } from '@/components/User/UserContext';
import DeleteModal from '../DeleteStatus/DeleteStatus';
import Avatar from 'react-avatar';
import { toast } from 'react-toastify';

// Custom hooks for counts
import { useBoardData } from '@/hooks/useBoardData';
import { useFileData } from '@/hooks/useFileData';

interface SettingsViewProps {
  show: boolean;
  onClose: () => void;
  initialTab?: 'account' | 'membership' | 'notifications';
}

const MAX_APPLICATIONS = 20;

const SettingsView: React.FC<SettingsViewProps> = ({
  show,
  onClose,
  initialTab = 'account'
}) => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [currentView, setCurrentView] = useState<string>(initialTab);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    promotionalEmails: false,
    applicationUpdates: false,
    weeklyUpdates: false,
    dailyUpdates: false
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Fetch profile on open
  useEffect(() => {
    if (!show) return;
    (async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/users/profile`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user.token}`
            }
          }
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        setFormData({
          name: data.Username,
          email: data.Email,
          promotionalEmails: data.PromotionalEmail || false,
          applicationUpdates: data.ApplicationEmail || false,
          weeklyUpdates: data.WeeklyUpdates || false,
          dailyUpdates: data.DailyUpdates || false
        });
      } catch (err) {
        console.error('Failed to fetch user data', err);
        toast.error('Could not load your settings.');
      }
    })();
  }, [show, user.token]);

  // Hooks for application & file counts
  const { columns } = useBoardData(user);
  const { files, loading: filesLoading } = useFileData();

  const totalApps = columns.reduce((sum, col) => sum + col.cards.length, 0);
  const cvCount = files.filter(f => f.fileType.toLowerCase() === 'cv').length;
  const clCount = files.filter(f =>
    f.fileType.toLowerCase().includes('letter')
  ).length;

  const percentApps = Math.min((totalApps / MAX_APPLICATIONS) * 100, 100);
  const percentCVs = filesLoading
    ? 0
    : Math.min((cvCount / MAX_APPLICATIONS) * 100, 100);
  const percentCLs = filesLoading
    ? 0
    : Math.min((clCount / MAX_APPLICATIONS) * 100, 100);


  // Form field updater
  const handleChange = (value: any, name: string) =>
    setFormData(prev => ({ ...prev, [name]: value }));

  // Save settings
  const handleSubmit = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users/profile`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify(formData)
        }
      );
      if (res.ok) {
        toast.success('Settings saved successfully');
        onClose();
      } else {
        const errText = await res.text();
        console.error(errText);
        toast.error('Failed to save settings');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while saving');
    }
  };

  // Change password nav
  const handleChangePassword = () => {
    toast.info('Redirecting to change password');
    navigate('/ForgotPassword');
  };

  // Delete account flow
  const handleDeleteAccount = async (reason: string) => {
    try {
      await fetch(
        `${process.env.REACT_APP_API_URL}/api/log-delete-account-reason`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify({
            userId: user.id,
            email: formData.email,
            name: formData.name,
            reason
          })
        }
      );
      const delRes = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users/profile`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          }
        }
      );
      if (delRes.ok) {
        toast.success('Your account has been deleted');
        navigate('/');
      } else {
        toast.error('Could not delete account');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while deleting');
    } finally {
      setDeleteModalOpen(false);
    }
  };


  const handleUpgrade = (plan: 'basic' | 'premium') => {
    // TODO: plug in your real upgrade flow
    toast.info(`Upgrade to ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`);
  };

  return (
    <>
      {!deleteModalOpen && (
        <Drawer open={show} onClose={onClose} size="sm">
          <Drawer.Header>
            <Drawer.Title>Settings</Drawer.Title>
            <FlexboxGrid justify="space-between" className="drawer-links">
              <FlexboxGrid.Item>
                <div>
                  {['account', 'membership', 'notifications'].map(tab => (
                    <React.Fragment key={tab}>
                      <a
                        onClick={() => setCurrentView(tab)}
                        className={currentView === tab ? 'active' : ''}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </a>
                      {tab !== 'notifications' && <Divider vertical />}
                    </React.Fragment>
                  ))}
                </div>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </Drawer.Header>

          <Drawer.Body>
            {currentView === 'account' && (
              <Form fluid>
                <h5 className="subject-title">Account Information</h5>
                <FlexboxGrid justify="center" align="middle" className="account-info">
                  <FlexboxGrid.Item>
                    <Avatar
                      email={formData.email}
                      name={formData.name}
                      size="100"
                      round
                    />
                  </FlexboxGrid.Item>
                </FlexboxGrid>

                <Form.Group controlId="name" className="form-group">
                  <h6>Name</h6>
                  <Form.Control
                    name="name"
                    value={formData.name}
                    onChange={value => handleChange(value, 'name')}
                    className="full-width"
                  />
                </Form.Group>

                <Form.Group controlId="email" className="form-group">
                  <h6>Email</h6>
                  <Form.Control
                    name="email"
                    value={formData.email}
                    onChange={value => handleChange(value, 'email')}
                    className="full-width"
                  />
                </Form.Group>

                <Button onClick={handleSubmit} appearance="primary" block>
                  Save Name & Email
                </Button>
                <Divider />

                <h5 className="subject-title">Change Password</h5>
                <Button onClick={handleChangePassword} appearance="default" block>
                  Change Password
                </Button>
                <Divider />

                <h5 className="subject-title delete-title">Delete Account</h5>
                <Button
                  appearance="primary"
                  block
                  style={{ backgroundColor: '#FF6200' }}
                  onClick={() => setDeleteModalOpen(true)}
                >
                  Delete Account
                </Button>
              </Form>
            )}

                        {currentView === 'membership' && (
              <div className="membership-tab">
                {/* Plans */}
                <h5 className="subject-title">Plans</h5>
                <FlexboxGrid justify="space-around" className="plan-grid">
                  <FlexboxGrid.Item componentClass={Col} colspan={12} md={12}>
                    <Panel className="plan-card basic" bordered>
                      <div className="plan-header">
                        <h5>Basic Plan</h5>
                        <p className="plan-price">
                          $0<span className="plan-frequency">/ month</span>
                        </p>
                      </div>
                      <ul className="plan-features">
                        <li>Up to {MAX_APPLICATIONS} applications / month</li>
                        <li>Unlimited CVs</li>
                        <li>Unlimited Cover Letters</li>
                        <li>Community support</li>
                      </ul>
                      <Button appearance="default" block disabled>
                        Current Plan
                      </Button>
                    </Panel>
                  </FlexboxGrid.Item>
                  <FlexboxGrid.Item componentClass={Col} colspan={12} md={12}>
                    <Panel className="plan-card premium" bordered>
                      <div className="plan-header">
                        <h5>Premium Plan</h5>
                        <p className="plan-price">
                          $19<span className="plan-frequency">/ month</span>
                        </p>
                      </div>
                      <ul className="plan-features">
                        <li>Unlimited applications</li>
                        <li>Unlimited CVs</li>
                        <li>Unlimited Cover Letters</li>
                        <li>Priority email support</li>
                        <li>1-on-1 onboarding call</li>
                      </ul>
                      <Button
                        appearance="primary"
                        block
                        onClick={() => handleUpgrade('premium')}
                      >
                        Upgrade
                      </Button>
                    </Panel>
                  </FlexboxGrid.Item>
                </FlexboxGrid>

                {/* Usage */}
                <h5 className="subject-title">Usage</h5>
                <div className="usage-bars">
                  <div className="usage-item">
                    <div className="usage-label">
                      <span>Applications</span>
                      <span>
                        {totalApps} / {MAX_APPLICATIONS}
                      </span>
                    </div>
                    <div className="liquid-bar">
                      <div
                        className="liquid-fill fill-apps"
                        style={{ width: `${percentApps}%` }}
                      />
                    </div>
                  </div>

                  <div className="usage-item">
                    <div className="usage-label">
                      <span>CVs</span>
                      <span>{filesLoading ? '…' : cvCount}</span>
                    </div>
                    <div className="liquid-bar">
                      <div
                        className="liquid-fill fill-cvs"
                        style={{ width: `${percentCVs}%` }}
                      />
                    </div>
                  </div>

                  <div className="usage-item">
                    <div className="usage-label">
                      <span>Cover Letters</span>
                      <span>{filesLoading ? '…' : clCount}</span>
                    </div>
                    <div className="liquid-bar">
                      <div
                        className="liquid-fill fill-cl"
                        style={{ width: `${percentCLs}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}


            {currentView === 'notifications' && (
              <Form fluid className="notifications-tab">
                <h5 className="subject-title">Email Preferences</h5>
                <Grid fluid>
                  <Row>
                    <Col xs={24}>
                      <Form.Group controlId="applicationUpdates" className="form-group">
                        <Checkbox
                          checked={!!formData.applicationUpdates}
                          onChange={(val, checked) =>
                            handleChange(checked, 'applicationUpdates')
                          }
                        >
                          <h6>Application Updates</h6>
                          <div className="form-note">
                            Receive updates about job applications, reminders, and deadlines.
                          </div>
                        </Checkbox>
                      </Form.Group>
                      <Form.Group controlId="promotionalEmails" className="form-group">
                        <Checkbox
                          checked={!!formData.promotionalEmails}
                          onChange={(val, checked) =>
                            handleChange(checked, 'promotionalEmails')
                          }
                        >
                          <h6>Promotional Content</h6>
                          <div className="form-note">
                            Get news about new features, tips, and promotions.
                          </div>
                        </Checkbox>
                      </Form.Group>
                    </Col>
                  </Row>
                </Grid>
                <Button
                  appearance="primary"
                  block
                  style={{ marginTop: 16 }}
                  onClick={handleSubmit}
                >
                  Save Preferences
                </Button>
              </Form>
            )}
          </Drawer.Body>
        </Drawer>
      )}

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onYes={handleDeleteAccount}
        onNo={() => setDeleteModalOpen(false)}
        showAccountReasons={true}
        title="Delete Account"
      />
    </>
  );
};

export default SettingsView;
