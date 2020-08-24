import { MercureInfo } from '../mercure/reducers/mercureInfo';
import { ServersMap } from '../servers/reducers/servers';
import { SelectedServer } from '../servers/data';
import { Settings } from '../settings/reducers/settings';
import { ShortUrlMetaEdition } from '../short-urls/reducers/shortUrlMeta';
import { ShortUrlCreation } from '../short-urls/reducers/shortUrlCreation';

export type ConnectDecorator = (props: string[], actions?: string[]) => any;

export interface ShlinkState {
  servers: ServersMap;
  selectedServer: SelectedServer;
  shortUrlsList: any;
  shortUrlsListParams: any;
  shortUrlCreationResult: ShortUrlCreation;
  shortUrlDeletion: any;
  shortUrlTags: any;
  shortUrlMeta: ShortUrlMetaEdition;
  shortUrlEdition: any;
  shortUrlVisits: any;
  tagVisits: any;
  shortUrlDetail: any;
  tagsList: any;
  tagDelete: any;
  tagEdit: any;
  mercureInfo: MercureInfo;
  settings: Settings;
}

export type GetState = () => ShlinkState;
