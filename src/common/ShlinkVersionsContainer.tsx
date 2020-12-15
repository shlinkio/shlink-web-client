import classNames from 'classnames';
import { isReachableServer, SelectedServer } from '../servers/data';
import ShlinkVersions from './ShlinkVersions';

export interface ShlinkVersionsContainerProps {
  selectedServer: SelectedServer;
}

const ShlinkVersionsContainer = ({ selectedServer }: ShlinkVersionsContainerProps) => {
  const serverIsReachable = isReachableServer(selectedServer);
  const colClasses = classNames('text-center', {
    'col-12': !serverIsReachable,
    'col-lg-10 offset-lg-2 col-md-9 offset-md-3': serverIsReachable,
  });

  return (
    <div className="row">
      <div className={colClasses}>
        <ShlinkVersions selectedServer={selectedServer} />
      </div>
    </div>
  );
};

export default ShlinkVersionsContainer;
