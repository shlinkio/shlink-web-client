import { createSlice } from '@reduxjs/toolkit';
import { shortUrlMatches } from '../../short-urls/helpers';
import { ShortUrlIdentifier } from '../../short-urls/data';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { isBetween } from '../../utils/helpers/date';
import { createVisitsAsyncThunk, lastVisitLoaderForLoader } from './common';
import { createNewVisits, CreateVisitsAction } from './visitCreation';
import { LoadVisits, VisitsInfo } from './types';
import { parseApiError } from '../../api/utils';

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

export const getShortUrlVisits = (buildShlinkApiClient: ShlinkApiClientBuilder) => createVisitsAsyncThunk({
  actionsPrefix: `${REDUCER_PREFIX}/getShortUrlVisits`,
  createLoaders: ({ shortCode, query = {}, doIntervalFallback = false }: LoadShortUrlVisits, getState) => {
    const { getShortUrlVisits: shlinkGetShortUrlVisits } = buildShlinkApiClient(getState);
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
  { asyncThunk, largeAction, progressChangedAction, fallbackToIntervalAction }: ReturnType<typeof getShortUrlVisits>,
) => {
  const { reducer, actions } = createSlice({
    name: REDUCER_PREFIX,
    initialState,
    reducers: {
      cancelGetShortUrlVisits: (state) => ({ ...state, cancelLoad: true }),
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
        const { shortCode, domain, visits, query = {} } = state;
        const { startDate, endDate } = query;
        const newVisits = payload.createdVisits
          .filter(
            ({ shortUrl, visit }) =>
              shortUrl && shortUrlMatches(shortUrl, shortCode, domain) && isBetween(visit.date, startDate, endDate),
          )
          .map(({ visit }) => visit);

        return newVisits.length === 0 ? state : { ...state, visits: [...newVisits, ...visits] };
      });
    },
  });
  const { cancelGetShortUrlVisits } = actions;

  return { reducer, cancelGetShortUrlVisits };
};
