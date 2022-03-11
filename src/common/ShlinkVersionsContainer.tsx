import classNames from 'classnames';
import { SelectedServer } from '../servers/data';
import ShlinkVersions from './ShlinkVersions';
import { Sidebar } from './reducers/sidebar';
import './ShlinkVersionsContainer.scss';

export interface ShlinkVersionsContainerProps {
  selectedServer: SelectedServer;
  sidebar: Sidebar;
}

const ShlinkVersionsContainer = ({ selectedServer, sidebar }: ShlinkVersionsContainerProps) => {
  const classes = classNames('text-center', {
    'shlink-versions-container--with-sidebar': sidebar.sidebarPresent,
  });

  return (
    <div className={classes}>
      <ShlinkVersions selectedServer={selectedServer} />
    </div>
  );
};

export default ShlinkVersionsContainer;
