import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { isBetween } from '../../utils/helpers/date';
import { createVisitsAsyncThunk, createVisitsReducer, lastVisitLoaderForLoader } from './common';
import { domainMatches } from '../../short-urls/helpers';
import { LoadVisits, VisitsInfo } from './types';

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

export const getDomainVisits = (buildShlinkApiClient: ShlinkApiClientBuilder) => createVisitsAsyncThunk({
  name: `${REDUCER_PREFIX}/getDomainVisits`,
  createLoaders: ({ domain, query = {}, doIntervalFallback = false }: LoadDomainVisits, getState) => {
    const { getDomainVisits: getVisits } = buildShlinkApiClient(getState);
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
  getVisitsCreator: ReturnType<typeof getDomainVisits>,
) => createVisitsReducer(
  REDUCER_PREFIX,
  // @ts-expect-error TODO Fix type inference
  getVisitsCreator,
  initialState,
  ({ domain, query = {} }, createdVisits) => {
    const { startDate, endDate } = query;
    return createdVisits.filter(
      ({ shortUrl, visit }) =>
        shortUrl && domainMatches(shortUrl, domain) && isBetween(visit.date, startDate, endDate),
    );
  },
);
