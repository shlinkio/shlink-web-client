import { Visit } from '../../visits/types';
import { OptionalString } from '../../utils/utils';
import { ShortUrl, ShortUrlMeta } from '../../short-urls/data';
import { Order } from '../../utils/helpers/ordering';

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

interface ShlinkTagsStats {
  tag: string;
  shortUrlsCount: number;
  visitsCount: number;
}

export interface ShlinkTags {
  tags: string[];
  stats: ShlinkTagsStats[];
}

export interface ShlinkTagsResponse {
  data: string[];
  stats: ShlinkTagsStats[];
}

export interface ShlinkPaginator {
  currentPage: number;
  pagesCount: number;
  totalItems: number;
}

export interface ShlinkVisits {
  data: Visit[];
  pagination: ShlinkPaginator;
}

export interface ShlinkVisitsOverview {
  visitsCount: number;
  orphanVisitsCount: number;
}

export interface ShlinkVisitsParams {
  domain?: OptionalString;
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
  redirects?: ShlinkDomainRedirects; // Optional only for Shlink older than 2.8
}

export interface ShlinkDomainsResponse {
  data: ShlinkDomain[];
  defaultRedirects?: ShlinkDomainRedirects; // Optional only for Shlink older than 2.10
}

export type TagsFilteringMode = 'all' | 'any';

type ShlinkShortUrlsOrderableFields = 'dateCreated' | 'shortCode' | 'longUrl' | 'title' | 'visits' | 'nonBotVisits';

export type ShlinkShortUrlsOrder = Order<ShlinkShortUrlsOrderableFields>;

export interface ShlinkShortUrlsListParams {
  page?: string;
  itemsPerPage?: number;
  tags?: string[];
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  orderBy?: ShlinkShortUrlsOrder;
  tagsMode?: TagsFilteringMode;
}

export interface ShlinkShortUrlsListNormalizedParams extends Omit<ShlinkShortUrlsListParams, 'orderBy'> {
  orderBy?: string;
}
