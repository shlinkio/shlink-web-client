import { fromPartial } from '@total-typescript/shoehorn';
import type { ShlinkApiClient } from '../../../src/api/services/ShlinkApiClient';
import type { ProblemDetailsError } from '../../../src/api/types/errors';
import {
  deleteShortUrl as deleteShortUrlCreator,
  shortUrlDeletionReducerCreator,
} from '../../../src/short-urls/reducers/shortUrlDeletion';

describe('shortUrlDeletionReducer', () => {
  const deleteShortUrlCall = jest.fn();
  const buildShlinkApiClient = () => fromPartial<ShlinkApiClient>({ deleteShortUrl: deleteShortUrlCall });
  const deleteShortUrl = deleteShortUrlCreator(buildShlinkApiClient);
  const { reducer, resetDeleteShortUrl } = shortUrlDeletionReducerCreator(deleteShortUrl);

  beforeEach(jest.clearAllMocks);

  describe('reducer', () => {
    it('returns loading on DELETE_SHORT_URL_START', () =>
      expect(reducer(undefined, deleteShortUrl.pending('', { shortCode: '' }))).toEqual({
        shortCode: '',
        loading: true,
        error: false,
        deleted: false,
      }));

    it('returns default on RESET_DELETE_SHORT_URL', () =>
      expect(reducer(undefined, resetDeleteShortUrl())).toEqual({
        shortCode: '',
        loading: false,
        error: false,
        deleted: false,
      }));

    it('returns shortCode on SHORT_URL_DELETED', () =>
      expect(reducer(undefined, deleteShortUrl.fulfilled({ shortCode: 'foo' }, '', { shortCode: 'foo' }))).toEqual({
        shortCode: 'foo',
        loading: false,
        error: false,
        deleted: true,
      }));

    it('returns errorData on DELETE_SHORT_URL_ERROR', () => {
      const errorData = fromPartial<ProblemDetailsError>(
        { type: 'bar', detail: 'detail', title: 'title', status: 400 },
      );
      const error = errorData as unknown as Error;

      expect(reducer(undefined, deleteShortUrl.rejected(error, '', { shortCode: '' }))).toEqual({
        shortCode: '',
        loading: false,
        error: true,
        deleted: false,
        errorData,
      });
    });
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
      expect(dispatch).toHaveBeenLastCalledWith(expect.objectContaining({
        payload: { shortCode, domain },
      }));

      expect(deleteShortUrlCall).toHaveBeenCalledTimes(1);
      expect(deleteShortUrlCall).toHaveBeenCalledWith(shortCode, domain);
    });
  });
});
