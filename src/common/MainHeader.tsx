import { faCogs as cogsIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavBar } from '@shlinkio/shlink-frontend-kit/tailwind';
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
      className="tw:[&]:fixed tw:top-0 tw:z-900"
      brand={(
        <Link to="/" className="tw:[&]:text-white tw:no-underline tw:flex tw:items-center tw:gap-2">
          <ShlinkLogo className="tw:w-7" color="white" /> <small className="tw:font-normal">Shlink</small>
        </Link>
      )}
    >
      <NavBar.MenuItem
        to={settingsPath}
        active={pathname.startsWith(settingsPath)}
        className="tw:flex tw:items-center tw:gap-1.5"
      >
        <FontAwesomeIcon icon={cogsIcon} /> Settings
      </NavBar.MenuItem>
      <ServersDropdown />
    </NavBar>
  );
};

export const MainHeaderFactory = componentFactory(MainHeader, ['ServersDropdown']);
