import { Mock } from 'ts-mockery';
import reducer, {
  EDIT_SHORT_URL_START,
  EDIT_SHORT_URL_ERROR,
  SHORT_URL_EDITED,
  editShortUrl,
  ShortUrlEditedAction,
} from '../../../src/short-urls/reducers/shortUrlEdition';
import { ShlinkState } from '../../../src/container/types';

describe('shortUrlEditionReducer', () => {
  const longUrl = 'https://shlink.io';
  const shortCode = 'abc123';

  describe('reducer', () => {
    it('returns loading on EDIT_SHORT_URL_START', () => {
      expect(reducer(undefined, Mock.of<ShortUrlEditedAction>({ type: EDIT_SHORT_URL_START }))).toEqual({
        longUrl: null,
        shortCode: null,
        saving: true,
        error: false,
      });
    });

    it('returns error on EDIT_SHORT_URL_ERROR', () => {
      expect(reducer(undefined, Mock.of<ShortUrlEditedAction>({ type: EDIT_SHORT_URL_ERROR }))).toEqual({
        longUrl: null,
        shortCode: null,
        saving: false,
        error: true,
      });
    });

    it('returns provided tags and shortCode on SHORT_URL_EDITED', () => {
      expect(reducer(undefined, { type: SHORT_URL_EDITED, longUrl, shortCode, domain: null })).toEqual({
        longUrl,
        shortCode,
        saving: false,
        error: false,
      });
    });
  });

  describe('editShortUrl', () => {
    const updateShortUrl = jest.fn().mockResolvedValue({ longUrl });
    const buildShlinkApiClient = jest.fn().mockReturnValue({ updateShortUrl });
    const dispatch = jest.fn();
    const getState = () => Mock.of<ShlinkState>();

    afterEach(jest.clearAllMocks);

    it.each([[ undefined ], [ null ], [ 'example.com' ]])('dispatches long URL on success', async (domain) => {
      await editShortUrl(buildShlinkApiClient)(shortCode, domain, { longUrl })(dispatch, getState);

      expect(buildShlinkApiClient).toHaveBeenCalledTimes(1);
      expect(updateShortUrl).toHaveBeenCalledTimes(1);
      expect(updateShortUrl).toHaveBeenCalledWith(shortCode, domain, { longUrl });
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, { type: EDIT_SHORT_URL_START });
      expect(dispatch).toHaveBeenNthCalledWith(2, { type: SHORT_URL_EDITED, longUrl, shortCode, domain });
    });

    it('dispatches error on failure', async () => {
      const error = new Error();

      updateShortUrl.mockRejectedValue(error);

      try {
        await editShortUrl(buildShlinkApiClient)(shortCode, undefined, { longUrl })(dispatch, getState);
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
