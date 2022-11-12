import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { isBetween } from '../../utils/helpers/date';
import { createVisitsAsyncThunk, createVisitsReducer, lastVisitLoaderForLoader } from './common';
import { VisitsInfo } from './types';

const REDUCER_PREFIX = 'shlink/orphanVisits';

const initialState: VisitsInfo = {
  visits: [],
  loading: false,
  loadingLarge: false,
  error: false,
  cancelLoad: false,
  progress: 0,
};

export const getNonOrphanVisits = (buildShlinkApiClient: ShlinkApiClientBuilder) => createVisitsAsyncThunk({
  name: `${REDUCER_PREFIX}/getNonOrphanVisits`,
  createLoaders: ({ query = {}, doIntervalFallback = false }, getState) => {
    const { getNonOrphanVisits: shlinkGetNonOrphanVisits } = buildShlinkApiClient(getState);
    const visitsLoader = async (page: number, itemsPerPage: number) =>
      shlinkGetNonOrphanVisits({ ...query, page, itemsPerPage });
    const lastVisitLoader = lastVisitLoaderForLoader(doIntervalFallback, shlinkGetNonOrphanVisits);

    return [visitsLoader, lastVisitLoader];
  },
  getExtraFulfilledPayload: ({ query = {} }) => ({ query }),
  shouldCancel: (getState) => getState().orphanVisits.cancelLoad,
});

export const nonOrphanVisitsReducerCreator = (
  getVisitsCreator: ReturnType<typeof getNonOrphanVisits>,
) => createVisitsReducer(
  REDUCER_PREFIX,
  getVisitsCreator,
  initialState,
  ({ query = {} }, createdVisits) => {
    const { startDate, endDate } = query;
    return createdVisits.filter(({ visit }) => isBetween(visit.date, startDate, endDate));
  },
);
