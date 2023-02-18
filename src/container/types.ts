import type { MercureInfo } from '../mercure/reducers/mercureInfo';
import type { SelectedServer, ServersMap } from '../servers/data';
import type { Settings } from '../settings/reducers/settings';
import type { ShortUrlCreation } from '../short-urls/reducers/shortUrlCreation';
import type { ShortUrlDeletion } from '../short-urls/reducers/shortUrlDeletion';
import type { ShortUrlEdition } from '../short-urls/reducers/shortUrlEdition';
import type { ShortUrlsList } from '../short-urls/reducers/shortUrlsList';
import type { TagDeletion } from '../tags/reducers/tagDelete';
import type { TagEdition } from '../tags/reducers/tagEdit';
import type { TagsList } from '../tags/reducers/tagsList';
import type { ShortUrlDetail } from '../short-urls/reducers/shortUrlDetail';
import type { ShortUrlVisits } from '../visits/reducers/shortUrlVisits';
import type { TagVisits } from '../visits/reducers/tagVisits';
import type { DomainsList } from '../domains/reducers/domainsList';
import type { VisitsOverview } from '../visits/reducers/visitsOverview';
import type { Sidebar } from '../common/reducers/sidebar';
import type { DomainVisits } from '../visits/reducers/domainVisits';
import type { VisitsInfo } from '../visits/reducers/types';

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
