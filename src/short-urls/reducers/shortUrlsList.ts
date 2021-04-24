import { assoc, assocPath, init, last, pipe, reject } from 'ramda';
import { Action, Dispatch } from 'redux';
import { shortUrlMatches } from '../helpers';
import { CREATE_VISITS, CreateVisitsAction } from '../../visits/reducers/visitCreation';
import { buildReducer } from '../../utils/helpers/redux';
import { GetState } from '../../container/types';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { ShlinkShortUrlsResponse } from '../../api/types';
import { DeleteShortUrlAction, SHORT_URL_DELETED } from './shortUrlDeletion';
import { ShortUrlsListParams } from './shortUrlsListParams';
import { CREATE_SHORT_URL, CreateShortUrlAction } from './shortUrlCreation';
import { SHORT_URL_EDITED, ShortUrlEditedAction } from './shortUrlEdition';

/* eslint-disable padding-line-between-statements */
export const LIST_SHORT_URLS_START = 'shlink/shortUrlsList/LIST_SHORT_URLS_START';
export const LIST_SHORT_URLS_ERROR = 'shlink/shortUrlsList/LIST_SHORT_URLS_ERROR';
export const LIST_SHORT_URLS = 'shlink/shortUrlsList/LIST_SHORT_URLS';
/* eslint-enable padding-line-between-statements */

export interface ShortUrlsList {
  shortUrls?: ShlinkShortUrlsResponse;
  loading: boolean;
  error: boolean;
}

export interface ListShortUrlsAction extends Action<string> {
  shortUrls: ShlinkShortUrlsResponse;
  params: ShortUrlsListParams;
}

export type ListShortUrlsCombinedAction = (
  ListShortUrlsAction
  & CreateVisitsAction
  & CreateShortUrlAction
  & DeleteShortUrlAction
  & ShortUrlEditedAction
);

const initialState: ShortUrlsList = {
  loading: true,
  error: false,
};

export default buildReducer<ShortUrlsList, ListShortUrlsCombinedAction>({
  [LIST_SHORT_URLS_START]: (state) => ({ ...state, loading: true, error: false }),
  [LIST_SHORT_URLS_ERROR]: () => ({ loading: false, error: true }),
  [LIST_SHORT_URLS]: (_, { shortUrls }) => ({ loading: false, error: false, shortUrls }),
  [SHORT_URL_DELETED]: pipe(
    (state: ShortUrlsList, { shortCode, domain }: DeleteShortUrlAction) => !state.shortUrls ? state : assocPath(
      [ 'shortUrls', 'data' ],
      reject((shortUrl) => shortUrlMatches(shortUrl, shortCode, domain), state.shortUrls.data),
      state,
    ),
    (state) => !state.shortUrls ? state : assocPath(
      [ 'shortUrls', 'pagination', 'totalItems' ],
      state.shortUrls.pagination.totalItems - 1,
      state,
    ),
  ),
  [CREATE_VISITS]: (state, { createdVisits }) => assocPath(
    [ 'shortUrls', 'data' ],
    state.shortUrls?.data?.map(
      (currentShortUrl) => {
        // Find the last of the new visit for this short URL, and pick the amount of visits from it
        const lastVisit = last(
          createdVisits.filter(
            ({ shortUrl }) => shortUrl && shortUrlMatches(currentShortUrl, shortUrl.shortCode, shortUrl.domain),
          ),
        );

        return lastVisit?.shortUrl
          ? assoc('visitsCount', lastVisit.shortUrl.visitsCount, currentShortUrl)
          : currentShortUrl;
      },
    ),
    state,
  ),
  [CREATE_SHORT_URL]: pipe(
    // The only place where the list and the creation form coexist is the overview page.
    // There we can assume we are displaying page 1, and therefore, we can safely prepend the new short URL and remove the last one.
    (state: ShortUrlsList, { result }: CreateShortUrlAction) => !state.shortUrls ? state : assocPath(
      [ 'shortUrls', 'data' ],
      [ result, ...init(state.shortUrls.data) ],
      state,
    ),
    (state: ShortUrlsList) => !state.shortUrls ? state : assocPath(
      [ 'shortUrls', 'pagination', 'totalItems' ],
      state.shortUrls.pagination.totalItems + 1,
      state,
    ),
  ),
  [SHORT_URL_EDITED]: (state, { shortUrl: editedShortUrl }) => !state.shortUrls ? state : assocPath(
    [ 'shortUrls', 'data' ],
    state.shortUrls.data.map((shortUrl) => {
      const { shortCode, domain } = editedShortUrl;

      return shortUrlMatches(shortUrl, shortCode, domain) ? editedShortUrl : shortUrl;
    }),
    state,
  ),
}, initialState);

export const listShortUrls = (buildShlinkApiClient: ShlinkApiClientBuilder) => (
  params: ShortUrlsListParams = {},
) => async (dispatch: Dispatch, getState: GetState) => {
  dispatch({ type: LIST_SHORT_URLS_START });
  const { listShortUrls } = buildShlinkApiClient(getState);

  try {
    const shortUrls = await listShortUrls(params);

    dispatch<ListShortUrlsAction>({ type: LIST_SHORT_URLS, shortUrls, params });
  } catch (e) {
    dispatch({ type: LIST_SHORT_URLS_ERROR, params });
  }
};
