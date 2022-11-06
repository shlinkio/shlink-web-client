import { Mock } from 'ts-mockery';
import { shortUrlDeletionReducerCreator } from '../../../src/short-urls/reducers/shortUrlDeletion';
import { ShlinkApiClient } from '../../../src/api/services/ShlinkApiClient';
import { ProblemDetailsError } from '../../../src/api/types/errors';

describe('shortUrlDeletionReducer', () => {
  const deleteShortUrlCall = jest.fn();
  const buildShlinkApiClient = () => Mock.of<ShlinkApiClient>({ deleteShortUrl: deleteShortUrlCall });
  const { reducer, resetDeleteShortUrl, deleteShortUrl } = shortUrlDeletionReducerCreator(buildShlinkApiClient);

  beforeEach(jest.clearAllMocks);

  describe('reducer', () => {
    it('returns loading on DELETE_SHORT_URL_START', () =>
      expect(reducer(undefined, { type: deleteShortUrl.pending.toString() } as any)).toEqual({
        shortCode: '',
        loading: true,
        error: false,
        deleted: false,
      }));

    it('returns default on RESET_DELETE_SHORT_URL', () =>
      expect(reducer(undefined, { type: resetDeleteShortUrl.toString() } as any)).toEqual({
        shortCode: '',
        loading: false,
        error: false,
        deleted: false,
      }));

    it('returns shortCode on SHORT_URL_DELETED', () =>
      expect(reducer(undefined, {
        type: deleteShortUrl.fulfilled.toString(),
        payload: { shortCode: 'foo' },
      } as any)).toEqual({
        shortCode: 'foo',
        loading: false,
        error: false,
        deleted: true,
      }));

    it('returns errorData on DELETE_SHORT_URL_ERROR', () => {
      const errorData = Mock.of<ProblemDetailsError>({ type: 'bar' });
      const error = { response: { data: errorData } };

      expect(reducer(undefined, { type: deleteShortUrl.rejected.toString(), error } as any)).toEqual({
        shortCode: '',
        loading: false,
        error: true,
        deleted: false,
        errorData,
      });
    });
  });

  describe('resetDeleteShortUrl', () => {
    it('returns expected action', () =>
      expect(resetDeleteShortUrl()).toEqual({ type: resetDeleteShortUrl.toString() }));
  });

  describe('deleteShortUrl', () => {
    const dispatch = jest.fn();
    const getState = jest.fn().mockReturnValue({ selectedServer: {} });

    it.each(
      [[undefined], [null], ['example.com']],
    )('dispatches proper actions if API client request succeeds', async (domain) => {
      const shortCode = 'abc123';

      await deleteShortUrl({ shortCode, domain })(dispatch, getState, {});

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, expect.objectContaining({ type: deleteShortUrl.pending.toString() }));
      expect(dispatch).toHaveBeenNthCalledWith(2, expect.objectContaining({
        type: deleteShortUrl.fulfilled.toString(),
        payload: { shortCode, domain },
      }));

      expect(deleteShortUrlCall).toHaveBeenCalledTimes(1);
      expect(deleteShortUrlCall).toHaveBeenCalledWith(shortCode, domain);
    });

    it('dispatches proper actions if API client request fails', async () => {
      const data = { foo: 'bar' };
      const shortCode = 'abc123';

      deleteShortUrlCall.mockRejectedValue({ response: { data } });

      await deleteShortUrl({ shortCode })(dispatch, getState, {});

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, expect.objectContaining({ type: deleteShortUrl.pending.toString() }));
      expect(dispatch).toHaveBeenNthCalledWith(2, expect.objectContaining({
        type: deleteShortUrl.rejected.toString(),
      }));

      expect(deleteShortUrlCall).toHaveBeenCalledTimes(1);
      expect(deleteShortUrlCall).toHaveBeenCalledWith(shortCode, undefined);
    });
  });
});
