export interface RegularServer {
  id: string;
  name: string;
  url: string;
  apiKey: string;
  version?: string;
  printableVersion?: string;
  serverNotReachable?: boolean;
}

interface NotFoundServer {
  serverNotFound: true;
}

export type Server = RegularServer | NotFoundServer;
