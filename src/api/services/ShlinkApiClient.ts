import { isEmpty, isNil, reject } from 'ramda';
import type { HttpClient } from '../../common/services/HttpClient';
import type { ShortUrl, ShortUrlData } from '../../short-urls/data';
import { orderToString } from '../../utils/helpers/ordering';
import { stringifyQuery } from '../../utils/helpers/query';
import type { OptionalString } from '../../utils/utils';
import type {
  ShlinkDomainRedirects,
  ShlinkDomainsResponse,
  ShlinkEditDomainRedirects,
  ShlinkHealth,
  ShlinkMercureInfo,
  ShlinkShortUrlData,
  ShlinkShortUrlsListNormalizedParams,
  ShlinkShortUrlsListParams,
  ShlinkShortUrlsResponse,
  ShlinkTags,
  ShlinkTagsResponse,
  ShlinkTagsStatsResponse,
  ShlinkVisits,
  ShlinkVisitsOverview,
  ShlinkVisitsParams,
} from '../types';
import { isRegularNotFound, parseApiError } from '../utils';

const buildShlinkBaseUrl = (url: string, version: 2 | 3) => `${url}/rest/v${version}`;
const rejectNilProps = reject(isNil);
const normalizeListParams = (
  { orderBy = {}, excludeMaxVisitsReached, excludePastValidUntil, ...rest }: ShlinkShortUrlsListParams,
): ShlinkShortUrlsListNormalizedParams => ({
  ...rest,
  excludeMaxVisitsReached: excludeMaxVisitsReached === true ? 'true' : undefined,
  excludePastValidUntil: excludePastValidUntil === true ? 'true' : undefined,
  orderBy: orderToString(orderBy),
});

export class ShlinkApiClient {
  private apiVersion: 2 | 3;

  public constructor(
    private readonly httpClient: HttpClient,
    private readonly baseUrl: string,
    private readonly apiKey: string,
  ) {
    this.apiVersion = 3;
  }

  public readonly listShortUrls = async (params: ShlinkShortUrlsListParams = {}): Promise<ShlinkShortUrlsResponse> =>
    this.performRequest<{ shortUrls: ShlinkShortUrlsResponse }>('/short-urls', 'GET', normalizeListParams(params))
      .then(({ shortUrls }) => shortUrls);

  public readonly createShortUrl = async (options: ShortUrlData): Promise<ShortUrl> => {
    const filteredOptions = reject((value) => isEmpty(value) || isNil(value), options as any);
    return this.performRequest<ShortUrl>('/short-urls', 'POST', {}, filteredOptions);
  };

  public readonly getShortUrlVisits = async (shortCode: string, query?: ShlinkVisitsParams): Promise<ShlinkVisits> =>
    this.performRequest<{ visits: ShlinkVisits }>(`/short-urls/${shortCode}/visits`, 'GET', query)
      .then(({ visits }) => visits);

  public readonly getTagVisits = async (tag: string, query?: Omit<ShlinkVisitsParams, 'domain'>): Promise<ShlinkVisits> =>
    this.performRequest<{ visits: ShlinkVisits }>(`/tags/${tag}/visits`, 'GET', query).then(({ visits }) => visits);

  public readonly getDomainVisits = async (domain: string, query?: Omit<ShlinkVisitsParams, 'domain'>): Promise<ShlinkVisits> =>
    this.performRequest<{ visits: ShlinkVisits }>(`/domains/${domain}/visits`, 'GET', query).then(({ visits }) => visits);

  public readonly getOrphanVisits = async (query?: Omit<ShlinkVisitsParams, 'domain'>): Promise<ShlinkVisits> =>
    this.performRequest<{ visits: ShlinkVisits }>('/visits/orphan', 'GET', query).then(({ visits }) => visits);

  public readonly getNonOrphanVisits = async (query?: Omit<ShlinkVisitsParams, 'domain'>): Promise<ShlinkVisits> =>
    this.performRequest<{ visits: ShlinkVisits }>('/visits/non-orphan', 'GET', query).then(({ visits }) => visits);

  public readonly getVisitsOverview = async (): Promise<ShlinkVisitsOverview> =>
    this.performRequest<{ visits: ShlinkVisitsOverview }>('/visits').then(({ visits }) => visits);

