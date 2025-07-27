// src/components/SettingsView/SettingsView.tsx
import React, { useState, useEffect } from 'react';
import { Drawer, FlexboxGrid, Divider } from 'rsuite';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import './SettingsView.less';
import { useUser } from '@/components/User/UserContext';
import DeleteModal from '../DeleteStatus/DeleteStatus';

import { useBoardData } from '@/hooks/useBoardData';
import { useFileData } from '@/hooks/useFileData';

import AccountTab, { SettingsFormData } from './AccountTab';
import MembershipTab from './MembershipTab';
import NotificationsTab from './NotificationsTab';
import { notifySuccess, notifyError } from '@/App';

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

  const [currentView, setCurrentView] = useState(initialTab);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [formData, setFormData] = useState<SettingsFormData>({
    name: '',
    email: '',
    promotionalEmails: false,
    applicationUpdates: false,
    weeklyUpdates: false,
    dailyUpdates: false
  });

  // fetch profile on open
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
        if (!res.ok) throw new Error('Fetch failed');
        const data = await res.json();
        setFormData({
          name: data.Username,
          email: data.Email,
          promotionalEmails: data.PromotionalEmail ?? false,
          applicationUpdates: data.ApplicationEmail ?? false,
          weeklyUpdates: data.WeeklyUpdates ?? false,
          dailyUpdates: data.DailyUpdates ?? false
        });
      } catch (err) {
        console.error(err);
        notifyError('Could not load your settings.');
      }
    })();
  }, [show, user.token]);

  useEffect(() => {
    if (show) setCurrentView('account');
  }, [show]);

  // counts hooks
  const { columns } = useBoardData(user);
  const { files, loading: filesLoading } = useFileData();

  const totalApps = columns.reduce((sum, c) => sum + c.cards.length, 0);
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

  // handlers
  const handleChange = (value: any, name: keyof SettingsFormData) =>
    setFormData(prev => ({ ...prev, [name]: value }));

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
      if (!res.ok) throw new Error(await res.text());
      notifySuccess('Settings saved successfully');
      onClose();
    } catch (err) {
      console.error(err);
      notifyError('Failed to save settings');
    }
  };

  const handleChangePassword = () => {
    toast.info('Redirecting to change password');
    navigate('/ForgotPassword');
  };

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
      if (!delRes.ok) throw new Error('Delete failed');
      notifySuccess('Your account has been deleted');
      navigate('/');
    } catch (err) {
      console.error(err);
      notifyError('Could not delete account');
    } finally {
      setDeleteModalOpen(false);
    }
  };

  const handleUpgrade = (plan: 'basic' | 'premium') => {
    toast.info(`Upgrade to ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`);
  };

  return (
    <>
      {!deleteModalOpen && (
        <Drawer open={show} onClose={onClose} size="sm">
          <Drawer.Header>
            <Drawer.Title>Settings</Drawer.Title>
            <FlexboxGrid justify="space-between" className="drawer-links">
              {['account', 'membership', 'notifications'].map(tab => (
                <React.Fragment key={tab}>
                  <a
                    onClick={() => setCurrentView(tab as any)}
                    className={currentView === tab ? 'active' : ''}
                  >
                    {tab[0].toUpperCase() + tab.slice(1)}
                  </a>
                  {tab !== 'notifications' && <Divider vertical />}
                </React.Fragment>
              ))}
            </FlexboxGrid>
          </Drawer.Header>
          <Drawer.Body>
            {currentView === 'account' && (
              <AccountTab
                formData={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
                onChangePassword={handleChangePassword}
                onDeleteClick={() => setDeleteModalOpen(true)}
              />
            )}
            {currentView === 'membership' && (
              <MembershipTab
                totalApps={totalApps}
                cvCount={cvCount}
                clCount={clCount}
                percentApps={percentApps}
                percentCVs={percentCVs}
                percentCLs={percentCLs}
                filesLoading={filesLoading}
                onUpgrade={handleUpgrade}
              />
            )}
            {currentView === 'notifications' && (
              <NotificationsTab
                formData={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
              />
            )}
          </Drawer.Body>
        </Drawer>
      )}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onYes={handleDeleteAccount}
        onNo={() => setDeleteModalOpen(false)}
        showAccountReasons
        title="Delete Account"
      />
    </>
  );
};

export default SettingsView;
