import { Visit } from '../../visits/types'; // FIXME Should be defined here

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
  stats?: ShlinkTagsStats[]; // TODO Is only optional in old versions
}

export interface ShlinkPaginator {
  currentPage: number;
  pagesCount: number;
}

export interface ShlinkVisits {
  data: Visit[];
  pagination?: ShlinkPaginator; // TODO Is only optional in old versions
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
