import type { SemVer } from '../../utils/helpers/version';

export interface ServerData {
  name: string;
  url: string;
  apiKey: string;
  forwardCredentials?: boolean;
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

/**
 * Expose values that represent provided server, in a way that can be serialized in JSON or CSV strings.
 */
export const serializeServer = ({ name, url, apiKey, forwardCredentials }: ServerData): Record<string, string> => ({
  name,
  url,
  apiKey,
  forwardCredentials: forwardCredentials ? 'true' : 'false',
});

const validateServerData = (server: any): server is ServerData =>
  typeof server.url === 'string' && typeof server.apiKey === 'string' && typeof server.name === 'string';

/**
 * Provided a record, it picks the right properties to build a ServerData object.
 * @throws Error If any of the required ServerData properties is missing.
 */
export const deserializeServer = (potentialServer: Record<string, unknown>): ServerData => {
  const { forwardCredentials, ...serverData } = potentialServer;
  if (!validateServerData(serverData)) {
    throw new Error('Server is missing required "url", "apiKey" and/or "name" properties');
  }

  return {
    ...serverData,
    forwardCredentials: forwardCredentials === 'true',
  };
};
