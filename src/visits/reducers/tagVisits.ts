import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { isBetween } from '../../utils/helpers/date';
import { createVisitsAsyncThunk, createVisitsReducer, lastVisitLoaderForLoader } from './common';
import { LoadVisits, VisitsInfo } from './types';

const REDUCER_PREFIX = 'shlink/tagVisits';

interface WithTag {
  tag: string;
}

export interface TagVisits extends VisitsInfo, WithTag {}

export interface LoadTagVisits extends LoadVisits, WithTag {}

const initialState: TagVisits = {
  visits: [],
  tag: '',
  loading: false,
  loadingLarge: false,
  error: false,
  cancelLoad: false,
  progress: 0,
};

export const getTagVisits = (buildShlinkApiClient: ShlinkApiClientBuilder) => createVisitsAsyncThunk({
  name: `${REDUCER_PREFIX}/getTagVisits`,
  createLoaders: ({ tag, query = {}, doIntervalFallback = false }: LoadTagVisits, getState) => {
    const { getTagVisits: getVisits } = buildShlinkApiClient(getState);
    const visitsLoader = async (page: number, itemsPerPage: number) => getVisits(
      tag,
      { ...query, page, itemsPerPage },
    );
    const lastVisitLoader = lastVisitLoaderForLoader(doIntervalFallback, async (params) => getVisits(tag, params));

    return [visitsLoader, lastVisitLoader];
  },
  getExtraFulfilledPayload: ({ tag, query = {} }: LoadTagVisits) => ({ tag, query }),
  shouldCancel: (getState) => getState().tagVisits.cancelLoad,
});

export const tagVisitsReducerCreator = (getTagVisitsCreator: ReturnType<typeof getTagVisits>) => createVisitsReducer(
  REDUCER_PREFIX,
  // @ts-expect-error TODO Fix type inference
  getTagVisitsCreator,
  initialState,
  ({ tag, query = {} }, createdVisits) => {
    const { startDate, endDate } = query;
    return createdVisits.filter(
      ({ shortUrl, visit }) => shortUrl?.tags.includes(tag) && isBetween(visit.date, startDate, endDate),
    );
  },
);
