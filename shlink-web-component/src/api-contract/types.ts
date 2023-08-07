import type { Order } from '@shlinkio/shlink-frontend-kit';
import type { Nullable, OptionalString } from '../utils/helpers';
import type { Visit } from '../visits/types';

export interface ShlinkDeviceLongUrls {
  android?: OptionalString;
  ios?: OptionalString;
  desktop?: OptionalString;
}

export interface ShlinkShortUrlMeta {
  validSince?: string;
  validUntil?: string;
  maxVisits?: number;
}

export interface ShlinkShortUrl {
  shortCode: string;
  shortUrl: string;
  longUrl: string;
  deviceLongUrls?: Required<ShlinkDeviceLongUrls>, // Optional only before Shlink 3.5.0
  dateCreated: string;
  /** @deprecated */
  visitsCount: number; // Deprecated since Shlink 3.4.0
  visitsSummary?: ShlinkVisitsSummary; // Optional only before Shlink 3.4.0
  meta: Required<Nullable<ShlinkShortUrlMeta>>;
  tags: string[];
  domain: string | null;
  title?: string | null;
  crawlable?: boolean;
  forwardQuery?: boolean;
}

export interface ShlinkEditShortUrlData {
  longUrl?: string;
  title?: string | null;
  tags?: string[];
  deviceLongUrls?: ShlinkDeviceLongUrls;
  crawlable?: boolean;
  forwardQuery?: boolean;
  validSince?: string | null;
  validUntil?: string | null;
  maxVisits?: number | null;

  /** @deprecated */
  validateUrl?: boolean;
}

export interface ShlinkCreateShortUrlData extends Omit<ShlinkEditShortUrlData, 'deviceLongUrls'> {
  longUrl: string;
  customSlug?: string;
  shortCodeLength?: number;
  domain?: string;
  findIfExists?: boolean;
  deviceLongUrls?: {
    android?: string;
    ios?: string;
    desktop?: string;
  }
}

export interface ShlinkShortUrlsResponse {
  data: ShlinkShortUrl[];
  pagination: ShlinkPaginator;
}

export interface ShlinkMercureInfo {
  token: string;
  mercureHubUrl: string;
}

export interface ShlinkHealth {
  status: 'pass' | 'fail';
  version: string;
}

export interface ShlinkTagsStats {
  tag: string;
  shortUrlsCount: number;
  visitsSummary?: ShlinkVisitsSummary; // Optional only before Shlink 3.5.0

  /** @deprecated */
  visitsCount: number;
}

export interface ShlinkTags {
  tags: string[];
  stats: ShlinkTagsStats[];
}

export interface ShlinkTagsResponse {
  data: string[];
  /** @deprecated Present only when withStats=true is provided, which is deprecated */
  stats: ShlinkTagsStats[];
}

export interface ShlinkTagsStatsResponse {
  data: ShlinkTagsStats[];
}

export interface ShlinkPaginator {
  currentPage: number;
  pagesCount: number;
  totalItems: number;
}

export interface ShlinkVisitsSummary {
  total: number;
  nonBots: number;
  bots: number;
}

export interface ShlinkVisits {
  data: Visit[];
  pagination: ShlinkPaginator;
}

export interface ShlinkVisitsOverview {
  nonOrphanVisits?: ShlinkVisitsSummary; // Optional only before Shlink 3.5.0
  orphanVisits?: ShlinkVisitsSummary; // Optional only before Shlink 3.5.0

  /** @deprecated */
  visitsCount: number;
  /** @deprecated */
  orphanVisitsCount: number;
}

export interface ShlinkVisitsParams {
  domain?: string | null;
  page?: number;
  itemsPerPage?: number;
  startDate?: string;
  endDate?: string;
  excludeBots?: boolean;
}

export interface ShlinkDomainRedirects {
  baseUrlRedirect: string | null;
  regular404Redirect: string | null;
  invalidShortUrlRedirect: string | null;
}

export interface ShlinkEditDomainRedirects extends Partial<ShlinkDomainRedirects> {
  domain: string;
}

export interface ShlinkDomain {
  domain: string;
  isDefault: boolean;
  redirects: ShlinkDomainRedirects;
}

export interface ShlinkDomainsResponse {
  data: ShlinkDomain[];
  defaultRedirects: ShlinkDomainRedirects;
}

export type TagsFilteringMode = 'all' | 'any';

type ShlinkShortUrlsOrderableFields = 'dateCreated' | 'shortCode' | 'longUrl' | 'title' | 'visits' | 'nonBotVisits';

export type ShlinkShortUrlsOrder = Order<ShlinkShortUrlsOrderableFields>;

export interface ShlinkShortUrlsListParams {
  page?: string;
  itemsPerPage?: number;
  searchTerm?: string;
  tags?: string[];
  tagsMode?: TagsFilteringMode;
  orderBy?: ShlinkShortUrlsOrder;
  startDate?: string;
  endDate?: string;
  excludeMaxVisitsReached?: boolean;
  excludePastValidUntil?: boolean;
}

export interface ShlinkShortUrlsListNormalizedParams extends
  Omit<ShlinkShortUrlsListParams, 'orderBy' | 'excludeMaxVisitsReached' | 'excludePastValidUntil'> {
  orderBy?: string;
  excludeMaxVisitsReached?: 'true';
  excludePastValidUntil?: 'true';
}
