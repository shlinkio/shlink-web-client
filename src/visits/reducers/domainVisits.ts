import { createAction } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';
import { buildReducer } from '../../utils/helpers/redux';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { GetState } from '../../container/types';
import { ApiErrorAction } from '../../api/types/actions';
import { isBetween } from '../../utils/helpers/date';
import { getVisitsWithLoader, lastVisitLoaderForLoader } from './common';
import { createNewVisits, CreateVisitsAction } from './visitCreation';
import { domainMatches } from '../../short-urls/helpers';
import {
  LoadVisits,
  VisitsFallbackIntervalAction,
  VisitsInfo,
  VisitsLoaded,
  VisitsLoadedAction,
  VisitsLoadProgressChangedAction,
} from './types';

const REDUCER_PREFIX = 'shlink/domainVisits';
export const GET_DOMAIN_VISITS_START = `${REDUCER_PREFIX}/getDomainVisits/pending`;
export const GET_DOMAIN_VISITS_ERROR = `${REDUCER_PREFIX}/getDomainVisits/rejected`;
export const GET_DOMAIN_VISITS = `${REDUCER_PREFIX}/getDomainVisits/fulfilled`;
export const GET_DOMAIN_VISITS_LARGE = `${REDUCER_PREFIX}/getDomainVisits/large`;
export const GET_DOMAIN_VISITS_CANCEL = `${REDUCER_PREFIX}/getDomainVisits/cancel`;
export const GET_DOMAIN_VISITS_PROGRESS_CHANGED = `${REDUCER_PREFIX}/getDomainVisits/progressChanged`;
export const GET_DOMAIN_VISITS_FALLBACK_TO_INTERVAL = `${REDUCER_PREFIX}/getDomainVisits/fallbackToInterval`;

export const DEFAULT_DOMAIN = 'DEFAULT';

interface WithDomain {
  domain: string;
}

export interface DomainVisits extends VisitsInfo, WithDomain {}

export interface LoadDomainVisits extends LoadVisits, WithDomain {}

type DomainVisitsAction = VisitsLoadedAction<WithDomain>;

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
  [`${REDUCER_PREFIX}/getDomainVisits/pending`]: () => ({ ...initialState, loading: true }),
  [`${REDUCER_PREFIX}/getDomainVisits/rejected`]: (_, { errorData }) => ({ ...initialState, error: true, errorData }),
  [`${REDUCER_PREFIX}/getDomainVisits/fulfilled`]: (state, { payload }: DomainVisitsAction) => (
    { ...state, ...payload, loading: false, loadingLarge: false, error: false }
  ),
  [`${REDUCER_PREFIX}/getDomainVisits/large`]: (state) => ({ ...state, loadingLarge: true }),
  [`${REDUCER_PREFIX}/getDomainVisits/cancel`]: (state) => ({ ...state, cancelLoad: true }),
  [`${REDUCER_PREFIX}/getDomainVisits/progressChanged`]: (state, { payload: progress }) => ({ ...state, progress }),
  [`${REDUCER_PREFIX}/getDomainVisits/fallbackToInterval`]: (state, { payload: fallbackInterval }) => (
    { ...state, fallbackInterval }
  ),
  [createNewVisits.toString()]: (state, { payload }: CreateVisitsAction) => {
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
  { domain, query = {}, doIntervalFallback = false }: LoadDomainVisits,
) => async (dispatch: Dispatch, getState: GetState) => {
  const { getDomainVisits: getVisits } = buildShlinkApiClient(getState);
  const visitsLoader = async (page: number, itemsPerPage: number) => getVisits(
    domain,
    { ...query, page, itemsPerPage },
  );
  const lastVisitLoader = lastVisitLoaderForLoader(doIntervalFallback, async (params) => getVisits(domain, params));
  const shouldCancel = () => getState().domainVisits.cancelLoad;
  const extraFinishActionData: Partial<VisitsLoaded<WithDomain>> = { domain, query };
  const prefix = `${REDUCER_PREFIX}/getDomainVisits`;

  return getVisitsWithLoader(visitsLoader, lastVisitLoader, extraFinishActionData, prefix, dispatch, shouldCancel);
};

export const cancelGetDomainVisits = createAction<void>(`${REDUCER_PREFIX}/getDomainVisits/cancel`);
