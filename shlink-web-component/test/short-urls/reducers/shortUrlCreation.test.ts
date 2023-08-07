import { fromPartial } from '@total-typescript/shoehorn';
import type { ShlinkApiClient, ShlinkShortUrl } from '../../../src/api-contract';
import {
  createShortUrl as createShortUrlCreator,
  shortUrlCreationReducerCreator,
} from '../../../src/short-urls/reducers/shortUrlCreation';

describe('shortUrlCreationReducer', () => {
  const shortUrl = fromPartial<ShlinkShortUrl>({});
  const createShortUrlCall = vi.fn();
  const buildShlinkApiClient = () => fromPartial<ShlinkApiClient>({ createShortUrl: createShortUrlCall });
  const createShortUrl = createShortUrlCreator(buildShlinkApiClient);
  const { reducer, resetCreateShortUrl } = shortUrlCreationReducerCreator(createShortUrl);

  describe('reducer', () => {
    it('returns loading on CREATE_SHORT_URL_START', () => {
      expect(reducer(undefined, createShortUrl.pending('', fromPartial({})))).toEqual({
        saving: true,
        saved: false,
        error: false,
      });
    });

    it('returns error on CREATE_SHORT_URL_ERROR', () => {
      expect(reducer(undefined, createShortUrl.rejected(null, '', fromPartial({})))).toEqual({
        saving: false,
        saved: false,
        error: true,
      });
    });

    it('returns result on CREATE_SHORT_URL', () => {
      expect(reducer(undefined, createShortUrl.fulfilled(shortUrl, '', fromPartial({})))).toEqual({
        result: shortUrl,
        saving: false,
        saved: true,
        error: false,
      });
    });

    it('returns default state on RESET_CREATE_SHORT_URL', () => {
      expect(reducer(undefined, resetCreateShortUrl())).toEqual({
        saving: false,
        saved: false,
        error: false,
      });
    });
  });

  describe('createShortUrl', () => {
    const dispatch = vi.fn();

    it('calls API on success', async () => {
      createShortUrlCall.mockResolvedValue(shortUrl);
      await createShortUrl({ longUrl: 'foo' })(dispatch, vi.fn(), {});

      expect(createShortUrlCall).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenLastCalledWith(expect.objectContaining({ payload: shortUrl }));
    });
  });
});
