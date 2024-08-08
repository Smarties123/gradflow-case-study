import React, { useRef, useEffect, useState } from 'react';
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
  InputGroup,
  Modal,
  Tag
} from 'rsuite';
import HelpOutlineIcon from '@rsuite/icons/HelpOutline';
// --------------------------------------------------------------------------------------------------------------------------------

import ToggleColorMode from '../LandingPage/ToggleColorMode'; // Import the ToggleColorMode component

// --------------------------------------------------------------Added These Icons ------------------------------------------------
import { FaRegShareSquare } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

// --------------------------------------------------------------------------------------------------------------------------------
import './Share.less';


const renderAdminSpeaker = ({ onClose, left, top, className }: any, ref) => {
  const handleSelect = eventKey => {
    onClose();
    console.log(eventKey);
  };
  return (
    <Popover ref={ref} className={className} style={{ left, top }} full>
      <Dropdown.Menu onSelect={handleSelect}>
        <Dropdown.Item panel style={{ padding: 10, width: 160 }}>
          <p>Signed in as</p>
          <strong>Administrator</strong>
        </Dropdown.Item>
        <Dropdown.Item divider />
        <Dropdown.Item>Set status</Dropdown.Item>
        <Dropdown.Item>Profile & account</Dropdown.Item>
        <Dropdown.Item>Feedback</Dropdown.Item>
        <Dropdown.Item divider />
        <Dropdown.Item>Settings</Dropdown.Item>
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

type ThemeType = 'dark' | 'light' | 'high-contrast';
interface HeaderProps {
  theme: ThemeType;
  onChangeTheme: (theme: ThemeType) => void;
}

const Header = (props: HeaderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [invitedList, setInvitedList] = useState([]);

  const { theme, onChangeTheme } = props;
  const trigger = useRef<WhisperInstance>(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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


  return (
    <Stack className="header" spacing={8} justifyContent="space-between">



      <Stack direction="column" spacing={4} alignItems="flex-start">
        {/* --------------------------------------------- MAYBE CAN BE USED IN FUTURE DEVELOPMENT --------------------------- */}
        <InputGroup inside size="lg" className="search-input">
          <InputGroup.Button>
            <FaSearch />
          </InputGroup.Button>
          <Input placeholder="Search " />
        </InputGroup>
        {/* ----------------------------------------------------------------------------------------------------------------- */}

        <div style={{ display: 'flex', justifyContent: 'end', width: "100%", alignItems: "left" }}>
          <ButtonToolbar style={{ display: 'flex', gap: '3px' }}>
            <Button className="header-button" style={{ backgroundColor: '#8338ec', color: 'white', display: 'flex', alignItems: 'center', width: '120px' }}>
              <FaPlus className="header-icon" style={{ fontSize: 18, color: 'white', margin: '1px 1px 1px 1px' }} />
              <span className="visually-hidden">Add New</span> {/* Visually hidden text */}

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
        {/* Share Modal */}

        <Modal open={isModalOpen} onClose={handleCloseModal}>

          <Modal.Body>
            <div className="modal-container">
              <p className="modal-description"><b>Share</b> your board<br />
                with an advisor,<br /> friends or family</p>
              <div className="input-group-container">
                <InputGroup inside size="lg" className="share-input">
                  <Input
                    value={email}
                    onChange={value => setEmail(value)}
                    placeholder="Enter email address"
                  />
                </InputGroup>
                <Button
                  onClick={handleShare}
                  className="share-button"
                >
                  Share
                </Button>
              </div>
              <hr></hr>
              <div className="invited-list">
                {invitedList.map((invited, index) => (
                  <Tag
                    key={index}
                    closable
                    onClose={() => removeInvite(invited)}
                  >
                    {invited}
                  </Tag>
                ))}
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={handleCloseModal} appearance="subtle">
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Stack>

      <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

        {/* DARKMODE */}
        <ToggleColorMode mode={theme === 'light' ? 'light' : 'dark'} toggleColorMode={() => onChangeTheme(theme === 'light' ? 'dark' : 'light')} />

        {/* USER PROFILE */}
        <Whisper placement="bottomEnd" trigger="click" ref={trigger} speaker={renderAdminSpeaker}>
          <Avatar
            size="sm"
            circle
            // THIS WILL BE USER PROFILE WHEN THEY LOGIN. IT WILL BE AUTOMATICALLY FILLED
            src="https://avatars.githubusercontent.com/u/1203827"
            alt="@simonguo"
            style={{ marginLeft: 8 }}
          />
        </Whisper>

      </div>


    </Stack >
  );
};

export default Header;
