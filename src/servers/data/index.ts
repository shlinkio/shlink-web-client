import { omit } from 'ramda';
import { SemVer } from '../../utils/helpers/version';

export interface ServerData {
  name: string;
  url: string;
  apiKey: string;
}

export interface ServerWithId extends ServerData {
  id: string;
  autoConnect?: boolean;
}

export interface ReachableServer extends ServerWithId {
  version: SemVer;
  printableVersion: string;
}

export interface NonReachableServer extends ServerWithId {
  serverNotReachable: true;
}

export interface NotFoundServer {
  serverNotFound: true;
}

export type RegularServer = ReachableServer | NonReachableServer;

export type SelectedServer = RegularServer | NotFoundServer | null;

export type ServersMap = Record<string, ServerWithId>;

export const hasServerData = (server: SelectedServer | ServerData): server is ServerData =>
  !!(server as ServerData)?.url && !!(server as ServerData)?.apiKey;

export const isServerWithId = (server: SelectedServer | ServerWithId): server is ServerWithId =>
  !!(server as ServerWithId)?.id;

export const isReachableServer = (server: SelectedServer): server is ReachableServer =>
  !!(server as ReachableServer)?.version;

export const isNotFoundServer = (server: SelectedServer): server is NotFoundServer =>
  !!(server as NotFoundServer)?.serverNotFound;

export const getServerId = (server: SelectedServer) => (isServerWithId(server) ? server.id : '');

export const serverWithIdToServerData = (server: ServerWithId): ServerData =>
  omit<ServerWithId, 'id' | 'autoConnect'>(['id', 'autoConnect'], server);
