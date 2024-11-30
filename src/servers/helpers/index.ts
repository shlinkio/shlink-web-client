import { groupBy } from '@shlinkio/data-manipulation';
import type { ServerData, ServersMap, ServerWithId } from '../data';

/**
 * Builds a potentially unique ID for a server, based on concatenating their name and the hostname of their domain, all
 * in lowercase and replacing invalid URL characters with hyphens.
 */
function idForServer(server: ServerData): string {
  let urlSegment = server.url;
  try {
    const { host, pathname } = new URL(urlSegment);
    urlSegment = host;

    // Remove leading slash from pathname
    const normalizedPathname = pathname.substring(1);

    // Include pathname in the ID, if not empty
    if (normalizedPathname.length > 0) {
      urlSegment = `${urlSegment} ${normalizedPathname}`;
    }
  } catch {
    // If the server URL is not valid, use the value as is
  }

  return `${server.name} ${urlSegment}`.toLowerCase().replace(/[^a-zA-Z0-9-_.~]/g, '-');
}

export function serversListToMap(servers: ServerWithId[]): ServersMap {
  const serversMap: ServersMap = {};
  servers.forEach((server) => {
    serversMap[server.id] = server;
  });

  return serversMap;
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

/**
 * Given a servers map and a list of servers, return the same list of servers but all with an ID, ensuring the ID is
 * unique both among all those servers and existing ones
 */
export function ensureUniqueIds(existingServers: ServersMap, serversList: ServerData[]): ServerWithId[] {
  const existingIds = new Set(Object.keys(existingServers));
  const serversWithId: ServerWithId[] = [];

  serversList.forEach((server) => {
    const baseId = idForServer(server);

    let id = baseId;
    let iterations = 1;
    while (existingIds.has(id)) {
      id = `${baseId}-${iterations}`;
      iterations++;
    }

    serversWithId.push({ ...server, id });

    // Add this server's ID to the list, so that it is taken into consideration for the next ones
    existingIds.add(id);
  });

  return serversWithId;
}
