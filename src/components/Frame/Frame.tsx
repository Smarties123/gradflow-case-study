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

import { CiSettings } from 'react-icons/ci';
import SettingsView from '../SettingsView/SettingsView'; // Adjust the path according to your project structure

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
  const [expand, setExpand] = useState(true);
  const [windowHeight, setWindowHeight] = useState(getHeight(window));
  const [theme, setTheme] = useState<'light' | 'dark' | 'high-contrast'>('dark');
  const [showSettings, setShowSettings] = useState(false);
  const [animate, setAnimate] = useState(true); // State to control animation

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
    }, 2000); // Match with your CSS animation duration

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
                <NavItem
                  title="Contacts"
                  to="/comingsoon"
                  eventKey="contacts"
                  icon={<Icon as={MdContacts} />}
                  animate={animate} // Pass the animate state
                />
                <NavItem
                  title="Files"
                  to="/comingsoon"
                  eventKey="files"
                  icon={<Icon as={TbFiles} />}
                  animate={animate} // Pass the animate state
                />
              </Nav>
            </Sidenav.Body>

            <Nav>
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

        <SettingsView show={showSettings} onClose={() => setShowSettings(false)} />
      </Container>
    </CustomProvider>
  );
};

export default Frame;
