import type { Sidebar } from '../common/reducers/sidebar';
import type { SelectedServer, ServersMap } from '../servers/data';
import type { Settings } from '../settings/reducers/settings';

export interface ShlinkState {
  servers: ServersMap;
  selectedServer: SelectedServer;
  settings: Settings;
  appUpdated: boolean;
  sidebar: Sidebar;
}

export type ConnectDecorator = (props: string[] | null, actions?: string[]) => any;

export type GetState = () => ShlinkState;
