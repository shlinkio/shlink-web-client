import { Action, Dispatch } from 'redux';
import { Visit, VisitsFallbackIntervalAction, VisitsInfo, VisitsLoadProgressChangedAction } from '../types';
import { buildActionCreator, buildReducer } from '../../utils/helpers/redux';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { GetState } from '../../container/types';
import { ShlinkVisitsParams } from '../../api/types';
import { ApiErrorAction } from '../../api/types/actions';
import { isBetween } from '../../utils/helpers/date';
import { getVisitsWithLoader, lastVisitLoaderForLoader } from './common';
import { CREATE_VISITS, CreateVisitsAction } from './visitCreation';

export const GET_TAG_VISITS_START = 'shlink/tagVisits/GET_TAG_VISITS_START';
export const GET_TAG_VISITS_ERROR = 'shlink/tagVisits/GET_TAG_VISITS_ERROR';
export const GET_TAG_VISITS = 'shlink/tagVisits/GET_TAG_VISITS';
export const GET_TAG_VISITS_LARGE = 'shlink/tagVisits/GET_TAG_VISITS_LARGE';
export const GET_TAG_VISITS_CANCEL = 'shlink/tagVisits/GET_TAG_VISITS_CANCEL';
export const GET_TAG_VISITS_PROGRESS_CHANGED = 'shlink/tagVisits/GET_TAG_VISITS_PROGRESS_CHANGED';
export const GET_TAG_VISITS_FALLBACK_TO_INTERVAL = 'shlink/tagVisits/GET_TAG_VISITS_FALLBACK_TO_INTERVAL';

export interface TagVisits extends VisitsInfo {
  tag: string;
}

export interface TagVisitsAction extends Action<string> {
  visits: Visit[];
  tag: string;
  query?: ShlinkVisitsParams;
}

type TagsVisitsCombinedAction = TagVisitsAction
& VisitsLoadProgressChangedAction
& VisitsFallbackIntervalAction
& CreateVisitsAction
& ApiErrorAction;

const initialState: TagVisits = {
  visits: [],
  tag: '',
  loading: false,
  loadingLarge: false,
  error: false,
  cancelLoad: false,
  progress: 0,
};

export default buildReducer<TagVisits, TagsVisitsCombinedAction>({
  [GET_TAG_VISITS_START]: () => ({ ...initialState, loading: true }),
  [GET_TAG_VISITS_ERROR]: (_, { errorData }) => ({ ...initialState, error: true, errorData }),
  [GET_TAG_VISITS]: (state, { visits, tag, query }) => ({ ...state, visits, tag, query, loading: false, error: false }),
  [GET_TAG_VISITS_LARGE]: (state) => ({ ...state, loadingLarge: true }),
  [GET_TAG_VISITS_CANCEL]: (state) => ({ ...state, cancelLoad: true }),
  [GET_TAG_VISITS_PROGRESS_CHANGED]: (state, { progress }) => ({ ...state, progress }),
  [GET_TAG_VISITS_FALLBACK_TO_INTERVAL]: (state, { fallbackInterval }) => ({ ...state, fallbackInterval }),
  [CREATE_VISITS]: (state, { createdVisits }) => {
    const { tag, visits, query = {} } = state;
    const { startDate, endDate } = query;
    const newVisits = createdVisits
      .filter(({ shortUrl, visit }) => shortUrl?.tags.includes(tag) && isBetween(visit.date, startDate, endDate))
      .map(({ visit }) => visit);

    return { ...state, visits: [...newVisits, ...visits] };
  },
}, initialState);

export const getTagVisits = (buildShlinkApiClient: ShlinkApiClientBuilder) => (
  tag: string,
  query: ShlinkVisitsParams = {},
  doIntervalFallback = false,
) => async (dispatch: Dispatch, getState: GetState) => {
  const { getTagVisits: getVisits } = buildShlinkApiClient(getState);
  const visitsLoader = async (page: number, itemsPerPage: number) => getVisits(
    tag,
    { ...query, page, itemsPerPage },
  );
  const lastVisitLoader = lastVisitLoaderForLoader(doIntervalFallback, async (params) => getVisits(tag, params));
  const shouldCancel = () => getState().tagVisits.cancelLoad;
  const extraFinishActionData: Partial<TagVisitsAction> = { tag, query };
  const actionMap = {
    start: GET_TAG_VISITS_START,
    large: GET_TAG_VISITS_LARGE,
    finish: GET_TAG_VISITS,
    error: GET_TAG_VISITS_ERROR,
    progress: GET_TAG_VISITS_PROGRESS_CHANGED,
    fallbackToInterval: GET_TAG_VISITS_FALLBACK_TO_INTERVAL,
  };

  return getVisitsWithLoader(visitsLoader, lastVisitLoader, extraFinishActionData, actionMap, dispatch, shouldCancel);
};

export const cancelGetTagVisits = buildActionCreator(GET_TAG_VISITS_CANCEL);
