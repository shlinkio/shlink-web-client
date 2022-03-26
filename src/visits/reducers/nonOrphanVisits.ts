import { Action, Dispatch } from 'redux';
import {
  Visit,
  VisitsFallbackIntervalAction,
  VisitsInfo,
  VisitsLoadProgressChangedAction,
} from '../types';
import { buildActionCreator, buildReducer } from '../../utils/helpers/redux';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { GetState } from '../../container/types';
import { ShlinkVisitsParams } from '../../api/types';
import { ApiErrorAction } from '../../api/types/actions';
import { isBetween } from '../../utils/helpers/date';
import { getVisitsWithLoader, lastVisitLoaderForLoader } from './common';
import { CREATE_VISITS, CreateVisitsAction } from './visitCreation';

export const GET_NON_ORPHAN_VISITS_START = 'shlink/orphanVisits/GET_NON_ORPHAN_VISITS_START';
export const GET_NON_ORPHAN_VISITS_ERROR = 'shlink/orphanVisits/GET_NON_ORPHAN_VISITS_ERROR';
export const GET_NON_ORPHAN_VISITS = 'shlink/orphanVisits/GET_NON_ORPHAN_VISITS';
export const GET_NON_ORPHAN_VISITS_LARGE = 'shlink/orphanVisits/GET_NON_ORPHAN_VISITS_LARGE';
export const GET_NON_ORPHAN_VISITS_CANCEL = 'shlink/orphanVisits/GET_NON_ORPHAN_VISITS_CANCEL';
export const GET_NON_ORPHAN_VISITS_PROGRESS_CHANGED = 'shlink/orphanVisits/GET_NON_ORPHAN_VISITS_PROGRESS_CHANGED';
export const GET_NON_ORPHAN_VISITS_FALLBACK_TO_INTERVAL = 'shlink/orphanVisits/GET_NON_ORPHAN_VISITS_FALLBACK_TO_INTERVAL';

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
  [GET_NON_ORPHAN_VISITS_START]: () => ({ ...initialState, loading: true }),
  [GET_NON_ORPHAN_VISITS_ERROR]: (_, { errorData }) => ({ ...initialState, error: true, errorData }),
  [GET_NON_ORPHAN_VISITS]: (state, { visits, query }) => ({ ...state, visits, query, loading: false, error: false }),
  [GET_NON_ORPHAN_VISITS_LARGE]: (state) => ({ ...state, loadingLarge: true }),
  [GET_NON_ORPHAN_VISITS_CANCEL]: (state) => ({ ...state, cancelLoad: true }),
  [GET_NON_ORPHAN_VISITS_PROGRESS_CHANGED]: (state, { progress }) => ({ ...state, progress }),
  [GET_NON_ORPHAN_VISITS_FALLBACK_TO_INTERVAL]: (state, { fallbackInterval }) => ({ ...state, fallbackInterval }),
  [CREATE_VISITS]: (state, { createdVisits }) => {
    const { visits, query = {} } = state;
    const { startDate, endDate } = query;
    const newVisits = createdVisits
      .filter(({ visit }) => isBetween(visit.date, startDate, endDate))
      .map(({ visit }) => visit);

    return { ...state, visits: [...newVisits, ...visits] };
  },
}, initialState);

export const getNonOrphanVisits = (buildShlinkApiClient: ShlinkApiClientBuilder) => (
  query: ShlinkVisitsParams = {},
  doIntervalFallback = false,
) => async (dispatch: Dispatch, getState: GetState) => {
  const { getNonOrphanVisits: shlinkGetNonOrphanVisits } = buildShlinkApiClient(getState);
  const visitsLoader = async (page: number, itemsPerPage: number) =>
    shlinkGetNonOrphanVisits({ ...query, page, itemsPerPage });
  const lastVisitLoader = lastVisitLoaderForLoader(doIntervalFallback, shlinkGetNonOrphanVisits);
  const shouldCancel = () => getState().orphanVisits.cancelLoad;
  const extraFinishActionData: Partial<NonOrphanVisitsAction> = { query };
  const actionMap = {
    start: GET_NON_ORPHAN_VISITS_START,
    large: GET_NON_ORPHAN_VISITS_LARGE,
    finish: GET_NON_ORPHAN_VISITS,
    error: GET_NON_ORPHAN_VISITS_ERROR,
    progress: GET_NON_ORPHAN_VISITS_PROGRESS_CHANGED,
    fallbackToInterval: GET_NON_ORPHAN_VISITS_FALLBACK_TO_INTERVAL,
  };

  return getVisitsWithLoader(visitsLoader, lastVisitLoader, extraFinishActionData, actionMap, dispatch, shouldCancel);
};

export const cancelGetNonOrphanVisits = buildActionCreator(GET_NON_ORPHAN_VISITS_CANCEL);
