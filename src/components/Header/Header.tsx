import React, { useRef, useState, useContext, useEffect } from 'react';
import {
  Dropdown,
  Popover,
  Whisper,
  WhisperInstance,
  Stack,
  Badge,
  List,
  Button,
  ButtonToolbar,
  Input,
  InputGroup
} from 'rsuite';
import HelpOutlineIcon from '@rsuite/icons/HelpOutline';
import ToggleColorMode from '../LandingPage/ToggleColorMode'; // Import the ToggleColorMode component
import { FaRegShareSquare } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa6';
import { FaSearch } from 'react-icons/fa';
import ShareModal from '../Share/Share';
import Modal from '../Modal/Modal';
import { BoardContext } from '../../pages/board/BoardContext';
import SettingsView from '../SettingsView/SettingsView.tsx';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation and useNavigate hooks
import { GiUpgrade } from 'react-icons/gi';
import { CgDetailsMore } from 'react-icons/cg';
import { useUser } from '@/components/User/UserContext';
import Avatar from 'react-avatar';
import Search from './Search'; // Import Search component


const Header = props => {
  const { user, setUser } = useUser(); // Access user and setUser to clear user info on sign out
  const navigate = useNavigate(); // Use navigate for redirection after sign out
  const [formData, setFormData] = useState({ email: '', name: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${user.token}`, // Ensure you have a valid token
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        setFormData({ email: data.Email, name: data.Username }); // Make sure to use correct case for `Email` and `Username`
      } catch (error) {
        console.error('Failed to fetch user data', error);
      }
    };
    fetchUserData();
  }, [user.token]);

  const context = useContext(BoardContext);
  if (!context) {
    console.error(
      'BoardContext is undefined. Ensure BoardProvider is correctly wrapping the component.'
    );
  }

  const { columns, setColumns, addCardToColumn } = context;
  const location = useLocation();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [invitedList, setInvitedList] = useState([]);
  const [showSettings, setShowSettings] = useState(false);

  const { theme, onChangeTheme } = props;
  const trigger = useRef<WhisperInstance>(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleSignOut = () => {
    // Clear token (if stored in localStorage or sessionStorage)
    localStorage.removeItem('token');
    // Clear user data in context
    setUser(null);
    // Redirect to login page
    navigate('/');
  };

  const renderAdminSpeaker = ({ onClose, left, top, className }: any, ref) => {
    const handleSelect = eventKey => {
      onClose();
      if (eventKey === 'signout') {
        handleSignOut(); // Handle sign out when "Sign out" is selected
      } else if (eventKey === 'settings') {
        setShowSettings(true); // Show settings view when "Settings" is selected
      }
    };

    return (
      <Popover ref={ref} className={className} style={{ left, top }} full>
        <Dropdown.Menu onSelect={handleSelect}>
          <Dropdown.Item panel style={{ padding: 10, width: 160 }}>
            <p>Signed in as</p>
            <strong>{formData.name ? formData.name : 'User'}</strong>
          </Dropdown.Item>
          <Dropdown.Item divider />
          <Dropdown.Item eventKey="settings">Profile & account</Dropdown.Item>
          <Dropdown.Item as="a" href="https://forms.gle/TzuxcFinXXdRzRZQ8" target="_blank">
            Feedback
          </Dropdown.Item>
          <Dropdown.Item divider />
          <Dropdown.Item eventKey="settings">Settings</Dropdown.Item>
          <Dropdown.Item eventKey="signout">Sign out</Dropdown.Item> {/* Add sign out option */}
          <Dropdown.Item
            icon={<HelpOutlineIcon />}
            href="https://rsuitejs.com"
            target="_blank"
            as="a"
          >
            Help
          </Dropdown.Item>
        </Dropdown.Menu>
      </Popover>
    );
  };

  const isDashboardPage = location.pathname === '/main/dashboard';

  return (
    <Stack className="header" spacing={8} justifyContent="space-between">
      <Stack direction="row" spacing={4} alignItems="flex-start">
        <Search /> {/* Include the Search component here */}

          <div style={{ alignItems: 'left' }}>
            <ButtonToolbar style={{ display: 'flex', gap: '3px', height: '40px' }}>
              <Button
                className="header-button"
                style={{
                  backgroundColor: '#8338ec',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  width: '120px',
                  lineHeight: '24px'
                }}
                onClick={handleOpenAddModal}
              >
                <FaPlus
                  className="header-icon"
                  style={{ fontSize: 18, color: 'white', margin: '1px 1px 1px 1px' }}
                />
                <span className="visually-hidden">Add New</span>
              </Button>
              <Button
                className="header-button"
                style={{
                  backgroundColor: '#ff6200',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  width: '120px',
                  lineHeight: '24px'
                }}
                onClick={handleOpenModal}
              >
                <FaRegShareSquare
                  className="header-icon"
                  style={{ fontSize: 18, margin: '1px 1px 1px 1px' }}
                />
                <span className="visually-hidden">Share</span>
              </Button>
            </ButtonToolbar>
          </div>
        {/* )} */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={handleCloseAddModal}
          columns={columns}
          addCardToColumn={addCardToColumn}
          showDropdown={true}
        />
        <ShareModal isModalOpen={isModalOpen} handleCloseModal={handleCloseModal} />
      </Stack>

      <div
        className="user-profile"
        style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
      >
        <ToggleColorMode
          mode={theme === 'light' ? 'light' : 'dark'}
          toggleColorMode={() => onChangeTheme(theme === 'light' ? 'dark' : 'light')}
        />
        <Whisper placement="bottomEnd" trigger="click" ref={trigger} speaker={renderAdminSpeaker}>
          <Avatar email={formData.email} name={formData.name} size="45" round={true} />
        </Whisper>
      </div>
      {showSettings && (
        <SettingsView
          show={showSettings}
          onClose={() => setShowSettings(false)}
          card={{}}
          updateCard={() => {}}
        />
      )}
    </Stack>
  );
};

export default Header;
