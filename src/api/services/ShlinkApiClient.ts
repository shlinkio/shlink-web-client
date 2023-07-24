import { isEmpty, isNil, reject } from 'ramda';
import type { HttpClient } from '../../common/services/HttpClient';
import type { ShortUrl, ShortUrlData } from '../../shlink-web-component/short-urls/data';
import { orderToString } from '../../utils/helpers/ordering';
import { stringifyQuery } from '../../utils/helpers/query';
import { replaceAuthorityFromUri } from '../../utils/helpers/uri';
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

type ApiVersion = 2 | 3;

type RequestOptions = {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  query?: object;
  body?: object;
  domain?: string;
};

const buildShlinkBaseUrl = (url: string, version: ApiVersion) => `${url}/rest/v${version}`;
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
  private apiVersion: ApiVersion;

  public constructor(
    private readonly httpClient: HttpClient,
    public readonly baseUrl: string,
    public readonly apiKey: string,
  ) {
    this.apiVersion = 3;
  }

  public readonly listShortUrls = async (params: ShlinkShortUrlsListParams = {}): Promise<ShlinkShortUrlsResponse> =>
    this.performRequest<{ shortUrls: ShlinkShortUrlsResponse }>(
      { url: '/short-urls', query: normalizeListParams(params) },
    ).then(({ shortUrls }) => shortUrls);

  public readonly createShortUrl = async (options: ShortUrlData): Promise<ShortUrl> => {
    const body = reject((value) => isEmpty(value) || isNil(value), options as any);
    return this.performRequest<ShortUrl>({ url: '/short-urls', method: 'POST', body });
  };

  public readonly getShortUrlVisits = async (shortCode: string, query?: ShlinkVisitsParams): Promise<ShlinkVisits> =>
    this.performRequest<{ visits: ShlinkVisits }>({ url: `/short-urls/${shortCode}/visits`, query })
      .then(({ visits }) => visits);

  public readonly getTagVisits = async (tag: string, query?: Omit<ShlinkVisitsParams, 'domain'>): Promise<ShlinkVisits> =>
    this.performRequest<{ visits: ShlinkVisits }>({ url: `/tags/${tag}/visits`, query }).then(({ visits }) => visits);

  public readonly getDomainVisits = async (domain: string, query?: Omit<ShlinkVisitsParams, 'domain'>): Promise<ShlinkVisits> =>
    this.performRequest<{ visits: ShlinkVisits }>({ url: `/domains/${domain}/visits`, query }).then(({ visits }) => visits);

  public readonly getOrphanVisits = async (query?: Omit<ShlinkVisitsParams, 'domain'>): Promise<ShlinkVisits> =>
    this.performRequest<{ visits: ShlinkVisits }>({ url: '/visits/orphan', query }).then(({ visits }) => visits);

  public readonly getNonOrphanVisits = async (query?: Omit<ShlinkVisitsParams, 'domain'>): Promise<ShlinkVisits> =>
    this.performRequest<{ visits: ShlinkVisits }>({ url: '/visits/non-orphan', query }).then(({ visits }) => visits);

  public readonly getVisitsOverview = async (): Promise<ShlinkVisitsOverview> =>
    this.performRequest<{ visits: ShlinkVisitsOverview }>({ url: '/visits' }).then(({ visits }) => visits);

  public readonly getShortUrl = async (shortCode: string, domain?: OptionalString): Promise<ShortUrl> =>
    this.performRequest<ShortUrl>({ url: `/short-urls/${shortCode}`, query: { domain } });

  public readonly deleteShortUrl = async (shortCode: string, domain?: OptionalString): Promise<void> =>
    this.performEmptyRequest({ url: `/short-urls/${shortCode}`, method: 'DELETE', query: { domain } });

  public readonly updateShortUrl = async (
    shortCode: string,
    domain: OptionalString,
    body: ShlinkShortUrlData,
  ): Promise<ShortUrl> =>
    this.performRequest<ShortUrl>({ url: `/short-urls/${shortCode}`, method: 'PATCH', query: { domain }, body });

  public readonly listTags = async (): Promise<ShlinkTags> =>
    this.performRequest<{ tags: ShlinkTagsResponse }>({ url: '/tags', query: { withStats: 'true' } })
      .then(({ tags }) => tags)
      .then(({ data, stats }) => ({ tags: data, stats }));

  public readonly tagsStats = async (): Promise<ShlinkTags> =>
    this.performRequest<{ tags: ShlinkTagsStatsResponse }>({ url: '/tags/stats' })
      .then(({ tags }) => tags)
      .then(({ data }) => ({ tags: data.map(({ tag }) => tag), stats: data }));

  public readonly deleteTags = async (tags: string[]): Promise<{ tags: string[] }> =>
    this.performEmptyRequest({ url: '/tags', method: 'DELETE', body: { tags } }).then(() => ({ tags }));

  public readonly editTag = async (oldName: string, newName: string): Promise<{ oldName: string; newName: string }> =>
    this.performEmptyRequest({
      url: '/tags',
      method: 'PUT',
      body: { oldName, newName },
    }).then(() => ({ oldName, newName }));

  public readonly health = async (domain?: string): Promise<ShlinkHealth> => this.performRequest<ShlinkHealth>(
    { url: '/health', domain },
  );

  public readonly mercureInfo = async (): Promise<ShlinkMercureInfo> =>
    this.performRequest<ShlinkMercureInfo>({ url: '/mercure-info' });

  public readonly listDomains = async (): Promise<ShlinkDomainsResponse> =>
    this.performRequest<{ domains: ShlinkDomainsResponse }>({ url: '/domains' }).then(({ domains }) => domains);

  public readonly editDomainRedirects = async (
    domainRedirects: ShlinkEditDomainRedirects,
  ): Promise<ShlinkDomainRedirects> =>
    this.performRequest<ShlinkDomainRedirects>({ url: '/domains/redirects', method: 'PATCH', body: domainRedirects });

  private readonly performRequest = async <T>(requestOptions: RequestOptions): Promise<T> =>
    this.httpClient.fetchJson<T>(...this.toFetchParams(requestOptions)).catch(
      this.handleFetchError(() => this.httpClient.fetchJson<T>(...this.toFetchParams(requestOptions))),
    );

  private readonly performEmptyRequest = async (requestOptions: RequestOptions): Promise<void> =>
    this.httpClient.fetchEmpty(...this.toFetchParams(requestOptions)).catch(
      this.handleFetchError(() => this.httpClient.fetchEmpty(...this.toFetchParams(requestOptions))),
    );

  private readonly toFetchParams = ({
    url,
    method = 'GET',
    query = {},
    body,
    domain,
  }: RequestOptions): [string, RequestInit] => {
    const normalizedQuery = stringifyQuery(rejectNilProps(query));
    const stringifiedQuery = isEmpty(normalizedQuery) ? '' : `?${normalizedQuery}`;
    const baseUrl = domain ? replaceAuthorityFromUri(this.baseUrl, domain) : this.baseUrl;

    return [`${buildShlinkBaseUrl(baseUrl, this.apiVersion)}${url}${stringifiedQuery}`, {
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
