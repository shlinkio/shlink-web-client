import type { Sidebar } from '../common/reducers/sidebar';
import type { MercureInfo } from '../mercure/reducers/mercureInfo';
import type { SelectedServer, ServersMap } from '../servers/data';
import type { Settings } from '../settings/reducers/settings';
import type { DomainsList } from '../shlink-web-component/domains/reducers/domainsList';
import type { ShortUrlCreation } from '../shlink-web-component/short-urls/reducers/shortUrlCreation';
import type { ShortUrlDeletion } from '../shlink-web-component/short-urls/reducers/shortUrlDeletion';
import type { ShortUrlDetail } from '../shlink-web-component/short-urls/reducers/shortUrlDetail';
import type { ShortUrlEdition } from '../shlink-web-component/short-urls/reducers/shortUrlEdition';
import type { ShortUrlsList } from '../shlink-web-component/short-urls/reducers/shortUrlsList';
import type { TagDeletion } from '../shlink-web-component/tags/reducers/tagDelete';
import type { TagEdition } from '../shlink-web-component/tags/reducers/tagEdit';
import type { TagsList } from '../shlink-web-component/tags/reducers/tagsList';
import type { DomainVisits } from '../shlink-web-component/visits/reducers/domainVisits';
import type { ShortUrlVisits } from '../shlink-web-component/visits/reducers/shortUrlVisits';
import type { TagVisits } from '../shlink-web-component/visits/reducers/tagVisits';
import type { VisitsInfo } from '../shlink-web-component/visits/reducers/types';
import type { VisitsOverview } from '../shlink-web-component/visits/reducers/visitsOverview';

export interface ShlinkState {
  servers: ServersMap;
  selectedServer: SelectedServer;
  shortUrlsList: ShortUrlsList;
  shortUrlCreation: ShortUrlCreation;
  shortUrlDeletion: ShortUrlDeletion;
  shortUrlEdition: ShortUrlEdition;
  shortUrlVisits: ShortUrlVisits;
  tagVisits: TagVisits;
  domainVisits: DomainVisits;
  orphanVisits: VisitsInfo;
  nonOrphanVisits: VisitsInfo;
  shortUrlDetail: ShortUrlDetail;
  tagsList: TagsList;
  tagDelete: TagDeletion;
  tagEdit: TagEdition;
  mercureInfo: MercureInfo;
  settings: Settings;
  domainsList: DomainsList;
  visitsOverview: VisitsOverview;
  appUpdated: boolean;
  sidebar: Sidebar;
}

export type ConnectDecorator = (props: string[] | null, actions?: string[]) => any;

export type GetState = () => ShlinkState;
