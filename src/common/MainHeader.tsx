import { faChevronDown as arrowIcon, faCogs as cogsIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useToggle } from '@shlinkio/shlink-frontend-kit';
import { clsx } from 'clsx';
import type { FC } from 'react';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import type { FCWithDeps } from '../container/utils';
import { componentFactory, useDependencies } from '../container/utils';
import { ShlinkLogo } from './img/ShlinkLogo';

type MainHeaderDeps = {
  ServersDropdown: FC;
};

const MainHeader: FCWithDeps<unknown, MainHeaderDeps> = () => {
  const { ServersDropdown } = useDependencies(MainHeader);
  const [isNotCollapsed, toggleCollapse, , collapse] = useToggle();
  const location = useLocation();
  const { pathname } = location;

  // In mobile devices, collapse the navbar when location changes
  useEffect(collapse, [location, collapse]);

  const settingsPath = '/settings';

  return (
    <Navbar color="primary" dark fixed="top" expand="md" className="tw:text-white tw:bg-lm-main tw:dark:bg-dm-main">
      <NavbarBrand tag={Link} to="/">
        <ShlinkLogo className="tw:inline tw:w-7 tw:mr-1" color="white" /> Shlink
      </NavbarBrand>

      <NavbarToggler onClick={toggleCollapse}>
        <FontAwesomeIcon
          icon={arrowIcon}
          className={clsx('tw:transition-transform tw:duration-300', { 'tw:rotate-180': isNotCollapsed })}
        />
      </NavbarToggler>

      <Collapse navbar isOpen={isNotCollapsed}>
        <Nav navbar className="tw:ml-auto">
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

export const MainHeaderFactory = componentFactory(MainHeader, ['ServersDropdown']);
