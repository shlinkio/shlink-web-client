import PropTypes from 'prop-types';
import { Action, Dispatch } from 'redux';
import { Visit, VisitsInfo, VisitsLoadProgressChangedAction, VisitType } from '../types';
import { buildActionCreator, buildReducer } from '../../utils/helpers/redux';
import { ShlinkApiClientBuilder } from '../../utils/services/ShlinkApiClientBuilder';
import { GetState } from '../../container/types';
import { getVisitsWithLoader } from './common';
import { CREATE_VISIT, CreateVisitAction } from './visitCreation';

/* eslint-disable padding-line-between-statements */
export const GET_TAG_VISITS_START = 'shlink/tagVisits/GET_TAG_VISITS_START';
export const GET_TAG_VISITS_ERROR = 'shlink/tagVisits/GET_TAG_VISITS_ERROR';
export const GET_TAG_VISITS = 'shlink/tagVisits/GET_TAG_VISITS';
export const GET_TAG_VISITS_LARGE = 'shlink/tagVisits/GET_TAG_VISITS_LARGE';
export const GET_TAG_VISITS_CANCEL = 'shlink/tagVisits/GET_TAG_VISITS_CANCEL';
export const GET_TAG_VISITS_PROGRESS_CHANGED = 'shlink/tagVisits/GET_TAG_VISITS_PROGRESS_CHANGED';
/* eslint-enable padding-line-between-statements */

/** @deprecated Use TagVisits interface instead */
export const TagVisitsType = PropTypes.shape({
  visits: PropTypes.arrayOf(VisitType),
  tag: PropTypes.string,
  loading: PropTypes.bool,
  loadingLarge: PropTypes.bool,
  error: PropTypes.bool,
  progress: PropTypes.number,
});

export interface TagVisits extends VisitsInfo {
  tag: string;
}

export interface TagVisitsAction extends Action<string> {
  visits: Visit[];
  tag: string;
}

const initialState: TagVisits = {
  visits: [],
  tag: '',
  loading: false,
  loadingLarge: false,
  error: false,
  cancelLoad: false,
  progress: 0,
};

export default buildReducer<TagVisits, TagVisitsAction & VisitsLoadProgressChangedAction & CreateVisitAction>({
  [GET_TAG_VISITS_START]: () => ({ ...initialState, loading: true }),
  [GET_TAG_VISITS_ERROR]: () => ({ ...initialState, error: true }),
  [GET_TAG_VISITS]: (_, { visits, tag }) => ({ ...initialState, visits, tag }),
  [GET_TAG_VISITS_LARGE]: (state) => ({ ...state, loadingLarge: true }),
  [GET_TAG_VISITS_CANCEL]: (state) => ({ ...state, cancelLoad: true }),
  [GET_TAG_VISITS_PROGRESS_CHANGED]: (state, { progress }) => ({ ...state, progress }),
  [CREATE_VISIT]: (state, { shortUrl, visit }) => { // eslint-disable-line object-shorthand
    const { tag, visits } = state;

    if (!shortUrl.tags.includes(tag)) {
      return state;
    }

    return { ...state, visits: [ ...visits, visit ] };
  },
}, initialState);

export const getTagVisits = (buildShlinkApiClient: ShlinkApiClientBuilder) => (tag: string, query = {}) => async (
  dispatch: Dispatch,
  getState: GetState,
) => {
  const { getTagVisits } = buildShlinkApiClient(getState);
  const visitsLoader = (page: number, itemsPerPage: number) => getTagVisits(tag, { ...query, page, itemsPerPage });
  const extraFinishActionData: Partial<TagVisitsAction> = { tag };
  const actionMap = {
    start: GET_TAG_VISITS_START,
    large: GET_TAG_VISITS_LARGE,
    finish: GET_TAG_VISITS,
    error: GET_TAG_VISITS_ERROR,
    progress: GET_TAG_VISITS_PROGRESS_CHANGED,
  };

  return getVisitsWithLoader(visitsLoader, extraFinishActionData, actionMap, dispatch, getState);
};

export const cancelGetTagVisits = buildActionCreator(GET_TAG_VISITS_CANCEL);
