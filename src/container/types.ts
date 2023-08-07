import type { Settings } from '@shlinkio/shlink-web-component';
import type { SelectedServer, ServersMap } from '../servers/data';

export interface ShlinkState {
  servers: ServersMap;
  selectedServer: SelectedServer;
  settings: Settings;
  appUpdated: boolean;
}

export type ConnectDecorator = (props: string[] | null, actions?: string[]) => any;

export type GetState = () => ShlinkState;
