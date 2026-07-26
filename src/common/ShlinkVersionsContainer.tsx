import { clsx } from 'clsx';
import { isReachableServer } from '../servers/data';
import { useSelectedServer } from '../servers/reducers/selectedServer';
import { ShlinkVersions } from './ShlinkVersions';

export const ShlinkVersionsContainer = () => {
  const { selectedServer } = useSelectedServer();
  return (
    <div className={clsx('text-center', { 'md:ml-(--aside-menu-width)': isReachableServer(selectedServer) })}>
      <ShlinkVersions selectedServer={selectedServer} />
    </div>
  );
};
