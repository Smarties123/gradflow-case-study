// src/components/Header/Header.tsx
import React, { useRef, useState, useContext, useEffect } from 'react';
import {
  Dropdown,
  Popover,
  Whisper,
  WhisperInstance,
  Stack,
  Button,
  ButtonToolbar
} from 'rsuite';
import HelpOutlineIcon from '@rsuite/icons/HelpOutline';
import ToggleColorMode from '../LandingPage/ToggleColorMode';
import { FaPlus } from 'react-icons/fa6';
import ShareModal from '../Share/Share';
import Modal from '../Modal/Modal';
import { BoardContext } from '../../pages/board/BoardContext';
import SettingsView from '../SettingsView/SettingsView';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@/components/User/UserContext';
import Avatar from 'react-avatar';
import Search from './Search';
import FeedbackPopup from '../Feedback/FeedbackPopup';
import AwesomeButton from '../../components/AwesomeButton/AwesomeButton';

const Header = (props) => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const context = useContext(BoardContext);
  if (!context) {
    console.error('BoardContext is undefined. Make sure you wrap with BoardProvider.');
  }
  const { setColumnOrder, columns, addCardToColumn } = context!;

  // State for settings drawer
  const [settingsTab, setSettingsTab] = useState<'account' | 'membership' | 'notifications'>('account');
  const [showSettings, setShowSettings] = useState(false);

  // Other UI state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);

  const { theme, onChangeTheme } = props;
  const trigger = useRef<WhisperInstance>(null);

  // Fetch user profile info once
  const [profileData, setProfileData] = useState({ email: '', name: '' });
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await res.json();
        setProfileData({ email: data.Email, name: data.Username });
        setColumnOrder(data.ColumnOrder);
      } catch (err) {
        console.error('Failed to fetch profile', err);
      }
    })();
  }, [user.token, setColumnOrder]);

  const handleOpenAddModal = () => setIsAddModalOpen(true);
  const handleCloseAddModal = () => setIsAddModalOpen(false);
  const handleOpenShareModal = () => setIsShareModalOpen(true);
  const handleCloseShareModal = () => setIsShareModalOpen(false);
  const handleOpenFeedback = () => setShowFeedbackPopup(true);
  const handleCloseFeedback = () => setShowFeedbackPopup(false);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  const renderAdminSpeaker = ({ onClose, left, top, className }: any, ref) => {
    const handleSelect = (eventKey: string) => {
      onClose();
      switch (eventKey) {
        case 'signout':
          return handleSignOut();
        case 'account':
          setSettingsTab('account');
          return setShowSettings(true);
        case 'membership':
          setSettingsTab('membership');
          return setShowSettings(true);
        default:
          return;
      }
    };

    return (
      <Popover ref={ref} className={className} style={{ left, top }} full>
        <Dropdown.Menu onSelect={handleSelect}>
          <Dropdown.Item panel style={{ padding: 10, width: 160 }}>
            <p>Signed in as</p>
            <strong>{profileData.name || 'User'}</strong>
          </Dropdown.Item>
          <Dropdown.Item divider />
          <Dropdown.Item eventKey="account">Profile &amp; account</Dropdown.Item>
          <Dropdown.Item onClick={handleOpenFeedback}>Feedback</Dropdown.Item>
          <Dropdown.Item divider />
          <Dropdown.Item eventKey="membership">Settings</Dropdown.Item>
          <Dropdown.Item eventKey="signout">Sign out</Dropdown.Item>
        </Dropdown.Menu>
      </Popover>
    );
  };

  return (
    <Stack className="header" spacing={8} justifyContent="space-between">
      {location.pathname === '/main' && (
        <Stack direction="row" spacing={4} alignItems="flex-start">
          <Search />
          <div className="flex flex-col items-center justify-center w-screen h-screen gap-6">
            <ButtonToolbar style={{ display: 'flex', gap: '3px', height: '40px' }}>
              <AwesomeButton className="header-add-new" onClick={handleOpenAddModal}>
                <FaPlus style={{ color: 'white', paddingTop: '3px' }} />
                <span className="visually-hidden">Add New</span>
              </AwesomeButton>
            </ButtonToolbar>
          </div>
          <Modal
            isOpen={isAddModalOpen}
            onClose={handleCloseAddModal}
            columns={columns}
            addCardToColumn={addCardToColumn}
            showDropdown={true}
          />
          <ShareModal isModalOpen={isShareModalOpen} handleCloseModal={handleCloseShareModal} />
          <FeedbackPopup show={showFeedbackPopup} onClose={handleCloseFeedback} />
        </Stack>
      )}


      {location.pathname === '/main/table' && (
        <h4 className="font-semibold text-gray-700 items-center justify-center w-screen h-screen gap-6" style={{ paddingTop: '5px', marginLeft: '-10px' }}>
          View All Job Applications
        </h4>
      )}

      {location.pathname === '/main/files' && (
        <h4 className="font-semibold text-gray-700 items-center justify-center w-screen h-screen gap-6" style={{ paddingTop: '5px' }}   >
          Upload/Manage your CVs and Cover Letters
        </h4>
      )}
      {location.pathname === '/main/dashboard' && (
        <h4 className="font-semibold text-gray-700 items-center justify-center w-screen h-screen gap-6" style={{ paddingTop: '5px' }}   >
          Your Dashboard - Track your Progress and Stats
        </h4>
      )}
      <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
        {/* <ToggleColorMode
          mode={theme === 'light' ? 'light' : 'dark'}
          toggleColorMode={() => onChangeTheme(theme === 'light' ? 'dark' : 'light')}
        /> */}
        <Whisper placement="bottomEnd" trigger="click" ref={trigger} speaker={renderAdminSpeaker}>
          <Avatar email={profileData.email} name={profileData.name} size="45" round />
        </Whisper>
      </div>

      {showSettings && (
        <SettingsView
          show={showSettings}
          onClose={() => {
            setShowSettings(false);
            navigate('/main', { replace: true });
          }}
          initialTab={settingsTab}
        />
      )}
    </Stack>
  );
};

export default Header;
