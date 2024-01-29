import { clsx } from 'clsx';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import type { SelectedServer } from '../servers/data';
import { ShlinkVersions } from './ShlinkVersions';
import './ShlinkVersionsContainer.scss';

export type ShlinkVersionsContainerProps = {
  selectedServer: SelectedServer;
};

const SHLINK_CONTAINER_PATH_PATTERN = /^\/server\/[a-zA-Z0-9-]*\/(?!edit)/;

export const ShlinkVersionsContainer = ({ selectedServer }: ShlinkVersionsContainerProps) => {
  const { pathname } = useLocation();
  const withPadding = useMemo(() => SHLINK_CONTAINER_PATH_PATTERN.test(pathname), [pathname]);

  const classes = clsx('text-center', {
    'shlink-versions-container--with-sidebar': withPadding,
  });

  return (
    <div className={classes}>
      <ShlinkVersions selectedServer={selectedServer} />
    </div>
  );
};
