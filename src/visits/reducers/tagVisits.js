import { createAction, handleActions } from 'redux-actions';
import PropTypes from 'prop-types';
import { VisitType } from '../types';
import { getVisitsWithLoader } from './common';
import { CREATE_VISIT } from './visitCreation';

/* eslint-disable padding-line-between-statements */
export const GET_TAG_VISITS_START = 'shlink/tagVisits/GET_TAG_VISITS_START';
export const GET_TAG_VISITS_ERROR = 'shlink/tagVisits/GET_TAG_VISITS_ERROR';
export const GET_TAG_VISITS = 'shlink/tagVisits/GET_TAG_VISITS';
export const GET_TAG_VISITS_LARGE = 'shlink/tagVisits/GET_TAG_VISITS_LARGE';
export const GET_TAG_VISITS_CANCEL = 'shlink/tagVisits/GET_TAG_VISITS_CANCEL';
/* eslint-enable padding-line-between-statements */

export const TagVisitsType = PropTypes.shape({ // TODO Should extend from VisitInfoType
  visits: PropTypes.arrayOf(VisitType),
  tag: PropTypes.string,
  loading: PropTypes.bool,
  loadingLarge: PropTypes.bool,
  error: PropTypes.bool,
});

const initialState = {
  visits: [],
  tag: '',
  loading: false,
  loadingLarge: false,
  error: false,
  cancelLoad: false,
};

export default handleActions({
  [GET_TAG_VISITS_START]: (state) => ({
    ...state,
    loading: true,
    loadingLarge: false,
    cancelLoad: false,
  }),
  [GET_TAG_VISITS_ERROR]: (state) => ({
    ...state,
    loading: false,
    loadingLarge: false,
    error: true,
    cancelLoad: false,
  }),
  [GET_TAG_VISITS]: (state, { visits, tag }) => ({
    visits,
    tag,
    loading: false,
    loadingLarge: false,
    error: false,
    cancelLoad: false,
  }),
  [GET_TAG_VISITS_LARGE]: (state) => ({ ...state, loadingLarge: true }),
  [GET_TAG_VISITS_CANCEL]: (state) => ({ ...state, cancelLoad: true }),
  [CREATE_VISIT]: (state, { shortUrl, visit }) => { // eslint-disable-line object-shorthand
    const { tag, visits } = state;

    if (!shortUrl.tags.includes(tag)) {
      return state;
    }

    return { ...state, visits: [ ...visits, visit ] };
  },
}, initialState);

export const getTagVisits = (buildShlinkApiClient) => (tag, query = {}) => (dispatch, getState) => {
  const { getTagVisits } = buildShlinkApiClient(getState);
  const visitsLoader = (page, itemsPerPage) => getTagVisits(tag, { ...query, page, itemsPerPage });
  const extraFinishActionData = { tag };
  const actionMap = {
    start: GET_TAG_VISITS_START,
    large: GET_TAG_VISITS_LARGE,
    finish: GET_TAG_VISITS,
    error: GET_TAG_VISITS_ERROR,
  };

  return getVisitsWithLoader(visitsLoader, extraFinishActionData, actionMap, dispatch, getState);
};

export const cancelGetTagVisits = createAction(GET_TAG_VISITS_CANCEL);
