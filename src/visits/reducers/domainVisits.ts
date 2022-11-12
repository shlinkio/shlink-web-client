import { createSlice } from '@reduxjs/toolkit';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { isBetween } from '../../utils/helpers/date';
import { createVisitsAsyncThunk, lastVisitLoaderForLoader } from './common';
import { createNewVisits } from './visitCreation';
import { domainMatches } from '../../short-urls/helpers';
import { LoadVisits, VisitsInfo } from './types';
import { parseApiError } from '../../api/utils';

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
  actionsPrefix: `${REDUCER_PREFIX}/getDomainVisits`,
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
  { asyncThunk, largeAction, progressChangedAction, fallbackToIntervalAction }: ReturnType<typeof getDomainVisits>,
) => {
  const { reducer, actions } = createSlice({
    name: REDUCER_PREFIX,
    initialState,
    reducers: {
      cancelGetDomainVisits: (state) => ({ ...state, cancelLoad: true }),
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
      builder.addCase(
        fallbackToIntervalAction,
        (state, { payload: fallbackInterval }) => ({ ...state, fallbackInterval }),
      );

      builder.addCase(createNewVisits, (state, { payload }) => {
        const { domain, visits, query = {} } = state;
        const { startDate, endDate } = query;
        const newVisits = payload.createdVisits
          .filter(({ shortUrl, visit }) =>
            shortUrl && domainMatches(shortUrl, domain) && isBetween(visit.date, startDate, endDate))
          .map(({ visit }) => visit);

        return { ...state, visits: [...newVisits, ...visits] };
      });
    },
  });

  const { cancelGetDomainVisits } = actions;

  return { reducer, cancelGetDomainVisits };
};
