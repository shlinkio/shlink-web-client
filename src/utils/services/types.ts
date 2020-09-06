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
  stats?: ShlinkTagsStats[]; // Is only optional in old Shlink versions
}

export interface ShlinkTagsResponse {
  data: string[];
  stats?: ShlinkTagsStats[]; // Is only optional in old Shlink versions
}

export interface ShlinkPaginator {
  currentPage: number;
  pagesCount: number;
}

export interface ShlinkVisits {
  data: Visit[];
  pagination?: ShlinkPaginator; // Is only optional in old Shlink versions
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

export interface ProblemDetailsError {
  type: string;
  detail: string;
  title: string;
  status: number;
  error?: string; // Deprecated
  message?: string; // Deprecated
  [extraProps: string]: any;
}
