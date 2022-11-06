import { Mock } from 'ts-mockery';
import reducer, {
  EDIT_SHORT_URL_START,
  EDIT_SHORT_URL_ERROR,
  SHORT_URL_EDITED,
  editShortUrl,
  ShortUrlEditedAction,
} from '../../../src/short-urls/reducers/shortUrlEdition';
import { ShlinkState } from '../../../src/container/types';
import { ShortUrl } from '../../../src/short-urls/data';
import { SelectedServer } from '../../../src/servers/data';

describe('shortUrlEditionReducer', () => {
  const longUrl = 'https://shlink.io';
  const shortCode = 'abc123';
  const shortUrl = Mock.of<ShortUrl>({ longUrl, shortCode });

  describe('reducer', () => {
    it('returns loading on EDIT_SHORT_URL_START', () => {
      expect(reducer(undefined, Mock.of<ShortUrlEditedAction>({ type: EDIT_SHORT_URL_START }))).toEqual({
        saving: true,
        error: false,
      });
    });

    it('returns error on EDIT_SHORT_URL_ERROR', () => {
      expect(reducer(undefined, Mock.of<ShortUrlEditedAction>({ type: EDIT_SHORT_URL_ERROR }))).toEqual({
        saving: false,
        error: true,
      });
    });

    it('returns provided tags and shortCode on SHORT_URL_EDITED', () => {
      expect(reducer(undefined, { type: SHORT_URL_EDITED, payload: shortUrl })).toEqual({
        shortUrl,
        saving: false,
        error: false,
      });
    });
  });

  describe('editShortUrl', () => {
    const updateShortUrl = jest.fn().mockResolvedValue(shortUrl);
    const buildShlinkApiClient = jest.fn().mockReturnValue({ updateShortUrl });
    const dispatch = jest.fn();
    const createGetState = (selectedServer: SelectedServer = null) => () => Mock.of<ShlinkState>({ selectedServer });

    afterEach(jest.clearAllMocks);

    it.each([[undefined], [null], ['example.com']])('dispatches short URL on success', async (domain) => {
      await editShortUrl(buildShlinkApiClient)({ shortCode, domain, data: { longUrl } })(dispatch, createGetState());

      expect(buildShlinkApiClient).toHaveBeenCalledTimes(1);
      expect(updateShortUrl).toHaveBeenCalledTimes(1);
      expect(updateShortUrl).toHaveBeenCalledWith(shortCode, domain, { longUrl });
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, { type: EDIT_SHORT_URL_START });
      expect(dispatch).toHaveBeenNthCalledWith(2, { type: SHORT_URL_EDITED, payload: shortUrl });
    });

    it('dispatches error on failure', async () => {
      const error = new Error();

      updateShortUrl.mockRejectedValue(error);

      try {
        await editShortUrl(buildShlinkApiClient)({ shortCode, data: { longUrl } })(dispatch, createGetState());
      } catch (e) {
        expect(e).toBe(error);
      }

      expect(buildShlinkApiClient).toHaveBeenCalledTimes(1);
      expect(updateShortUrl).toHaveBeenCalledTimes(1);
      expect(updateShortUrl).toHaveBeenCalledWith(shortCode, undefined, { longUrl });
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, { type: EDIT_SHORT_URL_START });
      expect(dispatch).toHaveBeenNthCalledWith(2, { type: EDIT_SHORT_URL_ERROR });
    });
  });
});
