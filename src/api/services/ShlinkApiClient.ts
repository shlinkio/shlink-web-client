import { isEmpty, isNil, reject } from 'ramda';
import { AxiosInstance, AxiosResponse, Method } from 'axios';
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
import { stringifyQuery } from '../../utils/helpers/query';
import { orderToString } from '../../utils/helpers/ordering';

const buildShlinkBaseUrl = (url: string) => (url ? `${url}/rest/v2` : '');
const rejectNilProps = reject(isNil);
const normalizeOrderByInParams = (params: ShlinkShortUrlsListParams): ShlinkShortUrlsListNormalizedParams => {
  const { orderBy = {}, ...rest } = params;

  return { ...rest, orderBy: orderToString(orderBy) };
};

export default class ShlinkApiClient {
  public constructor(
    private readonly axios: AxiosInstance,
    private readonly baseUrl: string,
    private readonly apiKey: string,
  ) {
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

  /**
   * @deprecated. If using Shlink 2.6.0 or greater, use updateShortUrl instead
   */
  public readonly updateShortUrlTags = async (
    shortCode: string,
    domain: OptionalString,
    tags: string[],
  ): Promise<string[]> =>
    this.performRequest<{ tags: string[] }>(`/short-urls/${shortCode}/tags`, 'PUT', { domain }, { tags })
      .then(({ data }) => data.tags);

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
      url: `${buildShlinkBaseUrl(this.baseUrl)}${url}`,
      headers: { 'X-Api-Key': this.apiKey },
      params: rejectNilProps(query),
      data: body,
      paramsSerializer: stringifyQuery,
    });
}
