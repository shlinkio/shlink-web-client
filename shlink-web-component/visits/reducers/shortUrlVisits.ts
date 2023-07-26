import { isBetween } from '../../../src/utils/helpers/date';
import type { ShlinkApiClient } from '../../api-contract';
import type { ShortUrlIdentifier } from '../../short-urls/data';
import { shortUrlMatches } from '../../short-urls/helpers';
import { createVisitsAsyncThunk, createVisitsReducer, lastVisitLoaderForLoader } from './common';
import type { LoadVisits, VisitsInfo } from './types';

const REDUCER_PREFIX = 'shlink/shortUrlVisits';

export interface ShortUrlVisits extends VisitsInfo, ShortUrlIdentifier {}

export interface LoadShortUrlVisits extends LoadVisits {
  shortCode: string;
}

const initialState: ShortUrlVisits = {
  visits: [],
  shortCode: '',
  domain: undefined, // Deprecated. Value from query params can be used instead
  loading: false,
  loadingLarge: false,
  error: false,
  cancelLoad: false,
  progress: 0,
};

export const getShortUrlVisits = (apiClientFactory: () => ShlinkApiClient) => createVisitsAsyncThunk({
  typePrefix: `${REDUCER_PREFIX}/getShortUrlVisits`,
  createLoaders: ({ shortCode, query = {}, doIntervalFallback = false }: LoadShortUrlVisits) => {
    const { getShortUrlVisits: shlinkGetShortUrlVisits } = apiClientFactory();
    const visitsLoader = async (page: number, itemsPerPage: number) => shlinkGetShortUrlVisits(
      shortCode,
      { ...query, page, itemsPerPage },
    );
    const lastVisitLoader = lastVisitLoaderForLoader(
      doIntervalFallback,
      async (params) => shlinkGetShortUrlVisits(shortCode, { ...params, domain: query.domain }),
    );

    return [visitsLoader, lastVisitLoader];
  },
  getExtraFulfilledPayload: ({ shortCode, query = {} }: LoadShortUrlVisits) => (
    { shortCode, query, domain: query.domain }
  ),
  shouldCancel: (getState) => getState().shortUrlVisits.cancelLoad,
});

export const shortUrlVisitsReducerCreator = (
  asyncThunkCreator: ReturnType<typeof getShortUrlVisits>,
) => createVisitsReducer({
  name: REDUCER_PREFIX,
  initialState,
  // @ts-expect-error TODO Fix type inference
  asyncThunkCreator,
  filterCreatedVisits: ({ shortCode, domain, query = {} }: ShortUrlVisits, createdVisits) => {
    const { startDate, endDate } = query;
    return createdVisits.filter(
      ({ shortUrl, visit }) =>
        shortUrl && shortUrlMatches(shortUrl, shortCode, domain) && isBetween(visit.date, startDate, endDate),
    );
  },
});
