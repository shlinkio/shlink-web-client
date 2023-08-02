import type { ShlinkApiClient } from '../../api-contract';
import { isBetween } from '../../utils/dates/helpers/date';
import type { OrphanVisit, OrphanVisitType } from '../types';
import { isOrphanVisit } from '../types/helpers';
import { createVisitsAsyncThunk, createVisitsReducer, lastVisitLoaderForLoader } from './common';
import type { LoadVisits, VisitsInfo } from './types';

const REDUCER_PREFIX = 'shlink/orphanVisits';

export interface LoadOrphanVisits extends LoadVisits {
  orphanVisitsType?: OrphanVisitType;
}

const initialState: VisitsInfo = {
  visits: [],
  loading: false,
  loadingLarge: false,
  error: false,
  cancelLoad: false,
  progress: 0,
};

const matchesType = (visit: OrphanVisit, orphanVisitsType?: OrphanVisitType) =>
  !orphanVisitsType || orphanVisitsType === visit.type;

export const getOrphanVisits = (apiClientFactory: () => ShlinkApiClient) => createVisitsAsyncThunk({
  typePrefix: `${REDUCER_PREFIX}/getOrphanVisits`,
  createLoaders: ({ orphanVisitsType, query = {}, doIntervalFallback = false }: LoadOrphanVisits) => {
    const { getOrphanVisits: getVisits } = apiClientFactory();
    const visitsLoader = async (page: number, itemsPerPage: number) => getVisits({ ...query, page, itemsPerPage })
      .then((result) => {
        const visits = result.data.filter((visit) => isOrphanVisit(visit) && matchesType(visit, orphanVisitsType));
        return { ...result, data: visits };
      });
    const lastVisitLoader = lastVisitLoaderForLoader(doIntervalFallback, getVisits);

    return [visitsLoader, lastVisitLoader];
  },
  getExtraFulfilledPayload: ({ query = {} }: LoadOrphanVisits) => ({ query }),
  shouldCancel: (getState) => getState().orphanVisits.cancelLoad,
});

export const orphanVisitsReducerCreator = (
  asyncThunkCreator: ReturnType<typeof getOrphanVisits>,
) => createVisitsReducer({
  name: REDUCER_PREFIX,
  initialState,
  asyncThunkCreator,
  filterCreatedVisits: ({ query = {} }, createdVisits) => {
    const { startDate, endDate } = query;
    return createdVisits.filter(({ visit, shortUrl }) => !shortUrl && isBetween(visit.date, startDate, endDate));
  },
});
