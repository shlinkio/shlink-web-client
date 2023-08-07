import type { ShortUrlData } from '../short-urls/data';
import type {
  ShlinkDomainRedirects,
  ShlinkDomainsResponse,
  ShlinkEditDomainRedirects,
  ShlinkHealth,
  ShlinkMercureInfo,
  ShlinkShortUrl,
  ShlinkShortUrlData,
  ShlinkShortUrlsListParams,
  ShlinkShortUrlsResponse,
  ShlinkTags,
  ShlinkVisits,
  ShlinkVisitsOverview,
  ShlinkVisitsParams,
} from './types';

export type ShlinkApiClient = {
  readonly baseUrl: string;
  readonly apiKey: string;

  listShortUrls(params?: ShlinkShortUrlsListParams): Promise<ShlinkShortUrlsResponse>;

  createShortUrl(options: ShortUrlData): Promise<ShlinkShortUrl>;

  getShortUrlVisits(shortCode: string, query?: ShlinkVisitsParams): Promise<ShlinkVisits>;

  getTagVisits(tag: string, query?: Omit<ShlinkVisitsParams, 'domain'>): Promise<ShlinkVisits>;

  getDomainVisits(domain: string, query?: Omit<ShlinkVisitsParams, 'domain'>): Promise<ShlinkVisits>;

  getOrphanVisits(query?: Omit<ShlinkVisitsParams, 'domain'>): Promise<ShlinkVisits>;

  getNonOrphanVisits(query?: Omit<ShlinkVisitsParams, 'domain'>): Promise<ShlinkVisits>;

  getVisitsOverview(): Promise<ShlinkVisitsOverview>;

  getShortUrl(shortCode: string, domain?: string | null): Promise<ShlinkShortUrl>;

  deleteShortUrl(shortCode: string, domain?: string | null): Promise<void>;

  updateShortUrl(
    shortCode: string,
    domain: string | null | undefined,
    body: ShlinkShortUrlData,
  ): Promise<ShlinkShortUrl>;

  listTags(): Promise<ShlinkTags>;

  tagsStats(): Promise<ShlinkTags>;

  deleteTags(tags: string[]): Promise<{ tags: string[] }>;

  editTag(oldName: string, newName: string): Promise<{ oldName: string; newName: string }>;

  health(authority?: string): Promise<ShlinkHealth>;

  mercureInfo(): Promise<ShlinkMercureInfo>;

  listDomains(): Promise<ShlinkDomainsResponse>;

  editDomainRedirects(domainRedirects: ShlinkEditDomainRedirects): Promise<ShlinkDomainRedirects>;
};
