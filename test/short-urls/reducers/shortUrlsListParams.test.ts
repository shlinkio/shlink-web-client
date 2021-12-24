import reducer, {
  RESET_SHORT_URL_PARAMS,
  resetShortUrlParams,
} from '../../../src/short-urls/reducers/shortUrlsListParams';
import { LIST_SHORT_URLS } from '../../../src/short-urls/reducers/shortUrlsList';

describe('shortUrlsListParamsReducer', () => {
  describe('reducer', () => {
    it('returns params when action is LIST_SHORT_URLS', () =>
      expect(reducer(undefined, { type: LIST_SHORT_URLS, params: { searchTerm: 'foo', page: '2' } } as any)).toEqual({
        page: '2',
        searchTerm: 'foo',
      }));

    it('returns default value when action is RESET_SHORT_URL_PARAMS', () =>
      expect(reducer(undefined, { type: RESET_SHORT_URL_PARAMS } as any)).toEqual({ page: '1' }));
  });

  describe('resetShortUrlParams', () => {
    it('returns proper action', () =>
      expect(resetShortUrlParams()).toEqual({ type: RESET_SHORT_URL_PARAMS }));
  });
});
