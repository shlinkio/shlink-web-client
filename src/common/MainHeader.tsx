import { faChevronDown as arrowIcon, faCogs as cogsIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useToggle } from '@shlinkio/shlink-frontend-kit';
import classNames from 'classnames';
import type { FC } from 'react';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { ShlinkLogo } from './img/ShlinkLogo';
import './MainHeader.scss';

export const MainHeader = (ServersDropdown: FC) => () => {
  const [isNotCollapsed, toggleCollapse, , collapse] = useToggle();
  const location = useLocation();
  const { pathname } = location;

  // In mobile devices, collapse the navbar when location changes
  useEffect(collapse, [location, collapse]);

  const settingsPath = '/settings';
  const toggleClass = classNames('main-header__toggle-icon', { 'main-header__toggle-icon--opened': isNotCollapsed });

  return (
    <Navbar color="primary" dark fixed="top" className="main-header" expand="md">
      <NavbarBrand tag={Link} to="/">
        <ShlinkLogo className="main-header__brand-logo" color="white" /> Shlink
      </NavbarBrand>

      <NavbarToggler onClick={toggleCollapse}>
        <FontAwesomeIcon icon={arrowIcon} className={toggleClass} />
      </NavbarToggler>

      <Collapse navbar isOpen={isNotCollapsed}>
        <Nav navbar className="ms-auto">
          <NavItem>
            <NavLink tag={Link} to={settingsPath} active={pathname.startsWith(settingsPath)}>
              <FontAwesomeIcon icon={cogsIcon} />&nbsp; Settings
            </NavLink>
          </NavItem>
          <ServersDropdown />
        </Nav>
      </Collapse>
    </Navbar>
  );
};
