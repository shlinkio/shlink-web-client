import reduce, {
  RESET_SHORT_URL_PARAMS,
  resetShortUrlParams,
} from '../../../src/short-urls/reducers/shortUrlsListParams';
import { LIST_SHORT_URLS } from '../../../src/short-urls/reducers/shortUrlsList';

describe('shortUrlsListParamsReducer', () => {
  describe('reduce', () => {
    const defaultState = { page: '1' };

    it('returns default value when action is anknown', () =>
      expect(reduce(defaultState, { type: 'unknown' })).toEqual(defaultState)
    );

    it('returns params when action is LIST_SHORT_URLS', () =>
      expect(reduce(defaultState, { type: LIST_SHORT_URLS, params: { searchTerm: 'foo' } })).toEqual({
        ...defaultState,
        searchTerm: 'foo'
      })
    );

    it('returns default value when action is RESET_SHORT_URL_PARAMS', () =>
      expect(reduce(defaultState, { type: RESET_SHORT_URL_PARAMS })).toEqual(defaultState)
    );
  });

  describe('resetShortUrlParams', () => {
    it('returns proper action', () =>
      expect(resetShortUrlParams()).toEqual({ type: RESET_SHORT_URL_PARAMS })
    );
  });
});
