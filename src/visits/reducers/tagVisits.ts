import { createAction } from '@reduxjs/toolkit';
import { Action, Dispatch } from 'redux';
import { Visit, VisitsFallbackIntervalAction, VisitsInfo, VisitsLoadProgressChangedAction } from '../types';
import { buildReducer } from '../../utils/helpers/redux';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { GetState } from '../../container/types';
import { ShlinkVisitsParams } from '../../api/types';
import { ApiErrorAction } from '../../api/types/actions';
import { isBetween } from '../../utils/helpers/date';
import { getVisitsWithLoader, lastVisitLoaderForLoader } from './common';
import { createNewVisits, CreateVisitsAction } from './visitCreation';

const REDUCER_PREFIX = 'shlink/tagVisits';
export const GET_TAG_VISITS_START = `${REDUCER_PREFIX}/getTagVisits/pending`;
export const GET_TAG_VISITS_ERROR = `${REDUCER_PREFIX}/getTagVisits/rejected`;
export const GET_TAG_VISITS = `${REDUCER_PREFIX}/getTagVisits/fulfilled`;
export const GET_TAG_VISITS_LARGE = `${REDUCER_PREFIX}/getTagVisits/large`;
export const GET_TAG_VISITS_CANCEL = `${REDUCER_PREFIX}/getTagVisits/cancel`;
export const GET_TAG_VISITS_PROGRESS_CHANGED = `${REDUCER_PREFIX}/getTagVisits/progressChanged`;
export const GET_TAG_VISITS_FALLBACK_TO_INTERVAL = `${REDUCER_PREFIX}/getTagVisits/fallbackToInterval`;

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
  [`${REDUCER_PREFIX}/getTagVisits/pending`]: () => ({ ...initialState, loading: true }),
  [`${REDUCER_PREFIX}/getTagVisits/rejected`]: (_, { errorData }) => ({ ...initialState, error: true, errorData }),
  [`${REDUCER_PREFIX}/getTagVisits/fulfilled`]: (state, { visits, tag, query }) => (
    { ...state, visits, tag, query, loading: false, loadingLarge: false, error: false }
  ),
  [`${REDUCER_PREFIX}/getTagVisits/large`]: (state) => ({ ...state, loadingLarge: true }),
  [`${REDUCER_PREFIX}/getTagVisits/cancel`]: (state) => ({ ...state, cancelLoad: true }),
  [`${REDUCER_PREFIX}/getTagVisits/progressChanged`]: (state, { payload: progress }) => ({ ...state, progress }),
  [`${REDUCER_PREFIX}/getTagVisits/fallbackToInterval`]: (state, { payload: fallbackInterval }) => (
    { ...state, fallbackInterval }
  ),
  [createNewVisits.toString()]: (state, { payload }: CreateVisitsAction) => {
    const { tag, visits, query = {} } = state;
    const { startDate, endDate } = query;
    const newVisits = payload.createdVisits
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
  const prefix = `${REDUCER_PREFIX}/getTagVisits`;

  return getVisitsWithLoader(visitsLoader, lastVisitLoader, extraFinishActionData, prefix, dispatch, shouldCancel);
};

export const cancelGetTagVisits = createAction<void>(`${REDUCER_PREFIX}/getTagVisits/cancel`);
