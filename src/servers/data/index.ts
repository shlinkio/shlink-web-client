export interface NewServerData {
  name: string;
  url: string;
  apiKey: string;
}

export interface RegularServer extends NewServerData {
  id: string;
  version?: string;
  printableVersion?: string;
  serverNotReachable?: true;
}

interface NotFoundServer {
  serverNotFound: true;
}

export type Server = RegularServer | NotFoundServer;
