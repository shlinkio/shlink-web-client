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
import { ShortUrlsList } from '../short-urls/reducers/shortUrlsList';
import { TagDeletion } from '../tags/reducers/tagDelete';
import { TagEdition } from '../tags/reducers/tagEdit';
import { TagsList } from '../tags/reducers/tagsList';

export interface ShlinkState {
  servers: ServersMap;
  selectedServer: SelectedServer;
  shortUrlsList: ShortUrlsList;
  shortUrlsListParams: ShortUrlsListParams;
  shortUrlCreationResult: ShortUrlCreation;
  shortUrlDeletion: ShortUrlDeletion;
  shortUrlTags: ShortUrlTags;
  shortUrlMeta: ShortUrlMetaEdition;
  shortUrlEdition: ShortUrlEdition;
  shortUrlVisits: any;
  tagVisits: any;
  shortUrlDetail: any;
  tagsList: TagsList;
  tagDelete: TagDeletion;
  tagEdit: TagEdition;
  mercureInfo: MercureInfo;
  settings: Settings;
}

export type ConnectDecorator = (props: string[], actions?: string[]) => any;

export type GetState = () => ShlinkState;
