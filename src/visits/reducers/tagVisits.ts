import { Action, Dispatch } from 'redux';
import { Visit, VisitsInfo, VisitsLoadFailedAction, VisitsLoadProgressChangedAction } from '../types';
import { buildActionCreator, buildReducer } from '../../utils/helpers/redux';
import { ShlinkApiClientBuilder } from '../../utils/services/ShlinkApiClientBuilder';
import { GetState } from '../../container/types';
import { getVisitsWithLoader } from './common';
import { CREATE_VISITS, CreateVisitsAction } from './visitCreation';

/* eslint-disable padding-line-between-statements */
export const GET_TAG_VISITS_START = 'shlink/tagVisits/GET_TAG_VISITS_START';
export const GET_TAG_VISITS_ERROR = 'shlink/tagVisits/GET_TAG_VISITS_ERROR';
export const GET_TAG_VISITS = 'shlink/tagVisits/GET_TAG_VISITS';
export const GET_TAG_VISITS_LARGE = 'shlink/tagVisits/GET_TAG_VISITS_LARGE';
export const GET_TAG_VISITS_CANCEL = 'shlink/tagVisits/GET_TAG_VISITS_CANCEL';
export const GET_TAG_VISITS_PROGRESS_CHANGED = 'shlink/tagVisits/GET_TAG_VISITS_PROGRESS_CHANGED';
/* eslint-enable padding-line-between-statements */

export interface TagVisits extends VisitsInfo {
  tag: string;
}

export interface TagVisitsAction extends Action<string> {
  visits: Visit[];
  tag: string;
}

type TagsVisitsCombinedAction = TagVisitsAction
& VisitsLoadProgressChangedAction
& CreateVisitsAction
& VisitsLoadFailedAction;

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
  [GET_TAG_VISITS]: (_, { visits, tag }) => ({ ...initialState, visits, tag }),
  [GET_TAG_VISITS_LARGE]: (state) => ({ ...state, loadingLarge: true }),
  [GET_TAG_VISITS_CANCEL]: (state) => ({ ...state, cancelLoad: true }),
  [GET_TAG_VISITS_PROGRESS_CHANGED]: (state, { progress }) => ({ ...state, progress }),
  [CREATE_VISITS]: (state, { createdVisits }) => { // eslint-disable-line object-shorthand
    const { tag, visits } = state;
    const newVisits = createdVisits
      .filter(({ shortUrl }) => shortUrl.tags.includes(tag))
      .map(({ visit }) => visit);

    return { ...state, visits: [ ...visits, ...newVisits ] };
  },
}, initialState);

export const getTagVisits = (buildShlinkApiClient: ShlinkApiClientBuilder) => (tag: string, query = {}) => async (
  dispatch: Dispatch,
  getState: GetState,
) => {
  const { getTagVisits } = buildShlinkApiClient(getState);
  const visitsLoader = async (page: number, itemsPerPage: number) => getTagVisits(
    tag,
    { ...query, page, itemsPerPage },
  );
  const shouldCancel = () => getState().tagVisits.cancelLoad;
  const extraFinishActionData: Partial<TagVisitsAction> = { tag };
  const actionMap = {
    start: GET_TAG_VISITS_START,
    large: GET_TAG_VISITS_LARGE,
    finish: GET_TAG_VISITS,
    error: GET_TAG_VISITS_ERROR,
    progress: GET_TAG_VISITS_PROGRESS_CHANGED,
  };

  return getVisitsWithLoader(visitsLoader, extraFinishActionData, actionMap, dispatch, shouldCancel);
};

export const cancelGetTagVisits = buildActionCreator(GET_TAG_VISITS_CANCEL);
