import { Mock } from 'ts-mockery';
import type { ShlinkState } from '../../../src/container/types';
import type { SelectedServer } from '../../../src/servers/data';
import type { ShortUrl } from '../../../src/short-urls/data';
import type { EditShortUrl } from '../../../src/short-urls/reducers/shortUrlEdition';
import {
  editShortUrl as editShortUrlCreator,
  shortUrlEditionReducerCreator,
} from '../../../src/short-urls/reducers/shortUrlEdition';

describe('shortUrlEditionReducer', () => {
  const longUrl = 'https://shlink.io';
  const shortCode = 'abc123';
  const shortUrl = Mock.of<ShortUrl>({ longUrl, shortCode });
  const updateShortUrl = jest.fn().mockResolvedValue(shortUrl);
  const buildShlinkApiClient = jest.fn().mockReturnValue({ updateShortUrl });
  const editShortUrl = editShortUrlCreator(buildShlinkApiClient);
  const { reducer } = shortUrlEditionReducerCreator(editShortUrl);

  afterEach(jest.clearAllMocks);

  describe('reducer', () => {
    it('returns loading on EDIT_SHORT_URL_START', () => {
      expect(reducer(undefined, editShortUrl.pending('', Mock.all<EditShortUrl>()))).toEqual({
        saving: true,
        saved: false,
        error: false,
      });
    });

    it('returns error on EDIT_SHORT_URL_ERROR', () => {
      expect(reducer(undefined, editShortUrl.rejected(null, '', Mock.all<EditShortUrl>()))).toEqual({
        saving: false,
        saved: false,
        error: true,
      });
    });

    it('returns provided tags and shortCode on SHORT_URL_EDITED', () => {
      expect(reducer(undefined, editShortUrl.fulfilled(shortUrl, '', Mock.all<EditShortUrl>()))).toEqual({
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
      expect(dispatch).toHaveBeenLastCalledWith(expect.objectContaining({ payload: shortUrl }));
    });
  });
});
