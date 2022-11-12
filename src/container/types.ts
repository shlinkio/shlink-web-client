import { MercureInfo } from '../mercure/reducers/mercureInfo';
import { SelectedServer, ServersMap } from '../servers/data';
import { Settings } from '../settings/reducers/settings';
import { ShortUrlCreation } from '../short-urls/reducers/shortUrlCreation';
import { ShortUrlDeletion } from '../short-urls/reducers/shortUrlDeletion';
import { ShortUrlEdition } from '../short-urls/reducers/shortUrlEdition';
import { ShortUrlsList } from '../short-urls/reducers/shortUrlsList';
import { TagDeletion } from '../tags/reducers/tagDelete';
import { TagEdition } from '../tags/reducers/tagEdit';
import { TagsList } from '../tags/reducers/tagsList';
import { ShortUrlDetail } from '../short-urls/reducers/shortUrlDetail';
import { ShortUrlVisits } from '../visits/reducers/shortUrlVisits';
import { TagVisits } from '../visits/reducers/tagVisits';
import { DomainsList } from '../domains/reducers/domainsList';
import { VisitsOverview } from '../visits/reducers/visitsOverview';
import { Sidebar } from '../common/reducers/sidebar';
import { DomainVisits } from '../visits/reducers/domainVisits';
import { VisitsInfo } from '../visits/reducers/types';

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
