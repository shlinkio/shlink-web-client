import { Action, Dispatch } from 'redux';
import {
  OrphanVisit,
  OrphanVisitType,
  Visit,
  VisitsFallbackIntervalAction,
  VisitsInfo,
  VisitsLoadProgressChangedAction,
} from '../types';
import { buildActionCreator, buildReducer } from '../../utils/helpers/redux';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { GetState } from '../../container/types';
import { ShlinkVisitsParams } from '../../api/types';
import { isOrphanVisit } from '../types/helpers';
import { ApiErrorAction } from '../../api/types/actions';
import { isBetween } from '../../utils/helpers/date';
import { getVisitsWithLoader, lastVisitLoaderForLoader } from './common';
import { CREATE_VISITS, CreateVisitsAction } from './visitCreation';

export const GET_ORPHAN_VISITS_START = 'shlink/orphanVisits/GET_ORPHAN_VISITS_START';
export const GET_ORPHAN_VISITS_ERROR = 'shlink/orphanVisits/GET_ORPHAN_VISITS_ERROR';
export const GET_ORPHAN_VISITS = 'shlink/orphanVisits/GET_ORPHAN_VISITS';
export const GET_ORPHAN_VISITS_LARGE = 'shlink/orphanVisits/GET_ORPHAN_VISITS_LARGE';
export const GET_ORPHAN_VISITS_CANCEL = 'shlink/orphanVisits/GET_ORPHAN_VISITS_CANCEL';
export const GET_ORPHAN_VISITS_PROGRESS_CHANGED = 'shlink/orphanVisits/GET_ORPHAN_VISITS_PROGRESS_CHANGED';
export const GET_ORPHAN_VISITS_FALLBACK_TO_INTERVAL = 'shlink/orphanVisits/GET_ORPHAN_VISITS_FALLBACK_TO_INTERVAL';

export interface OrphanVisitsAction extends Action<string> {
  visits: Visit[];
  query?: ShlinkVisitsParams;
}

type OrphanVisitsCombinedAction = OrphanVisitsAction
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
  [GET_ORPHAN_VISITS_START]: () => ({ ...initialState, loading: true }),
  [GET_ORPHAN_VISITS_ERROR]: (_, { errorData }) => ({ ...initialState, error: true, errorData }),
  [GET_ORPHAN_VISITS]: (state, { visits, query }) => ({ ...state, visits, query, loading: false, error: false }),
  [GET_ORPHAN_VISITS_LARGE]: (state) => ({ ...state, loadingLarge: true }),
  [GET_ORPHAN_VISITS_CANCEL]: (state) => ({ ...state, cancelLoad: true }),
  [GET_ORPHAN_VISITS_PROGRESS_CHANGED]: (state, { progress }) => ({ ...state, progress }),
  [GET_ORPHAN_VISITS_FALLBACK_TO_INTERVAL]: (state, { fallbackInterval }) => ({ ...state, fallbackInterval }),
  [CREATE_VISITS]: (state, { createdVisits }) => {
    const { visits, query = {} } = state;
    const { startDate, endDate } = query;
    const newVisits = createdVisits
      .filter(({ visit, shortUrl }) => !shortUrl && isBetween(visit.date, startDate, endDate))
      .map(({ visit }) => visit);

    return { ...state, visits: [...newVisits, ...visits] };
  },
}, initialState);

const matchesType = (visit: OrphanVisit, orphanVisitsType?: OrphanVisitType) =>
  !orphanVisitsType || orphanVisitsType === visit.type;

export const getOrphanVisits = (buildShlinkApiClient: ShlinkApiClientBuilder) => (
  query: ShlinkVisitsParams = {},
  orphanVisitsType?: OrphanVisitType,
  doIntervalFallback = false,
) => async (dispatch: Dispatch, getState: GetState) => {
  const { getOrphanVisits: getVisits } = buildShlinkApiClient(getState);
  const visitsLoader = async (page: number, itemsPerPage: number) => getVisits({ ...query, page, itemsPerPage })
    .then((result) => {
      const visits = result.data.filter((visit) => isOrphanVisit(visit) && matchesType(visit, orphanVisitsType));

      return { ...result, data: visits };
    });
  const lastVisitLoader = lastVisitLoaderForLoader(doIntervalFallback, getVisits);
  const shouldCancel = () => getState().orphanVisits.cancelLoad;
  const extraFinishActionData: Partial<OrphanVisitsAction> = { query };
  const actionMap = {
    start: GET_ORPHAN_VISITS_START,
    large: GET_ORPHAN_VISITS_LARGE,
    finish: GET_ORPHAN_VISITS,
    error: GET_ORPHAN_VISITS_ERROR,
    progress: GET_ORPHAN_VISITS_PROGRESS_CHANGED,
    fallbackToInterval: GET_ORPHAN_VISITS_FALLBACK_TO_INTERVAL,
  };

  return getVisitsWithLoader(visitsLoader, lastVisitLoader, extraFinishActionData, actionMap, dispatch, shouldCancel);
};

export const cancelGetOrphanVisits = buildActionCreator(GET_ORPHAN_VISITS_CANCEL);
