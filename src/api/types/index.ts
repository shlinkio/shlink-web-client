import { Visit } from '../../visits/types';
import { OptionalString } from '../../utils/utils';
import { ShortUrl, ShortUrlMeta } from '../../short-urls/data';

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
  stats?: ShlinkTagsStats[]; // Is only optional in Shlink older than v2.2
}

export interface ShlinkTagsResponse {
  data: string[];
  stats?: ShlinkTagsStats[]; // Is only optional in Shlink older than v2.2
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
  orphanVisitsCount?: number; // Optional only for versions older than 2.6.0
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

interface ShlinkDomainRedirects {
  baseUrlRedirect: string,
  regular404Redirect: string,
  invalidShortUrlRedirect: string
}

export interface ShlinkDomain {
  domain: string;
  isDefault: boolean;
  redirects?: ShlinkDomainRedirects; // Optional only for Shlink older than 2.8
}

export interface ShlinkDomainsResponse {
  data: ShlinkDomain[];
}

export interface ProblemDetailsError {
  type: string;
  detail: string;
  title: string;
  status: number;

  [extraProps: string]: any;
}

export interface InvalidArgumentError extends ProblemDetailsError {
  type: 'INVALID_ARGUMENT';
  invalidElements: string[];
}

export interface InvalidShortUrlDeletion extends ProblemDetailsError {
  type: 'INVALID_SHORTCODE_DELETION';
  threshold: number;
}
