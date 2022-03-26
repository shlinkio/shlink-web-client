import { Mock } from 'ts-mockery';
import reducer, {
  getShortUrlDetail,
  GET_SHORT_URL_DETAIL_START,
  GET_SHORT_URL_DETAIL_ERROR,
  GET_SHORT_URL_DETAIL,
  ShortUrlDetailAction,
} from '../../../src/short-urls/reducers/shortUrlDetail';
import { ShortUrl } from '../../../src/short-urls/data';
import ShlinkApiClient from '../../../src/api/services/ShlinkApiClient';
import { ShlinkState } from '../../../src/container/types';
import { ShortUrlsList } from '../../../src/short-urls/reducers/shortUrlsList';

describe('shortUrlDetailReducer', () => {
  beforeEach(jest.clearAllMocks);

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
    const buildGetState = (shortUrlsList?: ShortUrlsList) => () => Mock.of<ShlinkState>({ shortUrlsList });

    it('dispatches start and error when promise is rejected', async () => {
      const ShlinkApiClient = buildApiClientMock(Promise.reject({}));

      await getShortUrlDetail(() => ShlinkApiClient)('abc123', '')(dispatchMock, buildGetState());

      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenNthCalledWith(1, { type: GET_SHORT_URL_DETAIL_START });
      expect(dispatchMock).toHaveBeenNthCalledWith(2, { type: GET_SHORT_URL_DETAIL_ERROR });
      expect(ShlinkApiClient.getShortUrl).toHaveBeenCalledTimes(1);
    });

    it.each([
      [undefined],
      [Mock.all<ShortUrlsList>()],
      [
        Mock.of<ShortUrlsList>({
          shortUrls: { data: [] },
        }),
      ],
      [
        Mock.of<ShortUrlsList>({
          shortUrls: {
            data: [Mock.of<ShortUrl>({ shortCode: 'this_will_not_match' })],
          },
        }),
      ],
    ])('performs API call when short URL is not found in local state', async (shortUrlsList?: ShortUrlsList) => {
      const resolvedShortUrl = Mock.of<ShortUrl>({ longUrl: 'foo', shortCode: 'abc123' });
      const ShlinkApiClient = buildApiClientMock(Promise.resolve(resolvedShortUrl));

      await getShortUrlDetail(() => ShlinkApiClient)('abc123', '')(dispatchMock, buildGetState(shortUrlsList));

      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenNthCalledWith(1, { type: GET_SHORT_URL_DETAIL_START });
      expect(dispatchMock).toHaveBeenNthCalledWith(2, { type: GET_SHORT_URL_DETAIL, shortUrl: resolvedShortUrl });
      expect(ShlinkApiClient.getShortUrl).toHaveBeenCalledTimes(1);
    });

    it('avoids API calls when short URL is found in local state', async () => {
      const foundShortUrl = Mock.of<ShortUrl>({ longUrl: 'foo', shortCode: 'abc123' });
      const ShlinkApiClient = buildApiClientMock(Promise.resolve(Mock.all<ShortUrl>()));

      await getShortUrlDetail(() => ShlinkApiClient)(foundShortUrl.shortCode, foundShortUrl.domain)(
        dispatchMock,
        buildGetState(Mock.of<ShortUrlsList>({
          shortUrls: {
            data: [foundShortUrl],
          },
        })),
      );

      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenNthCalledWith(1, { type: GET_SHORT_URL_DETAIL_START });
      expect(dispatchMock).toHaveBeenNthCalledWith(2, { type: GET_SHORT_URL_DETAIL, shortUrl: foundShortUrl });
      expect(ShlinkApiClient.getShortUrl).not.toHaveBeenCalled();
    });
  });
});
