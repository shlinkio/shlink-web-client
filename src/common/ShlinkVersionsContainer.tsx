import { clsx } from 'clsx';
import type { SelectedServer } from '../servers/data';
import { isReachableServer } from '../servers/data';
import { ShlinkVersions } from './ShlinkVersions';
import './ShlinkVersionsContainer.scss';

export type ShlinkVersionsContainerProps = {
  selectedServer: SelectedServer;
};

export const ShlinkVersionsContainer = ({ selectedServer }: ShlinkVersionsContainerProps) => (
  <div
    className={clsx('text-center', {
      'shlink-versions-container--with-sidebar': isReachableServer(selectedServer),
    })}
  >
    <ShlinkVersions selectedServer={selectedServer} />
  </div>
);
