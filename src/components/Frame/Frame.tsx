import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import {
  Container,
  Sidebar,
  Sidenav,
  Content,
  Nav,
  DOMHelper,
  CustomProvider
} from 'rsuite';
import enGB from 'rsuite/locales/en_GB';
import { Outlet } from 'react-router-dom';
import NavToggle from './NavToggle';
import Header from '../Header';
import NavLink from '../NavLink';
import Brand from '../Brand';
import { Icon } from '@rsuite/icons';
import { HiOutlineViewBoards } from "react-icons/hi";
import { LuTable2 } from "react-icons/lu";
import { MdContacts } from "react-icons/md";
import { MdDashboard } from "react-icons/md";
import { TbFiles } from "react-icons/tb";
import { CiSettings } from "react-icons/ci";
import SettingsView from '../SettingsView/SettingsView'; // Adjust the path according to your project structure

const { getHeight, on } = DOMHelper;

const NavItem = props => {
  const { title, eventKey, ...rest } = props;
  return (
    <Nav.Item eventKey={eventKey} as={NavLink} className="nav-item" {...rest}>
      {title}
    </Nav.Item>
  );
};

const Frame = () => {
  const [expand, setExpand] = useState(true);
  const [windowHeight, setWindowHeight] = useState(getHeight(window));
  const [theme, setTheme] = useState<'light' | 'dark' | 'high-contrast'>('dark');
  const [showSettings, setShowSettings] = useState(false); // State to manage the visibility of the settings popup

  useEffect(() => {
    const updateExpand = () => {
      setExpand(window.innerWidth > 768); // Collapse sidebar if window width <= 768px
    };

    setWindowHeight(getHeight(window));
    updateExpand(); // Check initial window width
    const resizeListener = on(window, 'resize', () => {
      setWindowHeight(getHeight(window));
      updateExpand(); // Update expand state on window resize
    });

    return () => {
      resizeListener.off();
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
            <Sidenav.Body style={{ ...navBodyStyle, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Nav>
                <NavItem
                  title="Panel"
                  to="/main"
                  eventKey="panel"
                  icon={<Icon as={HiOutlineViewBoards} />}
                />
                <NavItem
                  title="Table"
                  to="table"
                  eventKey="table"
                  icon={<Icon as={LuTable2} />}
                />
                <NavItem
                  title="Contacts"
                  to="contacts"
                  eventKey="contacts"
                  icon={<Icon as={MdContacts} />}
                />
                <NavItem
                  title="Dashboard"
                  to="/main/dashboard"
                  eventKey="dashboard"
                  icon={<Icon as={MdDashboard} />}
                />
                <NavItem
                  title="Files"
                  to="files"
                  eventKey="files"
                  icon={<Icon as={TbFiles} />}
                />
              </Nav>
            </Sidenav.Body>

            {/* Settings item placed here, above NavToggle */}
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

        <SettingsView
          show={showSettings}
          onClose={() => setShowSettings(false)} // Close the settings drawer
          card={{}} // Pass necessary props here, adjust as per your implementation
          updateCard={() => { }} // Adjust as per your implementation
        />

      </Container>
    </CustomProvider>
  );
};

export default Frame;
