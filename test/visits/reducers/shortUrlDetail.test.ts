import { Mock } from 'ts-mockery';
import reducer, {
  getShortUrlDetail,
  GET_SHORT_URL_DETAIL_START,
  GET_SHORT_URL_DETAIL_ERROR,
  GET_SHORT_URL_DETAIL,
  ShortUrlDetailAction,
} from '../../../src/visits/reducers/shortUrlDetail';
import { ShortUrl } from '../../../src/short-urls/data';
import ShlinkApiClient from '../../../src/utils/services/ShlinkApiClient';
import { ShlinkState } from '../../../src/container/types';

describe('shortUrlDetailReducer', () => {
  describe('reducer', () => {
    const action = (type: string) => Mock.of<ShortUrlDetailAction>({ type });

    it('returns loading on GET_SHORT_URL_DETAIL_START', () => {
      const state = reducer({ loading: false, error: false }, action(GET_SHORT_URL_DETAIL_START));
      const { loading } = state;

      expect(loading).toEqual(true);
    });

    it('stops loading and returns error on GET_SHORT_URL_DETAIL_ERROR', () => {
      const state = reducer({ loading: true, error: false }, action(GET_SHORT_URL_DETAIL_ERROR));
      const { loading, error } = state;

      expect(loading).toEqual(false);
      expect(error).toEqual(true);
    });

    it('return short URL on GET_SHORT_URL_DETAIL', () => {
      const actionShortUrl = Mock.of<ShortUrl>({ longUrl: 'foo', shortCode: 'bar' });
      const state = reducer({ loading: true, error: false }, { type: GET_SHORT_URL_DETAIL, shortUrl: actionShortUrl });
      const { loading, error, shortUrl } = state;

      expect(loading).toEqual(false);
      expect(error).toEqual(false);
      expect(shortUrl).toEqual(actionShortUrl);
    });
  });

  describe('getShortUrlDetail', () => {
    const buildApiClientMock = (returned: Promise<ShortUrl>) => Mock.of<ShlinkApiClient>({
      getShortUrl: jest.fn(async () => returned),
    });
    const dispatchMock = jest.fn();
    const getState = () => Mock.of<ShlinkState>();

    beforeEach(() => dispatchMock.mockReset());

    it('dispatches start and error when promise is rejected', async () => {
      const ShlinkApiClient = buildApiClientMock(Promise.reject());

      await getShortUrlDetail(() => ShlinkApiClient)('abc123', '')(dispatchMock, getState);

      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenNthCalledWith(1, { type: GET_SHORT_URL_DETAIL_START });
      expect(dispatchMock).toHaveBeenNthCalledWith(2, { type: GET_SHORT_URL_DETAIL_ERROR });
      expect(ShlinkApiClient.getShortUrl).toHaveBeenCalledTimes(1);
    });

    it('dispatches start and success when promise is resolved', async () => {
      const resolvedShortUrl = Mock.of<ShortUrl>({ longUrl: 'foo', shortCode: 'bar' });
      const ShlinkApiClient = buildApiClientMock(Promise.resolve(resolvedShortUrl));

      await getShortUrlDetail(() => ShlinkApiClient)('abc123', '')(dispatchMock, getState);

      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenNthCalledWith(1, { type: GET_SHORT_URL_DETAIL_START });
      expect(dispatchMock).toHaveBeenNthCalledWith(2, { type: GET_SHORT_URL_DETAIL, shortUrl: resolvedShortUrl });
      expect(ShlinkApiClient.getShortUrl).toHaveBeenCalledTimes(1);
    });
  });
});
