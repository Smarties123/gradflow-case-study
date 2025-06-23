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
  Grid
} from 'rsuite';
import { useNavigate } from 'react-router-dom';
import './SettingsView.less';
import { useUser } from '@/components/User/UserContext';
import DeleteAccountModal from './DeleteAccountModal';
import Avatar from 'react-avatar';

const SettingsView = ({ show, onClose, initialTab = 'account' }) => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [currentView, setCurrentView] = useState(initialTab);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    promotionalEmails: false,
    applicationUpdates: false,
    weeklyUpdates: false,
    dailyUpdates: false
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Fetch the user’s profile when the drawer opens
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
      }
    })();
  }, [show, user.token]);

  // Sync tab if parent changes initialTab
  useEffect(() => {
    if (show && initialTab) {
      setCurrentView(initialTab);
    }
  }, [show, initialTab]);

  // Generic form‐field updater
  const handleChange = (value, name) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Save name/email & notification prefs
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
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            promotionalEmails: formData.promotionalEmails,
            applicationUpdates: formData.applicationUpdates,
            weeklyUpdates: formData.weeklyUpdates,
            dailyUpdates: formData.dailyUpdates
          })
        }
      );
      if (res.ok) {
        console.log('User data updated successfully');
        onClose();
      } else {
        console.error('Failed to update user details');
      }
    } catch (err) {
      console.error('Error updating user details', err);
    }
  };

  // Navigate to password‐reset flow
  const handleChangePassword = () => {
    navigate('/ForgotPassword');
  };

  // The new delete flow: log reason → delete account → navigate away
  const handleDeleteAccount = async (reason: string) => {
    try {
      // 1) Log the reason
      const logRes = await fetch(
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
      if (!logRes.ok) {
        console.error('Failed to log deletion reason', await logRes.text());
      }

      // 2) Delete the account
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
      if (!delRes.ok) {
        console.error('Failed to delete account', await delRes.text());
      } else {
        console.log('Account deleted successfully');
        navigate('/');
      }
    } catch (err) {
      console.error('Error in delete flow', err);
    } finally {
      setDeleteModalOpen(false);
    }
  };

  return (
    <>
      <Drawer open={show} onClose={onClose} size="sm">
        <Drawer.Header>
          <Drawer.Title>Settings</Drawer.Title>
          <FlexboxGrid justify="space-between" className="drawer-links">
            <FlexboxGrid.Item>
              <div>
                <a
                  onClick={() => setCurrentView('account')}
                  className={currentView === 'account' ? 'active' : ''}
                >
                  Account
                </a>
                <Divider vertical />
                <a
                  onClick={() => setCurrentView('membership')}
                  className={currentView === 'membership' ? 'active' : ''}
                >
                  Membership
                </a>
                <Divider vertical />
                <a
                  onClick={() => setCurrentView('notifications')}
                  className={currentView === 'notifications' ? 'active' : ''}
                >
                  Notifications
                </a>
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
                <Form.ControlLabel>Name</Form.ControlLabel>
                <Form.Control
                  name="name"
                  value={formData.name}
                  onChange={value => handleChange(value, 'name')}
                  className="full-width"
                />
              </Form.Group>

              <Form.Group controlId="email" className="form-group">
                <Form.ControlLabel>Email</Form.ControlLabel>
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
              <Button onClick={handleChangePassword} appearance="primary" block>
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
              <h5 className="subject-title">Current Plan</h5>
              <Grid fluid>
                <Row>
                  <Col xs={24}>
                    <div className="membership-plan">
                      <div className="plan-header">
                        <h5>Basic Plan</h5>
                        <p>$0 per month</p>
                      </div>
                      <p className="plan-description">
                        You have a GradFlow Basic subscription. Upgrade your plan by clicking the
                        button below.
                      </p>
                      <Button appearance="primary" block>
                        Upgrade
                      </Button>
                    </div>
                  </Col>
                </Row>
                <Divider />
                <Row>
                  <Col xs={24}>
                    <div className="usage-section">
                      <h5 className="subject-title">Usage</h5>
                      <p>
                        <strong>Jobs:</strong> 0 of 20
                      </p>
                      <p>
                        <strong>Data:</strong> 0
                      </p>
                      <p>
                        <strong>Documents:</strong> 0
                      </p>
                    </div>
                  </Col>
                </Row>
              </Grid>
            </div>
          )}

          {currentView === 'notifications' && (
            <Form fluid className="notifications-tab">
              <h5 className="subject-title">Email Subscriptions</h5>
              <Grid fluid>
                <Row>
                  <Col xs={24}>
                    <Form.Group controlId="applicationUpdates" className="form-group">
                      <Form.ControlLabel>Application Updates</Form.ControlLabel>
                      <Checkbox
                        checked={!!formData.applicationUpdates}
                        onChange={(val, checked) =>
                          handleChange(checked, 'applicationUpdates')
                        }
                      />
                    </Form.Group>
                    <Form.Group controlId="promotionalContent" className="form-group">
                      <Form.ControlLabel>Promotional Content</Form.ControlLabel>
                      <Checkbox
                        checked={!!formData.promotionalEmails}
                        onChange={(val, checked) =>
                          handleChange(checked, 'promotionalEmails')
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Grid>
              <Button appearance="primary" block onClick={handleSubmit}>
                Save Changes
              </Button>
            </Form>
          )}
        </Drawer.Body>
      </Drawer>

      <DeleteAccountModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleDeleteAccount}
      />
    </>
  );
};

export default SettingsView;
