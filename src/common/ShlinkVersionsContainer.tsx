import classNames from 'classnames';
import type { SelectedServer } from '../servers/data';
import type { Sidebar } from './reducers/sidebar';
import { ShlinkVersions } from './ShlinkVersions';
import './ShlinkVersionsContainer.scss';

export interface ShlinkVersionsContainerProps {
  selectedServer: SelectedServer;
  sidebar: Sidebar;
}

export const ShlinkVersionsContainer = ({ selectedServer, sidebar }: ShlinkVersionsContainerProps) => {
  const classes = classNames('text-center', {
    'shlink-versions-container--with-sidebar': sidebar.sidebarPresent,
  });

  return (
    <div className={classes}>
      <ShlinkVersions selectedServer={selectedServer} />
    </div>
  );
};
