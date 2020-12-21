import { Visit } from '../../visits/types'; // FIXME Should be defined as part of this module
import { ShortUrl, ShortUrlMeta } from '../../short-urls/data'; // FIXME Should be defined as part of this module
import { OptionalString } from '../utils';

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
}

export interface ShlinkVisitsParams {
  domain?: OptionalString;
  page?: number;
  itemsPerPage?: number;
  startDate?: string;
  endDate?: string;
}

export interface ShlinkShortUrlMeta extends ShortUrlMeta {
  longUrl?: string;
}

export interface ShlinkDomain {
  domain: string;
  isDefault: boolean;
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

export const isInvalidArgumentError = (error?: ProblemDetailsError): error is InvalidArgumentError =>
  error?.type === 'INVALID_ARGUMENT';
