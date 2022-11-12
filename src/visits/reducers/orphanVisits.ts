import { createAction } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';
import { OrphanVisit, OrphanVisitType } from '../types';
import { buildReducer } from '../../utils/helpers/redux';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { GetState } from '../../container/types';
import { isOrphanVisit } from '../types/helpers';
import { ApiErrorAction } from '../../api/types/actions';
import { isBetween } from '../../utils/helpers/date';
import { getVisitsWithLoader, lastVisitLoaderForLoader } from './common';
import { createNewVisits, CreateVisitsAction } from './visitCreation';
import {
  LoadVisits,
  VisitsFallbackIntervalAction,
  VisitsInfo,
  VisitsLoaded,
  VisitsLoadedAction,
  VisitsLoadProgressChangedAction,
} from './types';

const REDUCER_PREFIX = 'shlink/orphanVisits';
export const GET_ORPHAN_VISITS_START = `${REDUCER_PREFIX}/getOrphanVisits/pending`;
export const GET_ORPHAN_VISITS_ERROR = `${REDUCER_PREFIX}/getOrphanVisits/rejected`;
export const GET_ORPHAN_VISITS = `${REDUCER_PREFIX}/getOrphanVisits/fulfilled`;
export const GET_ORPHAN_VISITS_LARGE = `${REDUCER_PREFIX}/getOrphanVisits/large`;
export const GET_ORPHAN_VISITS_CANCEL = `${REDUCER_PREFIX}/getOrphanVisits/cancel`;
export const GET_ORPHAN_VISITS_PROGRESS_CHANGED = `${REDUCER_PREFIX}/getOrphanVisits/progressChanged`;
export const GET_ORPHAN_VISITS_FALLBACK_TO_INTERVAL = `${REDUCER_PREFIX}/getOrphanVisits/fallbackToInterval`;

export interface LoadOrphanVisits extends LoadVisits {
  orphanVisitsType?: OrphanVisitType;
}

type OrphanVisitsCombinedAction = VisitsLoadedAction
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

export default buildReducer<VisitsInfo, OrphanVisitsCombinedAction>({
  [`${REDUCER_PREFIX}/getOrphanVisits/pending`]: () => ({ ...initialState, loading: true }),
  [`${REDUCER_PREFIX}/getOrphanVisits/rejected`]: (_, { errorData }) => ({ ...initialState, error: true, errorData }),
  [`${REDUCER_PREFIX}/getOrphanVisits/fulfilled`]: (state, { payload }: VisitsLoadedAction) => (
    { ...state, ...payload, loading: false, loadingLarge: false, error: false }
  ),
  [`${REDUCER_PREFIX}/getOrphanVisits/large`]: (state) => ({ ...state, loadingLarge: true }),
  [`${REDUCER_PREFIX}/getOrphanVisits/cancel`]: (state) => ({ ...state, cancelLoad: true }),
  [`${REDUCER_PREFIX}/getOrphanVisits/progressChanged`]: (state, { payload: progress }) => ({ ...state, progress }),
  [`${REDUCER_PREFIX}/getOrphanVisits/fallbackToInterval`]: (state, { payload: fallbackInterval }) => (
    { ...state, fallbackInterval }
  ),
  [createNewVisits.toString()]: (state, { payload }: CreateVisitsAction) => {
    const { visits, query = {} } = state;
    const { startDate, endDate } = query;
    const newVisits = payload.createdVisits
      .filter(({ visit, shortUrl }) => !shortUrl && isBetween(visit.date, startDate, endDate))
      .map(({ visit }) => visit);

    return { ...state, visits: [...newVisits, ...visits] };
  },
}, initialState);

const matchesType = (visit: OrphanVisit, orphanVisitsType?: OrphanVisitType) =>
  !orphanVisitsType || orphanVisitsType === visit.type;

export const getOrphanVisits = (buildShlinkApiClient: ShlinkApiClientBuilder) => (
  { orphanVisitsType, query = {}, doIntervalFallback = false }: LoadOrphanVisits,
) => async (dispatch: Dispatch, getState: GetState) => {
  const { getOrphanVisits: getVisits } = buildShlinkApiClient(getState);
  const visitsLoader = async (page: number, itemsPerPage: number) => getVisits({ ...query, page, itemsPerPage })
    .then((result) => {
      const visits = result.data.filter((visit) => isOrphanVisit(visit) && matchesType(visit, orphanVisitsType));

      return { ...result, data: visits };
    });
  const lastVisitLoader = lastVisitLoaderForLoader(doIntervalFallback, getVisits);
  const shouldCancel = () => getState().orphanVisits.cancelLoad;
  const extraFinishActionData: Partial<VisitsLoaded> = { query };
  const prefix = `${REDUCER_PREFIX}/getOrphanVisits`;

  return getVisitsWithLoader(visitsLoader, lastVisitLoader, extraFinishActionData, prefix, dispatch, shouldCancel);
};

export const cancelGetOrphanVisits = createAction<void>(`${REDUCER_PREFIX}/getOrphanVisits/cancel`);
