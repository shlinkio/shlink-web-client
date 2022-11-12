import { createAction } from '@reduxjs/toolkit';
import { Action, Dispatch } from 'redux';
import { Visit } from '../types';
import { buildReducer } from '../../utils/helpers/redux';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { GetState } from '../../container/types';
import { ShlinkVisitsParams } from '../../api/types';
import { ApiErrorAction } from '../../api/types/actions';
import { isBetween } from '../../utils/helpers/date';
import { getVisitsWithLoader, lastVisitLoaderForLoader } from './common';
import { createNewVisits, CreateVisitsAction } from './visitCreation';
import { LoadVisits, VisitsFallbackIntervalAction, VisitsInfo, VisitsLoadProgressChangedAction } from './types';

const REDUCER_PREFIX = 'shlink/orphanVisits';
export const GET_NON_ORPHAN_VISITS_START = `${REDUCER_PREFIX}/getNonOrphanVisits/pending`;
export const GET_NON_ORPHAN_VISITS_ERROR = `${REDUCER_PREFIX}/getNonOrphanVisits/rejected`;
export const GET_NON_ORPHAN_VISITS = `${REDUCER_PREFIX}/getNonOrphanVisits/fulfilled`;
export const GET_NON_ORPHAN_VISITS_LARGE = `${REDUCER_PREFIX}/getNonOrphanVisits/large`;
export const GET_NON_ORPHAN_VISITS_CANCEL = `${REDUCER_PREFIX}/getNonOrphanVisits/cancel`;
export const GET_NON_ORPHAN_VISITS_PROGRESS_CHANGED = `${REDUCER_PREFIX}/getNonOrphanVisits/progressChanged`;
export const GET_NON_ORPHAN_VISITS_FALLBACK_TO_INTERVAL = `${REDUCER_PREFIX}/getNonOrphanVisits/fallbackToInterval`;

export interface NonOrphanVisitsAction extends Action<string> {
  visits: Visit[];
  query?: ShlinkVisitsParams;
}

type NonOrphanVisitsCombinedAction = NonOrphanVisitsAction
& VisitsLoadProgressChangedAction
& VisitsFallbackIntervalAction
& CreateVisitsAction
& ApiErrorAction;

const initialState: VisitsInfo = {
  visits: [],
  loading: false,
  loadingLarge: false,
  error: false,
  cancelLoad: false,
  progress: 0,
};

export default buildReducer<VisitsInfo, NonOrphanVisitsCombinedAction>({
  [`${REDUCER_PREFIX}/getNonOrphanVisits/pending`]: () => ({ ...initialState, loading: true }),
  [`${REDUCER_PREFIX}/getNonOrphanVisits/rejected`]: (_, { errorData }) => (
    { ...initialState, error: true, errorData }
  ),
  [`${REDUCER_PREFIX}/getNonOrphanVisits/fulfilled`]: (state, { visits, query }) => (
    { ...state, visits, query, loading: false, loadingLarge: false, error: false }
  ),
  [`${REDUCER_PREFIX}/getNonOrphanVisits/large`]: (state) => ({ ...state, loadingLarge: true }),
  [`${REDUCER_PREFIX}/getNonOrphanVisits/cancel`]: (state) => ({ ...state, cancelLoad: true }),
  [`${REDUCER_PREFIX}/getNonOrphanVisits/progressChanged`]: (state, { payload: progress }) => ({ ...state, progress }),
  [`${REDUCER_PREFIX}/getNonOrphanVisits/fallbackToInterval`]: (state, { payload: fallbackInterval }) => (
    { ...state, fallbackInterval }
  ),
  [createNewVisits.toString()]: (state, { payload }: CreateVisitsAction) => {
    const { visits, query = {} } = state;
    const { startDate, endDate } = query;
    const newVisits = payload.createdVisits
      .filter(({ visit }) => isBetween(visit.date, startDate, endDate))
      .map(({ visit }) => visit);

    return { ...state, visits: [...newVisits, ...visits] };
  },
}, initialState);

export const getNonOrphanVisits = (buildShlinkApiClient: ShlinkApiClientBuilder) => (
  { query = {}, doIntervalFallback = false }: LoadVisits,
) => async (dispatch: Dispatch, getState: GetState) => {
  const { getNonOrphanVisits: shlinkGetNonOrphanVisits } = buildShlinkApiClient(getState);
  const visitsLoader = async (page: number, itemsPerPage: number) =>
    shlinkGetNonOrphanVisits({ ...query, page, itemsPerPage });
  const lastVisitLoader = lastVisitLoaderForLoader(doIntervalFallback, shlinkGetNonOrphanVisits);
  const shouldCancel = () => getState().orphanVisits.cancelLoad;
  const extraFinishActionData: Partial<NonOrphanVisitsAction> = { query };
  const prefix = `${REDUCER_PREFIX}/getNonOrphanVisits`;

  return getVisitsWithLoader(visitsLoader, lastVisitLoader, extraFinishActionData, prefix, dispatch, shouldCancel);
};

export const cancelGetNonOrphanVisits = createAction<void>(`${REDUCER_PREFIX}/getNonOrphanVisits/cancel`);
