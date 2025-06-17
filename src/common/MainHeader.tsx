import { faCogs as cogsIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavBar } from '@shlinkio/shlink-frontend-kit';
import type { FC } from 'react';
import { Link, useLocation } from 'react-router';
import type { FCWithDeps } from '../container/utils';
import { componentFactory, useDependencies } from '../container/utils';
import { ShlinkLogo } from './img/ShlinkLogo';

type MainHeaderDeps = {
  ServersDropdown: FC;
};

const MainHeader: FCWithDeps<unknown, MainHeaderDeps> = () => {
  const { ServersDropdown } = useDependencies(MainHeader);
  const { pathname } = useLocation();

  const settingsPath = '/settings';

  return (
    <NavBar
      className="[&]:fixed top-0 z-900"
      brand={(
        <Link to="/" className="[&]:text-white no-underline flex items-center gap-2">
          <ShlinkLogo className="w-7" color="white" /> <small className="font-normal">Shlink</small>
        </Link>
      )}
    >
      <NavBar.MenuItem
        to={settingsPath}
        active={pathname.startsWith(settingsPath)}
        className="flex items-center gap-1.5"
      >
        <FontAwesomeIcon icon={cogsIcon} /> Settings
      </NavBar.MenuItem>
      <ServersDropdown />
    </NavBar>
  );
};

export const MainHeaderFactory = componentFactory(MainHeader, ['ServersDropdown']);
