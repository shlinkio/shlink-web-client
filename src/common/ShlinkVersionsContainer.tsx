import { clsx } from 'clsx';
import type { SelectedServer } from '../servers/data';
import { isReachableServer } from '../servers/data';
import { ShlinkVersions } from './ShlinkVersions';

export type ShlinkVersionsContainerProps = {
  selectedServer: SelectedServer;
};

export const ShlinkVersionsContainer = ({ selectedServer }: ShlinkVersionsContainerProps) => (
  <div
    className={clsx('tw:text-center', { 'tw:md:ml-(--aside-menu-width)': isReachableServer(selectedServer) })}
  >
    <ShlinkVersions selectedServer={selectedServer} />
  </div>
);