  public readonly getShortUrl = async (shortCode: string, domain?: OptionalString): Promise<ShortUrl> =>
    this.performRequest<ShortUrl>(`/short-urls/${shortCode}`, 'GET', { domain });

  public readonly deleteShortUrl = async (shortCode: string, domain?: OptionalString): Promise<void> =>
    this.performEmptyRequest(`/short-urls/${shortCode}`, 'DELETE', { domain });

  public readonly updateShortUrl = async (
    shortCode: string,
    domain: OptionalString,
    edit: ShlinkShortUrlData,
  ): Promise<ShortUrl> =>
    this.performRequest<ShortUrl>(`/short-urls/${shortCode}`, 'PATCH', { domain }, edit);

  public readonly listTags = async (): Promise<ShlinkTags> =>
    this.performRequest<{ tags: ShlinkTagsResponse }>('/tags', 'GET', { withStats: 'true' })
      .then(({ tags }) => tags)
      .then(({ data, stats }) => ({ tags: data, stats }));

  public readonly tagsStats = async (): Promise<ShlinkTags> =>
    this.performRequest<{ tags: ShlinkTagsStatsResponse }>('/tags/stats', 'GET')
      .then(({ tags }) => tags)
      .then(({ data }) => ({ tags: data.map(({ tag }) => tag), stats: data }));

  public readonly deleteTags = async (tags: string[]): Promise<{ tags: string[] }> =>
    this.performEmptyRequest('/tags', 'DELETE', { tags }).then(() => ({ tags }));

  public readonly editTag = async (oldName: string, newName: string): Promise<{ oldName: string; newName: string }> =>
    this.performEmptyRequest('/tags', 'PUT', {}, { oldName, newName }).then(() => ({ oldName, newName }));

  public readonly health = async (): Promise<ShlinkHealth> => this.performRequest<ShlinkHealth>('/health', 'GET');

  public readonly mercureInfo = async (): Promise<ShlinkMercureInfo> =>
    this.performRequest<ShlinkMercureInfo>('/mercure-info', 'GET');

  public readonly listDomains = async (): Promise<ShlinkDomainsResponse> =>
    this.performRequest<{ domains: ShlinkDomainsResponse }>('/domains').then(({ domains }) => domains);

  public readonly editDomainRedirects = async (
    domainRedirects: ShlinkEditDomainRedirects,
  ): Promise<ShlinkDomainRedirects> =>
    this.performRequest<ShlinkDomainRedirects>('/domains/redirects', 'PATCH', {}, domainRedirects);

  private readonly performRequest = async <T>(url: string, method = 'GET', query = {}, body?: object): Promise<T> =>
    this.httpClient.fetchJson<T>(...this.toFetchParams(url, method, query, body)).catch(
      this.handleFetchError(() => this.httpClient.fetchJson<T>(...this.toFetchParams(url, method, query, body))),
    );

  private readonly performEmptyRequest = async (url: string, method = 'GET', query = {}, body?: object): Promise<void> =>
    this.httpClient.fetchEmpty(...this.toFetchParams(url, method, query, body)).catch(
      this.handleFetchError(() => this.httpClient.fetchEmpty(...this.toFetchParams(url, method, query, body))),
    );

  private readonly toFetchParams = (url: string, method: string, query = {}, body?: object): [string, RequestInit] => {
    const normalizedQuery = stringifyQuery(rejectNilProps(query));
    const stringifiedQuery = isEmpty(normalizedQuery) ? '' : `?${normalizedQuery}`;

    return [`${buildShlinkBaseUrl(this.baseUrl, this.apiVersion)}${url}${stringifiedQuery}`, {
      method,
      body: body && JSON.stringify(body),
      headers: { 'X-Api-Key': this.apiKey },
    }];
  };

  private readonly handleFetchError = (retryFetch: Function) => (e: unknown) => {
    if (!isRegularNotFound(parseApiError(e))) {
      throw e;
    }

    // If we capture a not found error, let's assume this Shlink version does not support API v3, so we decrease to
    // v2 and retry
    this.apiVersion = 2;
    return retryFetch();
  };
}
