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

// ---------------------------------------------------------- ADDED THESE ICONS FROM REACT-ICONS ----------------------------------------------------------
import { HiOutlineViewBoards } from "react-icons/hi";
import { LuTable2 } from "react-icons/lu";
import { MdContacts } from "react-icons/md";
import { MdDashboard } from "react-icons/md";
import { TbFiles } from "react-icons/tb";
import { CiSettings } from "react-icons/ci";

// -------------------------------------------------------------------------------------------------------------------------------------------------------- 



const { getHeight, on } = DOMHelper;

const NavItem = props => {
  const { title, eventKey, ...rest } = props;
  return (
    <Nav.Item eventKey={eventKey} as={NavLink} {...rest}>
      {title}
    </Nav.Item>
  );
};

export interface NavItemData {
  eventKey: string;
  title: string;
  icon?: any;
  to?: string;
  target?: string;
  children?: NavItemData[];
};

const Frame = () => {
  const [expand, setExpand] = useState(true);
  const [windowHeight, setWindowHeight] = useState(getHeight(window));
  const [theme, setTheme] = useState<'light' | 'dark' | 'high-contrast'>('dark');

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
          width={expand ? 260 : 56}
          collapsible
        >
          <Sidenav.Header>
            <Brand showText={expand} />
          </Sidenav.Header>
          <Sidenav expanded={expand} appearance="subtle">
            <Sidenav.Body style={navBodyStyle}>

              <Nav>
                <NavItem
                  title="Panel"
                  to="panel"
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
                  to="dashboard"
                  eventKey="dashboard"
                  icon={<Icon as={MdDashboard} />}
                />

                <NavItem
                  title="Files"
                  to="files"
                  eventKey="files"
                  icon={<Icon as={TbFiles} />}

                /><NavItem
                  title="Settings"
                  to="settings"
                  eventKey="settings"
                  icon={<Icon as={CiSettings} />}
                />


              </Nav>
            </Sidenav.Body>
          </Sidenav>
          <NavToggle expand={expand} onChange={() => setExpand(!expand)} />
        </Sidebar>

        <Container className={containerClasses} style={{ flex: 1, overflow: 'hidden' }}>
          <Header theme={theme} onChangeTheme={setTheme} />
          <Content>
            <Outlet />
          </Content>
        </Container>
      </Container>
    </CustomProvider>
  );
};

export default Frame;
