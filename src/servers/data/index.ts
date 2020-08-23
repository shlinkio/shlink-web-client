export interface ServerData {
  name: string;
  url: string;
  apiKey: string;
}

export interface ServerWithId {
  id: string;
}

export interface ReachableServer extends ServerWithId {
  version: string;
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
