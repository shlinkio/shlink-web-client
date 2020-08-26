import reducer, {
  RESET_SHORT_URL_PARAMS,
  resetShortUrlParams,
  ShortUrlsListParams,
} from '../../../src/short-urls/reducers/shortUrlsListParams';
import { LIST_SHORT_URLS } from '../../../src/short-urls/reducers/shortUrlsList';

describe('shortUrlsListParamsReducer', () => {
  describe('reducer', () => {
    const defaultState: ShortUrlsListParams = { page: '1' };

    it('returns params when action is LIST_SHORT_URLS', () =>
      expect(reducer(undefined, { type: LIST_SHORT_URLS, params: { searchTerm: 'foo', page: '2' } })).toEqual({
        page: '2',
        searchTerm: 'foo',
      }));

    it('returns default value when action is RESET_SHORT_URL_PARAMS', () =>
      expect(reducer(undefined, { type: RESET_SHORT_URL_PARAMS, params: defaultState })).toEqual(defaultState));
  });

  describe('resetShortUrlParams', () => {
    it('returns proper action', () =>
      expect(resetShortUrlParams()).toEqual({ type: RESET_SHORT_URL_PARAMS }));
  });
});
