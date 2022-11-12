import { createSlice } from '@reduxjs/toolkit';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { isBetween } from '../../utils/helpers/date';
import { createVisitsAsyncThunk, lastVisitLoaderForLoader } from './common';
import { createNewVisits } from './visitCreation';
import { VisitsInfo } from './types';
import { parseApiError } from '../../api/utils';

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
  actionsPrefix: `${REDUCER_PREFIX}/getNonOrphanVisits`,
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
  { asyncThunk, largeAction, progressChangedAction, fallbackToIntervalAction }: ReturnType<typeof getNonOrphanVisits>,
) => {
  const { reducer, actions } = createSlice({
    name: REDUCER_PREFIX,
    initialState,
    reducers: {
      cancelGetNonOrphanVisits: (state) => ({ ...state, cancelLoad: true }),
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

      builder.addCase(createNewVisits, (state, { payload }) => {
        const { visits, query = {} } = state;
        const { startDate, endDate } = query;
        const newVisits = payload.createdVisits
          .filter(({ visit }) => isBetween(visit.date, startDate, endDate))
          .map(({ visit }) => visit);

        return { ...state, visits: [...newVisits, ...visits] };
      });
    },
  });
  const { cancelGetNonOrphanVisits } = actions;

  return { reducer, cancelGetNonOrphanVisits };
};
