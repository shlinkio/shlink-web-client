import classNames from 'classnames';
import { isReachableServer, SelectedServer } from '../servers/data';
import ShlinkVersions from './ShlinkVersions';
import './ShlinkVersionsContainer.scss';

export interface ShlinkVersionsContainerProps {
  selectedServer: SelectedServer;
}

const ShlinkVersionsContainer = ({ selectedServer }: ShlinkVersionsContainerProps) => {
  const classes = classNames('text-center', {
    'shlink-versions-container--with-server': isReachableServer(selectedServer),
  });

  return (
    <div className={classes}>
      <ShlinkVersions selectedServer={selectedServer} />
    </div>
  );
};

export default ShlinkVersionsContainer;
