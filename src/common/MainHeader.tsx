import { faChevronDown as arrowIcon, faCogs as cogsIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import classNames from 'classnames';
import { RouteComponentProps } from 'react-router';
import { useToggle } from '../utils/helpers/hooks';
import shlinkLogo from './shlink-logo-white.png';
import './MainHeader.scss';

const MainHeader = (ServersDropdown: FC) => ({ location }: RouteComponentProps) => {
  const [ isOpen, toggleOpen, , close ] = useToggle();
  const { pathname } = location;

  useEffect(close, [ location ]);

  const settingsPath = '/settings';
  const toggleClass = classNames('main-header__toggle-icon', { 'main-header__toggle-icon--opened': isOpen });

  return (
    <Navbar color="primary" dark fixed="top" className="main-header" expand="md">
      <NavbarBrand tag={Link} to="/">
        <img src={shlinkLogo} alt="Shlink" className="main-header__brand-logo" /> Shlink
      </NavbarBrand>

      <NavbarToggler onClick={toggleOpen}>
        <FontAwesomeIcon icon={arrowIcon} className={toggleClass} />
      </NavbarToggler>

      <Collapse navbar isOpen={isOpen}>
        <Nav navbar className="ml-auto">
          <NavItem>
            <NavLink tag={Link} to={'/settings'} active={pathname === settingsPath}>
              <FontAwesomeIcon icon={cogsIcon} />&nbsp; Settings
            </NavLink>
          </NavItem>
          <ServersDropdown />
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default MainHeader;
