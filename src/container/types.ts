import { MercureInfo } from '../mercure/reducers/mercureInfo';
import { ServersMap } from '../servers/reducers/servers';

export type ConnectDecorator = (props: string[], actions?: string[]) => any;

export interface ShlinkState {
  servers: ServersMap;
  selectedServer: any;
  shortUrlsList: any;
  shortUrlsListParams: any;
  shortUrlCreationResult: any;
  shortUrlDeletion: any;
  shortUrlTags: any;
  shortUrlMeta: any;
  shortUrlEdition: any;
  shortUrlVisits: any;
  tagVisits: any;
  shortUrlDetail: any;
  tagsList: any;
  tagDelete: any;
  tagEdit: any;
  mercureInfo: MercureInfo;
  settings: any;
}

export type GetState = () => ShlinkState;
