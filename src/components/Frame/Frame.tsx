import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Container, Sidebar, Sidenav, Content, Nav, DOMHelper, CustomProvider } from 'rsuite';
import enGB from 'rsuite/locales/en_GB';
import { Outlet } from 'react-router-dom';
import NavToggle from './NavToggle';
import Header from '../Header';
import NavLink from '../NavLink';
import Brand from '../Brand';
import { Icon } from '@rsuite/icons';
import { HiOutlineViewBoards } from 'react-icons/hi';
import { LuTable2 } from 'react-icons/lu';
import { MdContacts, MdDashboard } from 'react-icons/md';
import { TbFiles } from 'react-icons/tb';
import FeedbackIcon from '@mui/icons-material/Feedback';
import { CiSettings } from 'react-icons/ci';
import SettingsView from '../SettingsView/SettingsView'; // Adjust the path according to your project structure
import { handleButtonClick } from '../FeedbackButton/FeedbackButton';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import TutorialPopup from '../TutorialPopup/TutorialPopup'; // Adjust the path if necessary
import FeedbackPopup from '../Feedback/FeedbackPopup';
import OnDemandFeedbackPopup from '../Feedback/OnDemandFeedback';
import { useUser } from '@/components/User/UserContext'; // Adjust the import path as needed
import NewButton from '../NewButton/NewButton';

const { getHeight, on } = DOMHelper;

const NavItem = ({ title, eventKey, animate, ...rest }) => {
  return (
    <Nav.Item
      eventKey={eventKey}
      as={NavLink}
      className={classNames('nav-item', { 'nav-item-animate': animate })} // Apply animation class based on the prop
      {...rest}
    >
      {title}
    </Nav.Item>
  );
};

const Frame = () => {
  const { user } = useUser(); // Access user from context
  const navigate = useNavigate();

  const [expand, setExpand] = useState(true);
  const [windowHeight, setWindowHeight] = useState(getHeight(window));
  const [theme, setTheme] = useState<'light' | 'dark' | 'high-contrast'>('dark');
  const [showSettings, setShowSettings] = useState(false);
  const [animate, setAnimate] = useState(true); // State to control animation
  const [showTutorial, setShowTutorial] = useState(false); // State to control tutorial popup visibility
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [isFeedbackPopupOpen, setFeedbackPopupOpen] = useState(false);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tab = params.get('tab');

  useEffect(() => {
    if (tab) {
      setShowSettings(true);
    }
  }, [tab]);

  useEffect(() => {
    const isNewUser = localStorage.getItem('isNewUser');
    if (isNewUser === 'true') {
      setShowTutorial(true);
      localStorage.removeItem('isNewUser'); // Remove the flag after showing the tutorial
    }
  }, []);

  useEffect(() => {
    const checkFeedbackTrigger = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();

        if (data.FeedbackTrigger) {
          setFeedbackPopupOpen(true);
          await fetch(`${process.env.REACT_APP_API_URL}/api/users/disable-feedback`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user.token}`
            }
          });
        }
      } catch (error) {
        console.error('Failed to check feedback trigger', error);
      }
    };

    if (user && user.token) {
      checkFeedbackTrigger();
    }
  }, [user]); // Use `user` as the dependency instead of `user.token`



  useEffect(() => {
    const updateExpand = () => {
      setExpand(window.innerWidth > 768);
    };

    setWindowHeight(getHeight(window));
    updateExpand();

    const resizeListener = on(window, 'resize', () => {
      setWindowHeight(getHeight(window));
      updateExpand();
    });

    // Disable animation after first render, extend the time to match the animation
    const timer = setTimeout(() => {
      setAnimate(false); // Disable animation after the first render
    }, 3000); // Match with your CSS animation duration

    return () => {
      resizeListener.off();
      clearTimeout(timer);
    };
  }, []);

  const containerClasses = classNames('page-container', {
    'container-full': !expand
  });

  const navBodyStyle: React.CSSProperties = expand
    ? { height: windowHeight - 112, overflow: 'auto' }
    : {};

  return (
    <CustomProvider theme={theme} locale={enGB}>
      <Container className="frame">
        <Sidebar
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          width={expand ? 220 : 56}
          collapsible
        >
          <Sidenav.Header>
            <Brand showText={expand} />
          </Sidenav.Header>
          <Sidenav expanded={expand} appearance="subtle">
            <Sidenav.Body
              style={{ ...navBodyStyle, display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              <Nav>
                <NavItem
                  title="Panel"
                  to="/main"
                  eventKey="panel"
                  icon={<Icon as={HiOutlineViewBoards} />}
                  animate={animate} // Pass the animate state
                />
                <NavItem
                  title="Table"
                  to="table"
                  eventKey="table"
                  icon={<Icon as={LuTable2} />}
                  animate={animate} // Pass the animate state
                />
                <NavItem
                  title="Dashboard"
                  to="/main/dashboard"
                  eventKey="dashboard"
                  icon={<Icon as={MdDashboard} />}
                  animate={animate} // Pass the animate state
                />
                {/* <NavItem
                  title="Contacts"
                  to="/main/calendar"
                  eventKey="contacts"
                  icon={<Icon as={MdContacts} />}
                  animate={animate} // Pass the animate state
                /> */}
                <NavItem
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <span>Files</span>
                      <NewButton />
                    </div>
                  }
                  to="/main/files"
                  eventKey="files"
                  icon={<Icon as={TbFiles} />}
                  animate={animate}
                />

              </Nav>
            </Sidenav.Body>

            <Nav>
              {/* Feedback */}
              <Nav.Item
                title="Feedback"
                onClick={() => setShowFeedbackPopup(true)}
                eventKey="feedback"
                icon={<Icon as={FeedbackIcon} />}
              >
                Feedback
              </Nav.Item>

              <Nav.Item
                title="Settings"
                onClick={() => setShowSettings(true)}
                eventKey="settings"
                icon={<Icon as={CiSettings} />}
              >
                Settings
              </Nav.Item>
            </Nav>
            <NavToggle expand={expand} onChange={() => setExpand(!expand)} />
          </Sidenav>
        </Sidebar>

        <Container className={containerClasses} style={{ flex: 1, overflow: 'hidden' }}>
          <Header theme={theme} onChangeTheme={setTheme} />
          <Content>
            <Outlet />
          </Content>
        </Container>

        <SettingsView show={showSettings} onClose={() => {
          setShowSettings(false);
          navigate('/main', { replace: true });
        }}
          initialTab={tab} />
        {showTutorial && <TutorialPopup onClose={() => setShowTutorial(false)} />}
        <FeedbackPopup show={showFeedbackPopup} onClose={() => setShowFeedbackPopup(false)} />
        <OnDemandFeedbackPopup
          show={isFeedbackPopupOpen}
          onClose={() => setFeedbackPopupOpen(false)}
        />


      </Container>
    </CustomProvider>
  );
};

export default Frame;
