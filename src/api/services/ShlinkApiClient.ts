import { isEmpty, isNil, reject } from 'ramda';
import { ShortUrl, ShortUrlData } from '../../short-urls/data';
import { OptionalString } from '../../utils/utils';
import {
  ShlinkHealth,
  ShlinkMercureInfo,
  ShlinkShortUrlsResponse,
  ShlinkTags,
  ShlinkTagsResponse,
  ShlinkVisits,
  ShlinkVisitsParams,
  ShlinkShortUrlData,
  ShlinkDomainsResponse,
  ShlinkVisitsOverview,
  ShlinkEditDomainRedirects,
  ShlinkDomainRedirects,
  ShlinkShortUrlsListParams,
  ShlinkShortUrlsListNormalizedParams,
} from '../types';
import { orderToString } from '../../utils/helpers/ordering';
import { isRegularNotFound, parseApiError } from '../utils';
import { stringifyQuery } from '../../utils/helpers/query';
import { Fetch } from '../../utils/types';

const buildShlinkBaseUrl = (url: string, version: 2 | 3) => `${url}/rest/v${version}`;
const rejectNilProps = reject(isNil);
const normalizeOrderByInParams = (params: ShlinkShortUrlsListParams): ShlinkShortUrlsListNormalizedParams => {
  const { orderBy = {}, ...rest } = params;

  return { ...rest, orderBy: orderToString(orderBy) };
};

export class ShlinkApiClient {
  private apiVersion: 2 | 3;

  public constructor(
    private readonly fetch: Fetch,
    private readonly baseUrl: string,
    private readonly apiKey: string,
  ) {
    this.apiVersion = 3;
  }

  public readonly listShortUrls = async (params: ShlinkShortUrlsListParams = {}): Promise<ShlinkShortUrlsResponse> =>
    this.performRequest<{ shortUrls: ShlinkShortUrlsResponse }>('/short-urls', 'GET', normalizeOrderByInParams(params))
      .then(({ shortUrls }) => shortUrls);

  public readonly createShortUrl = async (options: ShortUrlData): Promise<ShortUrl> => {
    const filteredOptions = reject((value) => isEmpty(value) || isNil(value), options as any);

    return this.performRequest<ShortUrl>('/short-urls', 'POST', {}, filteredOptions);
  };

  public readonly getShortUrlVisits = async (shortCode: string, query?: ShlinkVisitsParams): Promise<ShlinkVisits> =>
    this.performRequest<{ visits: ShlinkVisits }>(`/short-urls/${shortCode}/visits`, 'GET', query)
      .then(({ visits }) => visits);

  public readonly getTagVisits = async (tag: string, query?: Omit<ShlinkVisitsParams, 'domain'>): Promise<ShlinkVisits> =>
    this.performRequest<{ visits: ShlinkVisits }>(`/tags/${tag}/visits`, 'GET', query)
      .then(({ visits }) => visits);

  public readonly getDomainVisits = async (domain: string, query?: Omit<ShlinkVisitsParams, 'domain'>): Promise<ShlinkVisits> =>
    this.performRequest<{ visits: ShlinkVisits }>(`/domains/${domain}/visits`, 'GET', query)
      .then(({ visits }) => visits);

  public readonly getOrphanVisits = async (query?: Omit<ShlinkVisitsParams, 'domain'>): Promise<ShlinkVisits> =>
    this.performRequest<{ visits: ShlinkVisits }>('/visits/orphan', 'GET', query)
      .then(({ visits }) => visits);

  public readonly getNonOrphanVisits = async (query?: Omit<ShlinkVisitsParams, 'domain'>): Promise<ShlinkVisits> =>
    this.performRequest<{ visits: ShlinkVisits }>('/visits/non-orphan', 'GET', query)
      .then(({ visits }) => visits);

  public readonly getVisitsOverview = async (): Promise<ShlinkVisitsOverview> =>
    this.performRequest<{ visits: ShlinkVisitsOverview }>('/visits')
      .then(({ visits }) => visits);

  public readonly getShortUrl = async (shortCode: string, domain?: OptionalString): Promise<ShortUrl> =>
    this.performRequest<ShortUrl>(`/short-urls/${shortCode}`, 'GET', { domain });

  public readonly deleteShortUrl = async (shortCode: string, domain?: OptionalString): Promise<void> =>
    this.performRequest(`/short-urls/${shortCode}`, 'DELETE', { domain })
      .then(() => {});

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

  public readonly deleteTags = async (tags: string[]): Promise<{ tags: string[] }> =>
    this.performRequest('/tags', 'DELETE', { tags })
      .then(() => ({ tags }));

  public readonly editTag = async (oldName: string, newName: string): Promise<{ oldName: string; newName: string }> =>
    this.performRequest('/tags', 'PUT', {}, { oldName, newName })
      .then(() => ({ oldName, newName }));

  public readonly health = async (): Promise<ShlinkHealth> => this.performRequest<ShlinkHealth>('/health', 'GET');

  public readonly mercureInfo = async (): Promise<ShlinkMercureInfo> =>
    this.performRequest<ShlinkMercureInfo>('/mercure-info', 'GET');

  public readonly listDomains = async (): Promise<ShlinkDomainsResponse> =>
    this.performRequest<{ domains: ShlinkDomainsResponse }>('/domains').then(({ domains }) => domains);

  public readonly editDomainRedirects = async (
    domainRedirects: ShlinkEditDomainRedirects,
  ): Promise<ShlinkDomainRedirects> =>
    this.performRequest<ShlinkDomainRedirects>('/domains/redirects', 'PATCH', {}, domainRedirects);

  private readonly performRequest = async <T>(url: string, method = 'GET', query = {}, body?: object): Promise<T> => {
    const normalizedQuery = stringifyQuery(rejectNilProps(query));
    const stringifiedQuery = isEmpty(normalizedQuery) ? '' : `?${normalizedQuery}`;

    return this.fetch(`${buildShlinkBaseUrl(this.baseUrl, this.apiVersion)}${url}${stringifiedQuery}`, {
      method,
      body: body && JSON.stringify(body),
      headers: { 'X-Api-Key': this.apiKey },
    })
      .then(async (resp) => {
        const parsed = await resp.json();

        if (!resp.ok) {
          throw parsed; // eslint-disable-line @typescript-eslint/no-throw-literal
        }

        return parsed as T; // TODO Improve type inference here without explicit casting
      })
      .catch((e: unknown) => {
        if (!isRegularNotFound(parseApiError(e))) {
          throw e;
        }

        // If we capture a not found error, let's assume this Shlink version does not support API v3, so we decrease to
        // v2 and retry
        this.apiVersion = 2;
        return this.performRequest(url, method, query, body);
      });
  };
}
