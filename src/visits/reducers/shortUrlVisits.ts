import PropTypes from 'prop-types';
import { Action, Dispatch } from 'redux';
import { shortUrlMatches } from '../../short-urls/helpers';
import { Visit, VisitsInfo, VisitsLoadProgressChangedAction, VisitType } from '../types';
import { ShortUrlIdentifier } from '../../short-urls/data';
import { buildActionCreator, buildReducer } from '../../utils/helpers/redux';
import { ShlinkApiClientBuilder } from '../../utils/services/ShlinkApiClientBuilder';
import { GetState } from '../../container/types';
import { OptionalString } from '../../utils/utils';
import { getVisitsWithLoader } from './common';
import { CREATE_VISIT, CreateVisitAction } from './visitCreation';

/* eslint-disable padding-line-between-statements */
export const GET_SHORT_URL_VISITS_START = 'shlink/shortUrlVisits/GET_SHORT_URL_VISITS_START';
export const GET_SHORT_URL_VISITS_ERROR = 'shlink/shortUrlVisits/GET_SHORT_URL_VISITS_ERROR';
export const GET_SHORT_URL_VISITS = 'shlink/shortUrlVisits/GET_SHORT_URL_VISITS';
export const GET_SHORT_URL_VISITS_LARGE = 'shlink/shortUrlVisits/GET_SHORT_URL_VISITS_LARGE';
export const GET_SHORT_URL_VISITS_CANCEL = 'shlink/shortUrlVisits/GET_SHORT_URL_VISITS_CANCEL';
export const GET_SHORT_URL_VISITS_PROGRESS_CHANGED = 'shlink/shortUrlVisits/GET_SHORT_URL_VISITS_PROGRESS_CHANGED';
/* eslint-enable padding-line-between-statements */

/** @deprecated Use ShortUrlVisits interface instead */
export const shortUrlVisitsType = PropTypes.shape({
  visits: PropTypes.arrayOf(VisitType),
  shortCode: PropTypes.string,
  domain: PropTypes.string,
  loading: PropTypes.bool,
  loadingLarge: PropTypes.bool,
  error: PropTypes.bool,
  progress: PropTypes.number,
});

export interface ShortUrlVisits extends VisitsInfo, ShortUrlIdentifier {}

interface ShortUrlVisitsAction extends Action<string>, ShortUrlIdentifier {
  visits: Visit[];
}

type ShortUrlVisitsCombinedAction = ShortUrlVisitsAction & VisitsLoadProgressChangedAction & CreateVisitAction;

const initialState: ShortUrlVisits = {
  visits: [],
  shortCode: '',
  domain: undefined,
  loading: false,
  loadingLarge: false,
  error: false,
  cancelLoad: false,
  progress: 0,
};

export default buildReducer<ShortUrlVisits, ShortUrlVisitsCombinedAction>({
  [GET_SHORT_URL_VISITS_START]: () => ({ ...initialState, loading: true }),
  [GET_SHORT_URL_VISITS_ERROR]: () => ({ ...initialState, error: true }),
  [GET_SHORT_URL_VISITS]: (_, { visits, shortCode, domain }) => ({
    ...initialState,
    visits,
    shortCode,
    domain,
  }),
  [GET_SHORT_URL_VISITS_LARGE]: (state) => ({ ...state, loadingLarge: true }),
  [GET_SHORT_URL_VISITS_CANCEL]: (state) => ({ ...state, cancelLoad: true }),
  [GET_SHORT_URL_VISITS_PROGRESS_CHANGED]: (state, { progress }) => ({ ...state, progress }),
  [CREATE_VISIT]: (state, { shortUrl, visit }) => { // eslint-disable-line object-shorthand
    const { shortCode, domain, visits } = state;

    if (!shortUrlMatches(shortUrl, shortCode, domain)) {
      return state;
    }

    return { ...state, visits: [ ...visits, visit ] };
  },
}, initialState);

export const getShortUrlVisits = (buildShlinkApiClient: ShlinkApiClientBuilder) => (
  shortCode: string,
  query: { domain?: OptionalString } = {},
) => async (dispatch: Dispatch, getState: GetState) => {
  const { getShortUrlVisits } = buildShlinkApiClient(getState);
  const visitsLoader = (page: number, itemsPerPage: number) => getShortUrlVisits(
    shortCode,
    { ...query, page, itemsPerPage },
  );
  const extraFinishActionData: Partial<ShortUrlVisitsAction> = { shortCode, domain: query.domain };
  const actionMap = {
    start: GET_SHORT_URL_VISITS_START,
    large: GET_SHORT_URL_VISITS_LARGE,
    finish: GET_SHORT_URL_VISITS,
    error: GET_SHORT_URL_VISITS_ERROR,
    progress: GET_SHORT_URL_VISITS_PROGRESS_CHANGED,
  };

  return getVisitsWithLoader(visitsLoader, extraFinishActionData, actionMap, dispatch, getState);
};

export const cancelGetShortUrlVisits = buildActionCreator(GET_SHORT_URL_VISITS_CANCEL);
