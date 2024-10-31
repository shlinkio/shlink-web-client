import { groupBy } from '@shlinkio/data-manipulation';
import type { ServerData, ServersMap, ServerWithId } from '../data';

/**
 * Builds a potentially unique ID for a server, based on concatenating their name and the hostname of their domain, all
 * in lowercase and replacing invalid URL characters with hyphens.
 */
function idForServer(server: ServerData): string {
  const url = new URL(server.url);
  return `${server.name} ${url.host}`.toLowerCase().replace(/[^a-zA-Z0-9-_.~]/g, '-');
}

export function serverWithId(server: ServerWithId | ServerData): ServerWithId {
  if ('id' in server) {
    return server;
  }

  const id = idForServer(server);
  return { ...server, id };
}

export function serversListToMap(servers: ServerWithId[]): ServersMap {
  return servers.reduce<ServersMap>(
    (acc, server) => ({ ...acc, [server.id]: server }),
    {},
  );
}

const serversInclude = (serversList: ServerData[], { url, apiKey }: ServerData) =>
  serversList.some((server) => server.url === url && server.apiKey === apiKey);

export type DedupServersResult = {
  /** Servers which already exist in the reference list */
  duplicatedServers: ServerData[];
  /** Servers which are new based on a reference list */
  newServers: ServerData[];
};

/**
 * Given a list of new servers, checks which of them already exist in a servers map, and which don't
 */
export function dedupServers(servers: ServersMap, serversToAdd: ServerData[]): DedupServersResult {
  const serversList = Object.values(servers);
  const { duplicatedServers = [], newServers = [] } = groupBy(
    serversToAdd,
    (server) => serversInclude(serversList, server) ? 'duplicatedServers' : 'newServers',
  );

  return { duplicatedServers, newServers };
}
