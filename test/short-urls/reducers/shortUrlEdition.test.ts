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
import { ReachableServer, SelectedServer } from '../../../src/servers/data';

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
      expect(reducer(undefined, { type: SHORT_URL_EDITED, shortUrl })).toEqual({
        shortUrl,
        saving: false,
        error: false,
      });
    });
  });

  describe('editShortUrl', () => {
    const updateShortUrl = jest.fn().mockResolvedValue(shortUrl);
    const updateShortUrlTags = jest.fn().mockResolvedValue([]);
    const buildShlinkApiClient = jest.fn().mockReturnValue({ updateShortUrl, updateShortUrlTags });
    const dispatch = jest.fn();
    const createGetState = (selectedServer: SelectedServer = null) => () => Mock.of<ShlinkState>({ selectedServer });

    afterEach(jest.clearAllMocks);

    it.each([[undefined], [null], ['example.com']])('dispatches short URL on success', async (domain) => {
      await editShortUrl(buildShlinkApiClient)(shortCode, domain, { longUrl })(dispatch, createGetState());

      expect(buildShlinkApiClient).toHaveBeenCalledTimes(1);
      expect(updateShortUrl).toHaveBeenCalledTimes(1);
      expect(updateShortUrl).toHaveBeenCalledWith(shortCode, domain, { longUrl });
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, { type: EDIT_SHORT_URL_START });
      expect(dispatch).toHaveBeenNthCalledWith(2, { type: SHORT_URL_EDITED, shortUrl });
    });

    it.each([
      [null, { tags: ['foo', 'bar'] }, 1],
      [null, {}, 0],
      [Mock.of<ReachableServer>({ version: '2.6.0' }), {}, 0],
      [Mock.of<ReachableServer>({ version: '2.6.0' }), { tags: ['foo', 'bar'] }, 0],
      [Mock.of<ReachableServer>({ version: '2.5.0' }), {}, 0],
      [Mock.of<ReachableServer>({ version: '2.5.0' }), { tags: ['foo', 'bar'] }, 1],
    ])(
      'sends tags separately when appropriate, based on selected server and the payload',
      async (server, payload, expectedTagsCalls) => {
        const getState = createGetState(server);

        await editShortUrl(buildShlinkApiClient)(shortCode, null, payload)(dispatch, getState);

        expect(updateShortUrl).toHaveBeenCalled();
        expect(updateShortUrlTags).toHaveBeenCalledTimes(expectedTagsCalls);
      },
    );

    it('dispatches error on failure', async () => {
      const error = new Error();

      updateShortUrl.mockRejectedValue(error);

      try {
        await editShortUrl(buildShlinkApiClient)(shortCode, undefined, { longUrl })(dispatch, createGetState());
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
