import { assoc, assocPath, init, last, pipe, reject } from 'ramda';
import { Action, Dispatch } from 'redux';
import { shortUrlMatches } from '../helpers';
import { CREATE_VISITS, CreateVisitsAction } from '../../visits/reducers/visitCreation';
import { ShortUrl, ShortUrlIdentifier } from '../data';
import { buildReducer } from '../../utils/helpers/redux';
import { GetState } from '../../container/types';
import { ShlinkApiClientBuilder } from '../../utils/services/ShlinkApiClientBuilder';
import { ShlinkShortUrlsResponse } from '../../utils/services/types';
import { EditShortUrlTagsAction, SHORT_URL_TAGS_EDITED } from './shortUrlTags';
import { DeleteShortUrlAction, SHORT_URL_DELETED } from './shortUrlDeletion';
import { SHORT_URL_META_EDITED, ShortUrlMetaEditedAction } from './shortUrlMeta';
import { SHORT_URL_EDITED, ShortUrlEditedAction } from './shortUrlEdition';
import { ShortUrlsListParams } from './shortUrlsListParams';
import { CREATE_SHORT_URL, CreateShortUrlAction } from './shortUrlCreation';

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
  & EditShortUrlTagsAction
  & ShortUrlEditedAction
  & ShortUrlMetaEditedAction
  & CreateVisitsAction
  & CreateShortUrlAction
  & DeleteShortUrlAction
);

const initialState: ShortUrlsList = {
  loading: true,
  error: false,
};

const setPropFromActionOnMatchingShortUrl = <T extends ShortUrlIdentifier>(prop: keyof T) => (
  state: ShortUrlsList,
  { shortCode, domain, [prop]: propValue }: T,
): ShortUrlsList => !state.shortUrls ? state : assocPath(
  [ 'shortUrls', 'data' ],
  state.shortUrls.data.map(
    (shortUrl: ShortUrl) =>
      shortUrlMatches(shortUrl, shortCode, domain) ? { ...shortUrl, [prop]: propValue } : shortUrl,
  ),
  state,
);

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
  [SHORT_URL_TAGS_EDITED]: setPropFromActionOnMatchingShortUrl<EditShortUrlTagsAction>('tags'),
  [SHORT_URL_META_EDITED]: setPropFromActionOnMatchingShortUrl<ShortUrlMetaEditedAction>('meta'),
  [SHORT_URL_EDITED]: setPropFromActionOnMatchingShortUrl<ShortUrlEditedAction>('longUrl'),
  [CREATE_VISITS]: (state, { createdVisits }) => assocPath(
    [ 'shortUrls', 'data' ],
    state.shortUrls?.data?.map(
      (currentShortUrl) => {
        // Find the last of the new visit for this short URL, and pick the amount of visits from it
        const lastVisit = last(
          createdVisits.filter(({ shortUrl }) => shortUrlMatches(currentShortUrl, shortUrl.shortCode, shortUrl.domain)),
        );

        return lastVisit ? assoc('visitsCount', lastVisit.shortUrl.visitsCount, currentShortUrl) : currentShortUrl;
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
