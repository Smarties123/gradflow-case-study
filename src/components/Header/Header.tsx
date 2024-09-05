import React, { useRef, useState, useContext } from 'react';
import {
  Dropdown,
  Popover,
  Whisper,
  WhisperInstance,
  Stack,
  Badge,
  Avatar,
  List,
  Button,
  ButtonToolbar,
  Input,
  InputGroup
} from 'rsuite';
import HelpOutlineIcon from '@rsuite/icons/HelpOutline';
import ToggleColorMode from '../LandingPage/ToggleColorMode'; // Import the ToggleColorMode component
import { FaRegShareSquare } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import ShareModal from '../Share/Share';
import Modal from '../Modal/Modal';
import { BoardContext } from '../../pages/board/BoardContext';
import SettingsView from '../SettingsView/SettingsView.tsx';
import { useLocation } from 'react-router-dom'; // Import useLocation hook
import { GiUpgrade } from "react-icons/gi";
import { CgDetailsMore } from "react-icons/cg";




const Header = (props) => {
  const context = useContext(BoardContext);
  if (!context) {
    console.error('BoardContext is undefined. Ensure BoardProvider is correctly wrapping the component.');
  }

  const { columns, setColumns, addCardToColumn } = context;
  const location = useLocation(); // Get the current route


  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [invitedList, setInvitedList] = useState([]);
  const [showSettings, setShowSettings] = useState(false); // State to manage the settings view

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

  const handleShare = () => {
    if (email) {
      setInvitedList([...invitedList, email]);
      setEmail("");
    }
  };

  const removeInvite = emailToRemove => {
    setInvitedList(invitedList.filter(item => item !== emailToRemove));
  };

  const renderAdminSpeaker = ({ onClose, left, top, className }: any, ref) => {
    const handleSelect = eventKey => {
      onClose();
      console.log(eventKey);
      if (eventKey === 'settings') {
        setShowSettings(true); // Show settings view when "Settings" is selected
      }
    };

    return (
      <Popover ref={ref} className={className} style={{ left, top }} full>
        <Dropdown.Menu onSelect={handleSelect}>
          <Dropdown.Item panel style={{ padding: 10, width: 160 }}>
            <p>Signed in as</p>
            <strong>[Username] Field</strong>
          </Dropdown.Item>
          <Dropdown.Item divider />
          <Dropdown.Item>Profile & account</Dropdown.Item>
          <Dropdown.Item as="a" href="https://forms.gle/TzuxcFinXXdRzRZQ8" target="_blank">Feedback</Dropdown.Item>
          <Dropdown.Item divider />
          <Dropdown.Item eventKey="settings">Settings</Dropdown.Item> {/* Add eventKey to identify menu item */}
          <Dropdown.Item>Sign out</Dropdown.Item>
          <Dropdown.Item
            icon={<HelpOutlineIcon />}
            href="https://rsuitejs.com"
            target="_blank"
            as="a"
          >
            Help{' '}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Popover>
    );
  };

  const renderNoticeSpeaker = ({ onClose, left, top, className }: any, ref) => {
    return (
      <Popover ref={ref} className={className} style={{ left, top, width: 300 }} title="Last updates">
        <List>
          {notifications.map((item, index) => {
            const [time, content] = item;
            return (
              <List.Item key={index}>
                <Stack spacing={4}>
                  <Badge /> <span style={{ color: '#57606a' }}>{time}</span>
                </Stack>
                <p>{content}</p>
              </List.Item>
            );
          })}
        </List>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Button onClick={onClose}>More notifications</Button>
        </div>
      </Popover>
    );
  };

  const isDashboardPage = location.pathname === '/main/dashboard'; // Check if the current route is '/dashboard'


  return (
    <Stack className="header" spacing={8} justifyContent="space-between">
      <Stack direction="row" spacing={4} alignItems="flex-start">
        {isDashboardPage ? (
          // Content for the Dashboard page
          <div style={{ display: 'flex', justifyContent: 'end', width: "100%", alignItems: "center" }}>
            {/* Replace with Dashboard-specific content */}
            <h5 style={{ marginRight: '15px' }}>Dashboard</h5>
            <h6>Upgrade now to see the GradFlow Graduate dashboard</h6>

            <ButtonToolbar style={{ display: 'flex', gap: '3px', marginLeft: '20px' }}>
              <Button className="header-button"
                style={{
                  backgroundColor: 'yellow', color: 'black', display: 'flex', alignItems: 'center', width: '150px', border: '1px darkyellow solid'
                }}
              // onClick={null}
              >
                <GiUpgrade className="header-icon" style={{ fontSize: 18, color: 'black', margin: '1px 1px 1px 1px' }} />
                <span className="visually-hidden" style={{ color: 'black' }}>Upgrade to Pro</span>
              </Button>
              <Button
                className="header-button"
                style={{ backgroundColor: 'white', color: 'black', display: 'flex', alignItems: 'center', width: '150px', border: '1px black solid' }}
              // onClick={null}
              >
                <CgDetailsMore className="header-icon" style={{ fontSize: 18, margin: '1px 1px 1px 1px' }} />
                <span className="visually-hidden">Learn More</span>
              </Button>
            </ButtonToolbar>

          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'end', width: "100%" }}>
            <InputGroup inside size="lg" className="search-input">
              <InputGroup.Button>
                <FaSearch />
              </InputGroup.Button>
              <Input placeholder="Search " />
            </InputGroup>

            <div style={{ alignItems: "left" }}>
              <ButtonToolbar style={{ display: 'flex', gap: '3px' }}>
                <Button className="header-button"
                  style={{
                    backgroundColor: '#8338ec', color: 'white', display: 'flex', alignItems: 'center', width: '120px',
                  }}
                  onClick={handleOpenAddModal}
                >
                  <FaPlus className="header-icon" style={{ fontSize: 18, color: 'white', margin: '1px 1px 1px 1px' }} />
                  <span className="visually-hidden">Add New</span>
                </Button>
                <Button
                  className="header-button"
                  style={{ backgroundColor: '#ff6200', color: 'white', display: 'flex', alignItems: 'center', width: '120px' }}
                  onClick={handleOpenModal}
                >
                  <FaRegShareSquare className="header-icon" style={{ fontSize: 18, margin: '1px 1px 1px 1px' }} />
                  <span className="visually-hidden">Share</span>
                </Button>
              </ButtonToolbar>
            </div>
          </div>

        )}
        <Modal
          isOpen={isAddModalOpen}
          onClose={handleCloseAddModal}
          columns={columns}
          addCardToColumn={addCardToColumn}
          showDropdown={true}
        />
        <ShareModal isModalOpen={isModalOpen} handleCloseModal={handleCloseModal} /> {/* Use the ShareModal component */}
      </Stack>

      <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ToggleColorMode mode={theme === 'light' ? 'light' : 'dark'} toggleColorMode={() => onChangeTheme(theme === 'light' ? 'dark' : 'light')} />
        <Whisper placement="bottomEnd" trigger="click" ref={trigger} speaker={renderAdminSpeaker}>
          <Avatar
            size="sm"
            circle
            src="https://i.pravatar.cc/150?u=2"
            style={{ marginLeft: 8 }}
          />
        </Whisper>
      </div>
      {
        showSettings && (
          <SettingsView
            show={showSettings}
            onClose={() => setShowSettings(false)} // Close the settings drawer
            card={{}} // Pass necessary props here, adjust as per your implementation
            updateCard={() => { }} // Adjust as per your implementation
          />
        )
      }
    </Stack >
  );
};

export default Header;
