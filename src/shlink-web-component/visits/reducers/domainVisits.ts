import { isBetween } from '../../../utils/helpers/date';
import type { ShlinkApiClient } from '../../api-contract';
import { domainMatches } from '../../short-urls/helpers';
import { createVisitsAsyncThunk, createVisitsReducer, lastVisitLoaderForLoader } from './common';
import type { LoadVisits, VisitsInfo } from './types';

const REDUCER_PREFIX = 'shlink/domainVisits';

export const DEFAULT_DOMAIN = 'DEFAULT';

interface WithDomain {
  domain: string;
}

export interface DomainVisits extends VisitsInfo, WithDomain {}

export interface LoadDomainVisits extends LoadVisits, WithDomain {}

const initialState: DomainVisits = {
  visits: [],
  domain: '',
  loading: false,
  loadingLarge: false,
  error: false,
  cancelLoad: false,
  progress: 0,
};

export const getDomainVisits = (apiClient: ShlinkApiClient) => createVisitsAsyncThunk({
  typePrefix: `${REDUCER_PREFIX}/getDomainVisits`,
  createLoaders: ({ domain, query = {}, doIntervalFallback = false }: LoadDomainVisits) => {
    const { getDomainVisits: getVisits } = apiClient;
    const visitsLoader = async (page: number, itemsPerPage: number) => getVisits(
      domain,
      { ...query, page, itemsPerPage },
    );
    const lastVisitLoader = lastVisitLoaderForLoader(doIntervalFallback, async (params) => getVisits(domain, params));

    return [visitsLoader, lastVisitLoader];
  },
  getExtraFulfilledPayload: ({ domain, query = {} }: LoadDomainVisits) => ({ domain, query }),
  shouldCancel: (getState) => getState().domainVisits.cancelLoad,
});

export const domainVisitsReducerCreator = (
  asyncThunkCreator: ReturnType<typeof getDomainVisits>,
) => createVisitsReducer({
  name: REDUCER_PREFIX,
  initialState,
  // @ts-expect-error TODO Fix type inference
  asyncThunkCreator,
  filterCreatedVisits: ({ domain, query = {} }, createdVisits) => {
    const { startDate, endDate } = query;
    return createdVisits.filter(
      ({ shortUrl, visit }) =>
        shortUrl && domainMatches(shortUrl, domain) && isBetween(visit.date, startDate, endDate),
    );
  },
});
