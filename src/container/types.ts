import { MercureInfo } from '../mercure/reducers/mercureInfo';
import { SelectedServer, ServersMap } from '../servers/data';
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
import { ShortUrlDetail } from '../visits/reducers/shortUrlDetail';
import { ShortUrlVisits } from '../visits/reducers/shortUrlVisits';
import { TagVisits } from '../visits/reducers/tagVisits';
import { DomainsList } from '../domains/reducers/domainsList';
import { VisitsOverview } from '../visits/reducers/visitsOverview';

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
  shortUrlVisits: ShortUrlVisits;
  tagVisits: TagVisits;
  shortUrlDetail: ShortUrlDetail;
  tagsList: TagsList;
  tagDelete: TagDeletion;
  tagEdit: TagEdition;
  mercureInfo: MercureInfo;
  settings: Settings;
  domainsList: DomainsList;
  visitsOverview: VisitsOverview;
}

export type ConnectDecorator = (props: string[] | null, actions?: string[]) => any;

export type GetState = () => ShlinkState;
