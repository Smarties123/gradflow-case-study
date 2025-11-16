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
import { MdDashboard, MdArticle } from 'react-icons/md';
import { TbFiles } from 'react-icons/tb';
import FeedbackIcon from '@mui/icons-material/Feedback';
import { CiSettings } from 'react-icons/ci';
import SettingsView from '../SettingsView/SettingsView';
import { useLocation, useNavigate } from 'react-router-dom';
import TutorialPopup from '../TutorialPopup/TutorialPopup';
import FeedbackPopup from '../Feedback/FeedbackPopup';
import OnDemandFeedbackPopup from '../Feedback/OnDemandFeedback';
import { useUser } from '@/components/User/UserContext';
import UpdatedButton from '../UpdateButton/UpdatedButton';
import { WelcomeToPremiumModal } from '../WelcomeToPremiumModal';

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
  const { user, refetchUser, showWelcomeToPremium, setShowWelcomeToPremium } = useUser();
  const navigate = useNavigate();

  const [expand, setExpand] = useState(true);
  const [windowHeight, setWindowHeight] = useState(getHeight(window));
  const [theme, setTheme] = useState<'light' | 'dark' | 'high-contrast'>('dark');
  const [showSettings, setShowSettings] = useState(false);
  const [animate, setAnimate] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [isFeedbackPopupOpen, setFeedbackPopupOpen] = useState(false);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tab = params.get('tab');
  const success = params.get('success');

  useEffect(() => {
    if (tab) {
      setShowSettings(true);
    }
  }, [tab]);

  // Handle successful payment return
  useEffect(() => {
    if (success === 'true') {
      console.log('Payment successful, refetching user data...');
      console.log('Current user before refetch:', user);
      refetchUser().then(() => {
        console.log('User data updated after successful payment');
        console.log('User membership status:', user?.isMember);
        // Remove success parameter from URL to prevent refetch on refresh
        const newUrl = window.location.pathname;
        window.history.replaceState(null, '', newUrl);
      }).catch(error => {
        console.error('Failed to refetch user data after payment:', error);
      });
    }
  }, [success, refetchUser, user]);

  useEffect(() => {
    const isNewUser = localStorage.getItem('isNewUser');
    if (isNewUser === 'true') {
      setShowTutorial(true);
      localStorage.removeItem('isNewUser'); // Remove the flag after showing the tutorial
    }
  }, []);

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
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <span>Panel</span>
                    </div>
                  }
                  to="/main"
                  eventKey="panel"
                  icon={<Icon as={HiOutlineViewBoards} />}
                  animate={animate}
                />
                <NavItem
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <span>Table</span>
                      <UpdatedButton />
                    </div>
                  }
                  to="/main/table"
                  eventKey="table"
                  icon={<Icon as={LuTable2} />}
                  animate={animate} 
                />
                <NavItem
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <span>Dashboard</span>
                    </div>
                  }
                  to="/main/dashboard"
                  eventKey="dashboard"
                  icon={<Icon as={MdDashboard} />}
                  animate={animate}
                />
                <NavItem
                  title="Files"
                  to="/main/files"
                  eventKey="files"
                  icon={<Icon as={TbFiles} />}
                  animate={animate}
                />

              </Nav>
            </Sidenav.Body>

            <Nav>
              {/* Case Study */}
              <Nav.Item
                title="Case Study"
                onClick={() => window.location.href = "/case-study"}
                eventKey="case-study"
                icon={<Icon as={MdArticle} />}
              >
                Case Study
              </Nav.Item>

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

        <WelcomeToPremiumModal
          isOpen={showWelcomeToPremium}
          onClose={() => setShowWelcomeToPremium(false)}
        />

      </Container>
    </CustomProvider>
  );
};

export default Frame;
