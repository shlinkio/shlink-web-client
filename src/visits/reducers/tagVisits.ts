import { createSlice } from '@reduxjs/toolkit';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { isBetween } from '../../utils/helpers/date';
import { createVisitsAsyncThunk, lastVisitLoaderForLoader } from './common';
import { createNewVisits } from './visitCreation';
import { LoadVisits, VisitsInfo } from './types';
import { parseApiError } from '../../api/utils';

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
  actionsPrefix: `${REDUCER_PREFIX}/getTagVisits`,
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

export const tagVisitsReducerCreator = (
  { asyncThunk, largeAction, progressChangedAction, fallbackToIntervalAction }: ReturnType<typeof getTagVisits>,
) => {
  const { reducer, actions } = createSlice({
    name: REDUCER_PREFIX,
    initialState,
    reducers: {
      cancelGetTagVisits: (state) => ({ ...state, cancelLoad: true }),
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
        const { tag, visits, query = {} } = state;
        const { startDate, endDate } = query;
        const newVisits = payload.createdVisits
          .filter(({ shortUrl, visit }) => shortUrl?.tags.includes(tag) && isBetween(visit.date, startDate, endDate))
          .map(({ visit }) => visit);

        return { ...state, visits: [...newVisits, ...visits] };
      });
    },
  });
  const { cancelGetTagVisits } = actions;

  return { reducer, cancelGetTagVisits };
};
