import { createSlice } from '@reduxjs/toolkit';
import { OrphanVisit, OrphanVisitType } from '../types';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { isOrphanVisit } from '../types/helpers';
import { isBetween } from '../../utils/helpers/date';
import { createVisitsAsyncThunk, lastVisitLoaderForLoader } from './common';
import { createNewVisits, CreateVisitsAction } from './visitCreation';
import { LoadVisits, VisitsInfo } from './types';
import { parseApiError } from '../../api/utils';

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

export const getOrphanVisits = (buildShlinkApiClient: ShlinkApiClientBuilder) => createVisitsAsyncThunk({
  actionsPrefix: `${REDUCER_PREFIX}/getOrphanVisits`,
  createLoaders: ({ orphanVisitsType, query = {}, doIntervalFallback = false }: LoadOrphanVisits, getState) => {
    const { getOrphanVisits: getVisits } = buildShlinkApiClient(getState);
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
  { asyncThunk, largeAction, progressChangedAction, fallbackToIntervalAction }: ReturnType<typeof getOrphanVisits>,
) => {
  const { reducer, actions } = createSlice({
    name: REDUCER_PREFIX,
    initialState,
    reducers: {
      cancelGetOrphanVisits: (state) => ({ ...state, cancelLoad: true }),
    },
    extraReducers: (builder) => {
      builder.addCase(asyncThunk.pending, () => ({ ...initialState, loading: true }));
      builder.addCase(asyncThunk.rejected, (_, { error }) => (
        { ...initialState, error: true, errorData: parseApiError(error) }
      ));
      builder.addCase(asyncThunk.fulfilled, (state, { payload }) => (
        { ...state, ...payload, loading: false, loadingLarge: false, error: false }
      ));

      builder.addCase(largeAction, (state) => ({ ...state, loadingLarge: true }));
      builder.addCase(progressChangedAction, (state, { payload: progress }) => ({ ...state, progress }));
      builder.addCase(fallbackToIntervalAction, (state, { payload: fallbackInterval }) => (
        { ...state, fallbackInterval }
      ));

      builder.addCase(createNewVisits, (state, { payload }: CreateVisitsAction) => {
        const { visits, query = {} } = state;
        const { startDate, endDate } = query;
        const newVisits = payload.createdVisits
          .filter(({ visit, shortUrl }) => !shortUrl && isBetween(visit.date, startDate, endDate))
          .map(({ visit }) => visit);

        return { ...state, visits: [...newVisits, ...visits] };
      });
    },
  });
  const { cancelGetOrphanVisits } = actions;

  return { reducer, cancelGetOrphanVisits };
};
