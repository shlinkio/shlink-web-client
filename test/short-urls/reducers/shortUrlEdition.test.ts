import { Mock } from 'ts-mockery';
import { ShortUrlEditedAction, shortUrlEditionReducerCreator } from '../../../src/short-urls/reducers/shortUrlEdition';
import { ShlinkState } from '../../../src/container/types';
import { ShortUrl } from '../../../src/short-urls/data';
import { SelectedServer } from '../../../src/servers/data';

describe('shortUrlEditionReducer', () => {
  const longUrl = 'https://shlink.io';
  const shortCode = 'abc123';
  const shortUrl = Mock.of<ShortUrl>({ longUrl, shortCode });
  const updateShortUrl = jest.fn().mockResolvedValue(shortUrl);
  const buildShlinkApiClient = jest.fn().mockReturnValue({ updateShortUrl });
  const { reducer, editShortUrl } = shortUrlEditionReducerCreator(buildShlinkApiClient);

  afterEach(jest.clearAllMocks);

  describe('reducer', () => {
    it('returns loading on EDIT_SHORT_URL_START', () => {
      expect(reducer(undefined, Mock.of<ShortUrlEditedAction>({ type: editShortUrl.pending.toString() }))).toEqual({
        saving: true,
        saved: false,
        error: false,
      });
    });

    it('returns error on EDIT_SHORT_URL_ERROR', () => {
      expect(reducer(undefined, Mock.of<ShortUrlEditedAction>({ type: editShortUrl.rejected.toString() }))).toEqual({
        saving: false,
        saved: false,
        error: true,
      });
    });

    it('returns provided tags and shortCode on SHORT_URL_EDITED', () => {
      expect(reducer(undefined, { type: editShortUrl.fulfilled.toString(), payload: shortUrl })).toEqual({
        shortUrl,
        saving: false,
        saved: true,
        error: false,
      });
    });
  });

  describe('editShortUrl', () => {
    const dispatch = jest.fn();
    const createGetState = (selectedServer: SelectedServer = null) => () => Mock.of<ShlinkState>({ selectedServer });

    afterEach(jest.clearAllMocks);

    it.each([[undefined], [null], ['example.com']])('dispatches short URL on success', async (domain) => {
      await editShortUrl({ shortCode, domain, data: { longUrl } })(dispatch, createGetState(), {});

      expect(buildShlinkApiClient).toHaveBeenCalledTimes(1);
      expect(updateShortUrl).toHaveBeenCalledTimes(1);
      expect(updateShortUrl).toHaveBeenCalledWith(shortCode, domain, { longUrl });
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, expect.objectContaining({
        type: editShortUrl.pending.toString(),
      }));
      expect(dispatch).toHaveBeenNthCalledWith(2, expect.objectContaining({
        type: editShortUrl.fulfilled.toString(),
        payload: shortUrl,
      }));
    });

    it('dispatches error on failure', async () => {
      const error = new Error();

      updateShortUrl.mockRejectedValue(error);

      await editShortUrl({ shortCode, data: { longUrl } })(dispatch, createGetState(), {});

      expect(buildShlinkApiClient).toHaveBeenCalledTimes(1);
      expect(updateShortUrl).toHaveBeenCalledTimes(1);
      expect(updateShortUrl).toHaveBeenCalledWith(shortCode, undefined, { longUrl });
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, expect.objectContaining({ type: editShortUrl.pending.toString() }));
      expect(dispatch).toHaveBeenNthCalledWith(2, expect.objectContaining({ type: editShortUrl.rejected.toString() }));
    });
  });
});
