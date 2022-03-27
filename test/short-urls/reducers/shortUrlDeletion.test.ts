import { Mock } from 'ts-mockery';
import reducer, {
  DELETE_SHORT_URL_ERROR,
  DELETE_SHORT_URL_START,
  RESET_DELETE_SHORT_URL,
  SHORT_URL_DELETED,
  resetDeleteShortUrl,
  deleteShortUrl,
} from '../../../src/short-urls/reducers/shortUrlDeletion';
import { ProblemDetailsError } from '../../../src/api/types';
import ShlinkApiClient from '../../../src/api/services/ShlinkApiClient';

describe('shortUrlDeletionReducer', () => {
  describe('reducer', () => {
    it('returns loading on DELETE_SHORT_URL_START', () =>
      expect(reducer(undefined, { type: DELETE_SHORT_URL_START } as any)).toEqual({
        shortCode: '',
        loading: true,
        error: false,
      }));

    it('returns default on RESET_DELETE_SHORT_URL', () =>
      expect(reducer(undefined, { type: RESET_DELETE_SHORT_URL } as any)).toEqual({
        shortCode: '',
        loading: false,
        error: false,
      }));

    it('returns shortCode on SHORT_URL_DELETED', () =>
      expect(reducer(undefined, { type: SHORT_URL_DELETED, shortCode: 'foo' } as any)).toEqual({
        shortCode: 'foo',
        loading: false,
        error: false,
      }));

    it('returns errorData on DELETE_SHORT_URL_ERROR', () => {
      const errorData = Mock.of<ProblemDetailsError>({ type: 'bar' });

      expect(reducer(undefined, { type: DELETE_SHORT_URL_ERROR, errorData } as any)).toEqual({
        shortCode: '',
        loading: false,
        error: true,
        errorData,
      });
    });
  });

  describe('resetDeleteShortUrl', () => {
    it('returns expected action', () =>
      expect(resetDeleteShortUrl()).toEqual({ type: RESET_DELETE_SHORT_URL }));
  });

  describe('deleteShortUrl', () => {
    const dispatch = jest.fn();
    const getState = jest.fn().mockReturnValue({ selectedServer: {} });

    afterEach(() => {
      dispatch.mockReset();
      getState.mockClear();
    });

    it.each(
      [[undefined], [null], ['example.com']],
    )('dispatches proper actions if API client request succeeds', async (domain) => {
      const apiClientMock = Mock.of<ShlinkApiClient>({
        deleteShortUrl: jest.fn(() => ''),
      });
      const shortCode = 'abc123';

      await deleteShortUrl(() => apiClientMock)(shortCode, domain)(dispatch, getState);

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, { type: DELETE_SHORT_URL_START });
      expect(dispatch).toHaveBeenNthCalledWith(2, { type: SHORT_URL_DELETED, shortCode, domain });

      expect(apiClientMock.deleteShortUrl).toHaveBeenCalledTimes(1);
      expect(apiClientMock.deleteShortUrl).toHaveBeenCalledWith(shortCode, domain);
    });

    it('dispatches proper actions if API client request fails', async () => {
      const data = { foo: 'bar' };
      const error = { response: { data } };
      const apiClientMock = Mock.of<ShlinkApiClient>({
        deleteShortUrl: jest.fn(async () => Promise.reject(error)),
      });
      const shortCode = 'abc123';

      try {
        await deleteShortUrl(() => apiClientMock)(shortCode)(dispatch, getState);
      } catch (e) {
        expect(e).toEqual(error);
      }

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, { type: DELETE_SHORT_URL_START });
      expect(dispatch).toHaveBeenNthCalledWith(2, { type: DELETE_SHORT_URL_ERROR, errorData: data });

      expect(apiClientMock.deleteShortUrl).toHaveBeenCalledTimes(1);
      expect(apiClientMock.deleteShortUrl).toHaveBeenCalledWith(shortCode, undefined);
    });
  });
});
