import { MercureInfo } from '../mercure/reducers/mercureInfo';
import { ServersMap } from '../servers/reducers/servers';
import { SelectedServer } from '../servers/data';
import { Settings } from '../settings/reducers/settings';
import { ShortUrlMetaEdition } from '../short-urls/reducers/shortUrlMeta';
import { ShortUrlCreation } from '../short-urls/reducers/shortUrlCreation';
import { ShortUrlDeletion } from '../short-urls/reducers/shortUrlDeletion';
import { ShortUrlEdition } from '../short-urls/reducers/shortUrlEdition';
import { ShortUrlsListParams } from '../short-urls/reducers/shortUrlsListParams';
import { ShortUrlTags } from '../short-urls/reducers/shortUrlTags';

export interface ShlinkState {
  servers: ServersMap;
  selectedServer: SelectedServer;
  shortUrlsList: any;
  shortUrlsListParams: ShortUrlsListParams;
  shortUrlCreationResult: ShortUrlCreation;
  shortUrlDeletion: ShortUrlDeletion;
  shortUrlTags: ShortUrlTags;
  shortUrlMeta: ShortUrlMetaEdition;
  shortUrlEdition: ShortUrlEdition;
  shortUrlVisits: any;
  tagVisits: any;
  shortUrlDetail: any;
  tagsList: any;
  tagDelete: any;
  tagEdit: any;
  mercureInfo: MercureInfo;
  settings: Settings;
}

export type ConnectDecorator = (props: string[], actions?: string[]) => any;

export type GetState = () => ShlinkState;
