import { createSlice } from '@reduxjs/toolkit';
import { assocPath, last, pipe, reject } from 'ramda';
import { shortUrlMatches } from '../helpers';
import { createNewVisits } from '../../visits/reducers/visitCreation';
import { createAsyncThunk } from '../../utils/helpers/redux';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { ShlinkShortUrlsListParams, ShlinkShortUrlsResponse } from '../../api/types';
import { shortUrlDeleted } from './shortUrlDeletion';
import { createShortUrl } from './shortUrlCreation';
import { editShortUrl } from './shortUrlEdition';
import { ShortUrl } from '../data';

const REDUCER_PREFIX = 'shlink/shortUrlsList';
export const ITEMS_IN_OVERVIEW_PAGE = 5;

export interface ShortUrlsList {
  shortUrls?: ShlinkShortUrlsResponse;
  loading: boolean;
  error: boolean;
}

const initialState: ShortUrlsList = {
  loading: true,
  error: false,
};

export const listShortUrls = (buildShlinkApiClient: ShlinkApiClientBuilder) => createAsyncThunk(
  `${REDUCER_PREFIX}/listShortUrls`,
  (params: ShlinkShortUrlsListParams | void, { getState }): Promise<ShlinkShortUrlsResponse> => {
    const { listShortUrls: shlinkListShortUrls } = buildShlinkApiClient(getState);
    return shlinkListShortUrls(params ?? {});
  },
);

export const shortUrlsListReducerCreator = (
  listShortUrlsThunk: ReturnType<typeof listShortUrls>,
  editShortUrlThunk: ReturnType<typeof editShortUrl>,
  createShortUrlThunk: ReturnType<typeof createShortUrl>,
) => createSlice({
  name: REDUCER_PREFIX,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(listShortUrlsThunk.pending, (state) => ({ ...state, loading: true, error: false }));
    builder.addCase(listShortUrlsThunk.rejected, () => ({ loading: false, error: true }));
    builder.addCase(
      listShortUrlsThunk.fulfilled,
      (_, { payload: shortUrls }) => ({ loading: false, error: false, shortUrls }),
    );

    builder.addCase(
      createShortUrlThunk.fulfilled,
      pipe(
        // The only place where the list and the creation form coexist is the overview page.
        // There we can assume we are displaying page 1, and therefore, we can safely prepend the new short URL.
        // We can also remove the items above the amount that is displayed there.
        (state, { payload }) => (!state.shortUrls ? state : assocPath(
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
    );

    builder.addCase(
      editShortUrlThunk.fulfilled,
      (state, { payload: editedShortUrl }) => (!state.shortUrls ? state : assocPath(
        ['shortUrls', 'data'],
        state.shortUrls.data.map((shortUrl) => {
          const { shortCode, domain } = editedShortUrl;
          return shortUrlMatches(shortUrl, shortCode, domain) ? editedShortUrl : shortUrl;
        }),
        state,
      )),
    );

    builder.addCase(
      shortUrlDeleted,
      pipe(
        (state, { payload }) => (!state.shortUrls ? state : assocPath(
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
    );

    builder.addCase(
      createNewVisits,
      (state, { payload }) => assocPath(
        ['shortUrls', 'data'],
        state.shortUrls?.data?.map(
          // Find the last of the new visit for this short URL, and pick its short URL. It will have an up-to-date amount of visits.
          (currentShortUrl) => last(
            payload.createdVisits.filter(
              ({ shortUrl }) => shortUrl && shortUrlMatches(currentShortUrl, shortUrl.shortCode, shortUrl.domain),
            ),
          )?.shortUrl ?? currentShortUrl,
        ),
        state,
      ),
    );
  },
});
