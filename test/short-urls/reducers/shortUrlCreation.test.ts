import { Mock } from 'ts-mockery';
import {
  CreateShortUrlAction,
  shortUrlCreationReducerCreator,
} from '../../../src/short-urls/reducers/shortUrlCreation';
import { ShortUrl } from '../../../src/short-urls/data';
import { ShlinkApiClient } from '../../../src/api/services/ShlinkApiClient';
import { ShlinkState } from '../../../src/container/types';

describe('shortUrlCreationReducer', () => {
  const shortUrl = Mock.of<ShortUrl>();
  const createShortUrlCall = jest.fn();
  const buildShlinkApiClient = () => Mock.of<ShlinkApiClient>({ createShortUrl: createShortUrlCall });
  const { reducer, createShortUrl, resetCreateShortUrl } = shortUrlCreationReducerCreator(buildShlinkApiClient);

  afterEach(jest.resetAllMocks);

  describe('reducer', () => {
    const action = (type: string, args: Partial<CreateShortUrlAction> = {}) => Mock.of<CreateShortUrlAction>(
      { type, ...args },
    );

    it('returns loading on CREATE_SHORT_URL_START', () => {
      expect(reducer(undefined, action(createShortUrl.pending.toString()))).toEqual({
        saving: true,
        saved: false,
        error: false,
      });
    });

    it('returns error on CREATE_SHORT_URL_ERROR', () => {
      expect(reducer(undefined, action(createShortUrl.rejected.toString()))).toEqual({
        saving: false,
        saved: false,
        error: true,
      });
    });

    it('returns result on CREATE_SHORT_URL', () => {
      expect(reducer(undefined, action(createShortUrl.fulfilled.toString(), { payload: shortUrl }))).toEqual({
        result: shortUrl,
        saving: false,
        saved: true,
        error: false,
      });
    });

    it('returns default state on RESET_CREATE_SHORT_URL', () => {
      expect(reducer(undefined, action(resetCreateShortUrl.toString()))).toEqual({
        saving: false,
        saved: false,
        error: false,
      });
    });
  });

  describe('resetCreateShortUrl', () => {
    it('returns proper action', () => expect(resetCreateShortUrl()).toEqual({ type: resetCreateShortUrl.toString() }));
  });

  describe('createShortUrl', () => {
    const dispatch = jest.fn();
    const getState = () => Mock.all<ShlinkState>();

    it('calls API on success', async () => {
      createShortUrlCall.mockResolvedValue(shortUrl);
      await createShortUrl({ longUrl: 'foo' })(dispatch, getState, {});

      expect(createShortUrlCall).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, expect.objectContaining({
        type: createShortUrl.pending.toString(),
      }));
      expect(dispatch).toHaveBeenNthCalledWith(2, expect.objectContaining({
        type: createShortUrl.fulfilled.toString(),
        payload: shortUrl,
      }));
    });

    it('throws on error', async () => {
      const error = new Error('Error message');
      createShortUrlCall.mockRejectedValue(error);

      await createShortUrl({ longUrl: 'foo' })(dispatch, getState, {});

      expect(createShortUrlCall).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, expect.objectContaining({
        type: createShortUrl.pending.toString(),
      }));
      expect(dispatch).toHaveBeenNthCalledWith(2, expect.objectContaining({
        type: createShortUrl.rejected.toString(),
        error: expect.objectContaining({ message: 'Error message' }),
      }));
    });
  });
});
