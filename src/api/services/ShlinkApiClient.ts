import { isEmpty, isNil, reject } from 'ramda';
import { AxiosError, AxiosInstance, AxiosResponse, Method } from 'axios';
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
  ProblemDetailsError,
} from '../types';
import { orderToString } from '../../utils/helpers/ordering';
import { isRegularNotFound } from '../utils';

const buildShlinkBaseUrl = (url: string, version: 2 | 3) => `${url}/rest/v${version}`;
const rejectNilProps = reject(isNil);
const normalizeOrderByInParams = (params: ShlinkShortUrlsListParams): ShlinkShortUrlsListNormalizedParams => {
  const { orderBy = {}, ...rest } = params;

  return { ...rest, orderBy: orderToString(orderBy) };
};

export class ShlinkApiClient {
  private apiVersion: 2 | 3;

  public constructor(
    private readonly axios: AxiosInstance,
    private readonly baseUrl: string,
    private readonly apiKey: string,
  ) {
    this.apiVersion = 3;
  }

  public readonly listShortUrls = async (params: ShlinkShortUrlsListParams = {}): Promise<ShlinkShortUrlsResponse> =>
    this.performRequest<{ shortUrls: ShlinkShortUrlsResponse }>('/short-urls', 'GET', normalizeOrderByInParams(params))
      .then(({ data }) => data.shortUrls);

  public readonly createShortUrl = async (options: ShortUrlData): Promise<ShortUrl> => {
    const filteredOptions = reject((value) => isEmpty(value) || isNil(value), options as any);

    return this.performRequest<ShortUrl>('/short-urls', 'POST', {}, filteredOptions)
      .then((resp) => resp.data);
  };

  public readonly getShortUrlVisits = async (shortCode: string, query?: ShlinkVisitsParams): Promise<ShlinkVisits> =>
    this.performRequest<{ visits: ShlinkVisits }>(`/short-urls/${shortCode}/visits`, 'GET', query)
      .then(({ data }) => data.visits);

  public readonly getTagVisits = async (tag: string, query?: Omit<ShlinkVisitsParams, 'domain'>): Promise<ShlinkVisits> =>
    this.performRequest<{ visits: ShlinkVisits }>(`/tags/${tag}/visits`, 'GET', query)
      .then(({ data }) => data.visits);

  public readonly getDomainVisits = async (domain: string, query?: Omit<ShlinkVisitsParams, 'domain'>): Promise<ShlinkVisits> =>
    this.performRequest<{ visits: ShlinkVisits }>(`/domains/${domain}/visits`, 'GET', query)
      .then(({ data }) => data.visits);

  public readonly getOrphanVisits = async (query?: Omit<ShlinkVisitsParams, 'domain'>): Promise<ShlinkVisits> =>
    this.performRequest<{ visits: ShlinkVisits }>('/visits/orphan', 'GET', query)
      .then(({ data }) => data.visits);

  public readonly getNonOrphanVisits = async (query?: Omit<ShlinkVisitsParams, 'domain'>): Promise<ShlinkVisits> =>
    this.performRequest<{ visits: ShlinkVisits }>('/visits/non-orphan', 'GET', query)
      .then(({ data }) => data.visits);

  public readonly getVisitsOverview = async (): Promise<ShlinkVisitsOverview> =>
    this.performRequest<{ visits: ShlinkVisitsOverview }>('/visits', 'GET')
      .then(({ data }) => data.visits);

  public readonly getShortUrl = async (shortCode: string, domain?: OptionalString): Promise<ShortUrl> =>
    this.performRequest<ShortUrl>(`/short-urls/${shortCode}`, 'GET', { domain })
      .then(({ data }) => data);

  public readonly deleteShortUrl = async (shortCode: string, domain?: OptionalString): Promise<void> =>
    this.performRequest(`/short-urls/${shortCode}`, 'DELETE', { domain })
      .then(() => {});

  public readonly updateShortUrl = async (
    shortCode: string,
    domain: OptionalString,
    edit: ShlinkShortUrlData,
  ): Promise<ShortUrl> =>
    this.performRequest<ShortUrl>(`/short-urls/${shortCode}`, 'PATCH', { domain }, edit).then(({ data }) => data);

  public readonly listTags = async (): Promise<ShlinkTags> =>
    this.performRequest<{ tags: ShlinkTagsResponse }>('/tags', 'GET', { withStats: 'true' })
      .then((resp) => resp.data.tags)
      .then(({ data, stats }) => ({ tags: data, stats }));

  public readonly deleteTags = async (tags: string[]): Promise<{ tags: string[] }> =>
    this.performRequest('/tags', 'DELETE', { tags })
      .then(() => ({ tags }));

  public readonly editTag = async (oldName: string, newName: string): Promise<{ oldName: string; newName: string }> =>
    this.performRequest('/tags', 'PUT', {}, { oldName, newName })
      .then(() => ({ oldName, newName }));

  public readonly health = async (): Promise<ShlinkHealth> =>
    this.performRequest<ShlinkHealth>('/health', 'GET')
      .then((resp) => resp.data);

  public readonly mercureInfo = async (): Promise<ShlinkMercureInfo> =>
    this.performRequest<ShlinkMercureInfo>('/mercure-info', 'GET')
      .then((resp) => resp.data);

  public readonly listDomains = async (): Promise<ShlinkDomainsResponse> =>
    this.performRequest<{ domains: ShlinkDomainsResponse }>('/domains', 'GET').then(({ data }) => data.domains);

  public readonly editDomainRedirects = async (
    domainRedirects: ShlinkEditDomainRedirects,
  ): Promise<ShlinkDomainRedirects> =>
    this.performRequest<ShlinkDomainRedirects>('/domains/redirects', 'PATCH', {}, domainRedirects).then(({ data }) => data);

  private readonly performRequest = async <T>(url: string, method: Method = 'GET', query = {}, body = {}): Promise<AxiosResponse<T>> =>
    this.axios({
      method,
      url: `${buildShlinkBaseUrl(this.baseUrl, this.apiVersion)}${url}`,
      headers: { 'X-Api-Key': this.apiKey },
      params: rejectNilProps(query),
      data: body,
      paramsSerializer: { indexes: false },
    }).catch((e: AxiosError<ProblemDetailsError>) => {
      if (!isRegularNotFound(e.response?.data)) {
        throw e;
      }

      // If we capture a not found error, let's assume this Shlink version does not support API v3, so we decrease to
      // v2 and retry
      this.apiVersion = 2;
      return this.performRequest(url, method, query, body);
    });
}
