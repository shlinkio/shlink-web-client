import type { Order } from '../../shlink-frontend-kit/src';
import type { ShortUrl, ShortUrlMeta } from '../short-urls/data';
import type { Visit } from '../visits/types';

export interface ShlinkShortUrlsResponse {
  data: ShortUrl[];
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

export interface ShlinkShortUrlData extends ShortUrlMeta {
  longUrl?: string;
  title?: string;
  validateUrl?: boolean;
  tags?: string[];
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
