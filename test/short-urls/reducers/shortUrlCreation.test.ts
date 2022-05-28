import { Mock } from 'ts-mockery';
import reducer, {
  CREATE_SHORT_URL_START,
  CREATE_SHORT_URL_ERROR,
  CREATE_SHORT_URL,
  RESET_CREATE_SHORT_URL,
  createShortUrl,
  resetCreateShortUrl,
  CreateShortUrlAction,
} from '../../../src/short-urls/reducers/shortUrlCreation';
import { ShortUrl } from '../../../src/short-urls/data';
import { ShlinkApiClient } from '../../../src/api/services/ShlinkApiClient';
import { ShlinkState } from '../../../src/container/types';

describe('shortUrlCreationReducer', () => {
  const shortUrl = Mock.all<ShortUrl>();

  describe('reducer', () => {
    const action = (type: string, args: Partial<CreateShortUrlAction> = {}) => Mock.of<CreateShortUrlAction>(
      { type, ...args },
    );

    it('returns loading on CREATE_SHORT_URL_START', () => {
      expect(reducer(undefined, action(CREATE_SHORT_URL_START))).toEqual({
        result: null,
        saving: true,
        error: false,
      });
    });

    it('returns error on CREATE_SHORT_URL_ERROR', () => {
      expect(reducer(undefined, action(CREATE_SHORT_URL_ERROR))).toEqual({
        result: null,
        saving: false,
        error: true,
      });
    });

    it('returns result on CREATE_SHORT_URL', () => {
      expect(reducer(undefined, action(CREATE_SHORT_URL, { result: shortUrl }))).toEqual({
        result: shortUrl,
        saving: false,
        error: false,
      });
    });

    it('returns default state on RESET_CREATE_SHORT_URL', () => {
      expect(reducer(undefined, action(RESET_CREATE_SHORT_URL))).toEqual({
        result: null,
        saving: false,
        error: false,
      });
    });
  });

  describe('resetCreateShortUrl', () => {
    it('returns proper action', () => expect(resetCreateShortUrl()).toEqual({ type: RESET_CREATE_SHORT_URL }));
  });

  describe('createShortUrl', () => {
    const createApiClientMock = (result: Promise<ShortUrl>) => Mock.of<ShlinkApiClient>({
      createShortUrl: jest.fn().mockReturnValue(result),
    });
    const dispatch = jest.fn();
    const getState = () => Mock.all<ShlinkState>();

    afterEach(jest.resetAllMocks);

    it('calls API on success', async () => {
      const apiClientMock = createApiClientMock(Promise.resolve(shortUrl));
      const dispatchable = createShortUrl(() => apiClientMock)({ longUrl: 'foo' });

      await dispatchable(dispatch, getState);

      expect(apiClientMock.createShortUrl).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, { type: CREATE_SHORT_URL_START });
      expect(dispatch).toHaveBeenNthCalledWith(2, { type: CREATE_SHORT_URL, result: shortUrl });
    });

    it('throws on error', async () => {
      const error = 'Error';
      const apiClientMock = createApiClientMock(Promise.reject(error));
      const dispatchable = createShortUrl(() => apiClientMock)({ longUrl: 'foo' });

      expect.assertions(5);

      try {
        await dispatchable(dispatch, getState);
      } catch (e) {
        expect(e).toEqual(error);
      }

      expect(apiClientMock.createShortUrl).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, { type: CREATE_SHORT_URL_START });
      expect(dispatch).toHaveBeenNthCalledWith(2, { type: CREATE_SHORT_URL_ERROR });
    });
  });
});
