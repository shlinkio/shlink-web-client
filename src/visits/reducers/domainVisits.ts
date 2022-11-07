import { Action, Dispatch } from 'redux';
import { Visit, VisitsFallbackIntervalAction, VisitsInfo, VisitsLoadProgressChangedAction } from '../types';
import { buildActionCreator, buildReducer } from '../../utils/helpers/redux';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { GetState } from '../../container/types';
import { ShlinkVisitsParams } from '../../api/types';
import { ApiErrorAction } from '../../api/types/actions';
import { isBetween } from '../../utils/helpers/date';
import { getVisitsWithLoader, lastVisitLoaderForLoader } from './common';
import { createNewVisits, CreateVisitsAction } from './visitCreation';
import { domainMatches } from '../../short-urls/helpers';

export const GET_DOMAIN_VISITS_START = 'shlink/domainVisits/GET_DOMAIN_VISITS_START';
export const GET_DOMAIN_VISITS_ERROR = 'shlink/domainVisits/GET_DOMAIN_VISITS_ERROR';
export const GET_DOMAIN_VISITS = 'shlink/domainVisits/GET_DOMAIN_VISITS';
export const GET_DOMAIN_VISITS_LARGE = 'shlink/domainVisits/GET_DOMAIN_VISITS_LARGE';
export const GET_DOMAIN_VISITS_CANCEL = 'shlink/domainVisits/GET_DOMAIN_VISITS_CANCEL';
export const GET_DOMAIN_VISITS_PROGRESS_CHANGED = 'shlink/domainVisits/GET_DOMAIN_VISITS_PROGRESS_CHANGED';
export const GET_DOMAIN_VISITS_FALLBACK_TO_INTERVAL = 'shlink/domainVisits/GET_DOMAIN_VISITS_FALLBACK_TO_INTERVAL';

export const DEFAULT_DOMAIN = 'DEFAULT';

export interface DomainVisits extends VisitsInfo {
  domain: string;
}

export interface DomainVisitsAction extends Action<string> {
  visits: Visit[];
  domain: string;
  query?: ShlinkVisitsParams;
}

type DomainVisitsCombinedAction = DomainVisitsAction
& VisitsLoadProgressChangedAction
& VisitsFallbackIntervalAction
& CreateVisitsAction
& ApiErrorAction;

const initialState: DomainVisits = {
  visits: [],
  domain: '',
  loading: false,
  loadingLarge: false,
  error: false,
  cancelLoad: false,
  progress: 0,
};

export default buildReducer<DomainVisits, DomainVisitsCombinedAction>({
  [GET_DOMAIN_VISITS_START]: () => ({ ...initialState, loading: true }),
  [GET_DOMAIN_VISITS_ERROR]: (_, { errorData }) => ({ ...initialState, error: true, errorData }),
  [GET_DOMAIN_VISITS]: (state, { visits, domain, query }) => (
    { ...state, visits, domain, query, loading: false, loadingLarge: false, error: false }
  ),
  [GET_DOMAIN_VISITS_LARGE]: (state) => ({ ...state, loadingLarge: true }),
  [GET_DOMAIN_VISITS_CANCEL]: (state) => ({ ...state, cancelLoad: true }),
  [GET_DOMAIN_VISITS_PROGRESS_CHANGED]: (state, { progress }) => ({ ...state, progress }),
  [GET_DOMAIN_VISITS_FALLBACK_TO_INTERVAL]: (state, { fallbackInterval }) => ({ ...state, fallbackInterval }),
  [createNewVisits.toString()]: (state, { payload }) => {
    const { domain, visits, query = {} } = state;
    const { startDate, endDate } = query;
    const newVisits = payload.createdVisits
      .filter(({ shortUrl, visit }) =>
        shortUrl && domainMatches(shortUrl, domain) && isBetween(visit.date, startDate, endDate))
      .map(({ visit }) => visit);

    return { ...state, visits: [...newVisits, ...visits] };
  },
}, initialState);

export const getDomainVisits = (buildShlinkApiClient: ShlinkApiClientBuilder) => (
  domain: string,
  query: ShlinkVisitsParams = {},
  doIntervalFallback = false,
) => async (dispatch: Dispatch, getState: GetState) => {
  const { getDomainVisits: getVisits } = buildShlinkApiClient(getState);
  const visitsLoader = async (page: number, itemsPerPage: number) => getVisits(
    domain,
    { ...query, page, itemsPerPage },
  );
  const lastVisitLoader = lastVisitLoaderForLoader(doIntervalFallback, async (params) => getVisits(domain, params));
  const shouldCancel = () => getState().domainVisits.cancelLoad;
  const extraFinishActionData: Partial<DomainVisitsAction> = { domain, query };
  const actionMap = {
    start: GET_DOMAIN_VISITS_START,
    large: GET_DOMAIN_VISITS_LARGE,
    finish: GET_DOMAIN_VISITS,
    error: GET_DOMAIN_VISITS_ERROR,
    progress: GET_DOMAIN_VISITS_PROGRESS_CHANGED,
    fallbackToInterval: GET_DOMAIN_VISITS_FALLBACK_TO_INTERVAL,
  };

  return getVisitsWithLoader(visitsLoader, lastVisitLoader, extraFinishActionData, actionMap, dispatch, shouldCancel);
};

export const cancelGetDomainVisits = buildActionCreator(GET_DOMAIN_VISITS_CANCEL);
