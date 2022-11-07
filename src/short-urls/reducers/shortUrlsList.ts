import { assoc, assocPath, last, pipe, reject } from 'ramda';
import { Action, Dispatch } from 'redux';
import { shortUrlMatches } from '../helpers';
import { createNewVisits, CreateVisitsAction } from '../../visits/reducers/visitCreation';
import { buildReducer } from '../../utils/helpers/redux';
import { GetState } from '../../container/types';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { ShlinkShortUrlsListParams, ShlinkShortUrlsResponse } from '../../api/types';
import { DeleteShortUrlAction, SHORT_URL_DELETED } from './shortUrlDeletion';
import { CREATE_SHORT_URL, CreateShortUrlAction } from './shortUrlCreation';
import { SHORT_URL_EDITED, ShortUrlEditedAction } from './shortUrlEdition';
import { ShortUrl } from '../data';

export const LIST_SHORT_URLS_START = 'shlink/shortUrlsList/LIST_SHORT_URLS_START';
export const LIST_SHORT_URLS_ERROR = 'shlink/shortUrlsList/LIST_SHORT_URLS_ERROR';
export const LIST_SHORT_URLS = 'shlink/shortUrlsList/LIST_SHORT_URLS';

export const ITEMS_IN_OVERVIEW_PAGE = 5;

export interface ShortUrlsList {
  shortUrls?: ShlinkShortUrlsResponse;
  loading: boolean;
  error: boolean;
}

export interface ListShortUrlsAction extends Action<string> {
  shortUrls: ShlinkShortUrlsResponse;
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
  [`${SHORT_URL_DELETED}/fulfilled`]: pipe( // TODO Do not hardcode action type here
    (state: ShortUrlsList, { payload }: DeleteShortUrlAction) => (!state.shortUrls ? state : assocPath(
      ['shortUrls', 'data'],
      reject<ShortUrl, ShortUrl[]>((shortUrl) =>
        shortUrlMatches(shortUrl, payload.shortCode, payload.domain), state.shortUrls.data),
      state,
    )),
    (state) => (!state.shortUrls ? state : assocPath(
      ['shortUrls', 'pagination', 'totalItems'],
      state.shortUrls.pagination.totalItems - 1,
      state,
    )),
  ),
  [createNewVisits.toString()]: (state, { payload }) => assocPath(
    ['shortUrls', 'data'],
    state.shortUrls?.data?.map(
      (currentShortUrl) => {
        // Find the last of the new visit for this short URL, and pick the amount of visits from it
        const lastVisit = last(
          payload.createdVisits.filter(
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
  [`${CREATE_SHORT_URL}/fulfilled`]: pipe( // TODO Do not hardcode action type here
    // The only place where the list and the creation form coexist is the overview page.
    // There we can assume we are displaying page 1, and therefore, we can safely prepend the new short URL.
    // We can also remove the items above the amount that is displayed there.
    (state: ShortUrlsList, { payload }: CreateShortUrlAction) => (!state.shortUrls ? state : assocPath(
      ['shortUrls', 'data'],
      [payload, ...state.shortUrls.data.slice(0, ITEMS_IN_OVERVIEW_PAGE - 1)],
      state,
    )),
    (state: ShortUrlsList) => (!state.shortUrls ? state : assocPath(
      ['shortUrls', 'pagination', 'totalItems'],
      state.shortUrls.pagination.totalItems + 1,
      state,
    )),
  ),
  // TODO Do not hardcode action type here
  [`${SHORT_URL_EDITED}/fulfilled`]: (state, { payload: editedShortUrl }) => (!state.shortUrls ? state : assocPath(
    ['shortUrls', 'data'],
    state.shortUrls.data.map((shortUrl) => {
      const { shortCode, domain } = editedShortUrl;

      return shortUrlMatches(shortUrl, shortCode, domain) ? editedShortUrl : shortUrl;
    }),
    state,
  )),
}, initialState);

export const listShortUrls = (buildShlinkApiClient: ShlinkApiClientBuilder) => (
  params: ShlinkShortUrlsListParams = {},
) => async (dispatch: Dispatch, getState: GetState) => {
  dispatch({ type: LIST_SHORT_URLS_START });
  const { listShortUrls: shlinkListShortUrls } = buildShlinkApiClient(getState);

  try {
    const shortUrls = await shlinkListShortUrls(params);

    dispatch<ListShortUrlsAction>({ type: LIST_SHORT_URLS, shortUrls });
  } catch (e) {
    dispatch({ type: LIST_SHORT_URLS_ERROR });
  }
};
