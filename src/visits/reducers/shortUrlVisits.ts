import { createAction } from '@reduxjs/toolkit';
import { Action, Dispatch } from 'redux';
import { shortUrlMatches } from '../../short-urls/helpers';
import { Visit, VisitsFallbackIntervalAction, VisitsInfo, VisitsLoadProgressChangedAction } from '../types';
import { ShortUrlIdentifier } from '../../short-urls/data';
import { buildReducer } from '../../utils/helpers/redux';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { GetState } from '../../container/types';
import { ShlinkVisitsParams } from '../../api/types';
import { ApiErrorAction } from '../../api/types/actions';
import { isBetween } from '../../utils/helpers/date';
import { getVisitsWithLoader, lastVisitLoaderForLoader } from './common';
import { createNewVisits, CreateVisitsAction } from './visitCreation';

const REDUCER_PREFIX = 'shlink/shortUrlVisits';
export const GET_SHORT_URL_VISITS_START = `${REDUCER_PREFIX}/getShortUrlVisits/pending`;
export const GET_SHORT_URL_VISITS_ERROR = `${REDUCER_PREFIX}/getShortUrlVisits/rejected`;
export const GET_SHORT_URL_VISITS = `${REDUCER_PREFIX}/getShortUrlVisits/fulfilled`;
export const GET_SHORT_URL_VISITS_LARGE = `${REDUCER_PREFIX}/getShortUrlVisits/large`;
export const GET_SHORT_URL_VISITS_CANCEL = `${REDUCER_PREFIX}/getShortUrlVisits/cancel`;
export const GET_SHORT_URL_VISITS_PROGRESS_CHANGED = `${REDUCER_PREFIX}/getShortUrlVisits/progressChanged`;
export const GET_SHORT_URL_VISITS_FALLBACK_TO_INTERVAL = `${REDUCER_PREFIX}/getShortUrlVisits/fallbackToInterval`;

export interface ShortUrlVisits extends VisitsInfo, ShortUrlIdentifier {}

interface ShortUrlVisitsAction extends Action<string>, ShortUrlIdentifier {
  visits: Visit[];
  query?: ShlinkVisitsParams;
}

type ShortUrlVisitsCombinedAction = ShortUrlVisitsAction
& VisitsLoadProgressChangedAction
& VisitsFallbackIntervalAction
& CreateVisitsAction
& ApiErrorAction;

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

export default buildReducer<ShortUrlVisits, ShortUrlVisitsCombinedAction>({
  [`${REDUCER_PREFIX}/getShortUrlVisits/pending`]: () => ({ ...initialState, loading: true }),
  [`${REDUCER_PREFIX}/getShortUrlVisits/rejected`]: (_, { errorData }) => ({ ...initialState, error: true, errorData }),
  [`${REDUCER_PREFIX}/getShortUrlVisits/fulfilled`]: (state, { visits, query, shortCode, domain }) => ({
    ...state,
    visits,
    shortCode,
    domain,
    query,
    loading: false,
    loadingLarge: false,
    error: false,
  }),
  [`${REDUCER_PREFIX}/getShortUrlVisits/large`]: (state) => ({ ...state, loadingLarge: true }),
  [`${REDUCER_PREFIX}/getShortUrlVisits/cancel`]: (state) => ({ ...state, cancelLoad: true }),
  [`${REDUCER_PREFIX}/getShortUrlVisits/progressChanged`]: (state, { payload: progress }) => ({ ...state, progress }),
  [`${REDUCER_PREFIX}/getShortUrlVisits/fallbackToInterval`]: (state, { payload: fallbackInterval }) => (
    { ...state, fallbackInterval }
  ),
  [createNewVisits.toString()]: (state, { payload }: CreateVisitsAction) => {
    const { shortCode, domain, visits, query = {} } = state;
    const { startDate, endDate } = query;
    const newVisits = payload.createdVisits
      .filter(
        ({ shortUrl, visit }) =>
          shortUrl && shortUrlMatches(shortUrl, shortCode, domain) && isBetween(visit.date, startDate, endDate),
      )
      .map(({ visit }) => visit);

    return newVisits.length === 0 ? state : { ...state, visits: [...newVisits, ...visits] };
  },
}, initialState);

export const getShortUrlVisits = (buildShlinkApiClient: ShlinkApiClientBuilder) => (
  shortCode: string,
  query: ShlinkVisitsParams = {},
  doIntervalFallback = false,
) => async (dispatch: Dispatch, getState: GetState) => {
  const { getShortUrlVisits: shlinkGetShortUrlVisits } = buildShlinkApiClient(getState);
  const visitsLoader = async (page: number, itemsPerPage: number) => shlinkGetShortUrlVisits(
    shortCode,
    { ...query, page, itemsPerPage },
  );
  const lastVisitLoader = lastVisitLoaderForLoader(
    doIntervalFallback,
    async (params) => shlinkGetShortUrlVisits(shortCode, { ...params, domain: query.domain }),
  );
  const shouldCancel = () => getState().shortUrlVisits.cancelLoad;
  const extraFinishActionData: Partial<ShortUrlVisitsAction> = { shortCode, query, domain: query.domain };
  const prefix = `${REDUCER_PREFIX}/getShortUrlVisits`;

  return getVisitsWithLoader(visitsLoader, lastVisitLoader, extraFinishActionData, prefix, dispatch, shouldCancel);
};

export const cancelGetShortUrlVisits = createAction<void>(`${REDUCER_PREFIX}/getShortUrlVisits/cancel`);
