import { Mock } from 'ts-mockery';
import { ShortUrlDetailAction, shortUrlDetailReducerCreator } from '../../../src/short-urls/reducers/shortUrlDetail';
import { ShortUrl } from '../../../src/short-urls/data';
import { ShlinkApiClient } from '../../../src/api/services/ShlinkApiClient';
import { ShlinkState } from '../../../src/container/types';
import { ShortUrlsList } from '../../../src/short-urls/reducers/shortUrlsList';

describe('shortUrlDetailReducer', () => {
  const getShortUrlCall = vi.fn();
  const buildShlinkApiClient = () => Mock.of<ShlinkApiClient>({ getShortUrl: getShortUrlCall });
  const { reducer, getShortUrlDetail } = shortUrlDetailReducerCreator(buildShlinkApiClient);

  beforeEach(vi.clearAllMocks);

  describe('reducer', () => {
    const action = (type: string) => Mock.of<ShortUrlDetailAction>({ type });

    it('returns loading on GET_SHORT_URL_DETAIL_START', () => {
      const state = reducer({ loading: false, error: false }, action(getShortUrlDetail.pending.toString()));
      const { loading } = state;

      expect(loading).toEqual(true);
    });

    it('stops loading and returns error on GET_SHORT_URL_DETAIL_ERROR', () => {
      const state = reducer({ loading: true, error: false }, action(getShortUrlDetail.rejected.toString()));
      const { loading, error } = state;

      expect(loading).toEqual(false);
      expect(error).toEqual(true);
    });

    it('return short URL on GET_SHORT_URL_DETAIL', () => {
      const actionShortUrl = Mock.of<ShortUrl>({ longUrl: 'foo', shortCode: 'bar' });
      const state = reducer(
        { loading: true, error: false },
        { type: getShortUrlDetail.fulfilled.toString(), payload: actionShortUrl },
      );
      const { loading, error, shortUrl } = state;

      expect(loading).toEqual(false);
      expect(error).toEqual(false);
      expect(shortUrl).toEqual(actionShortUrl);
    });
  });

  describe('getShortUrlDetail', () => {
    const dispatchMock = vi.fn();
    const buildGetState = (shortUrlsList?: ShortUrlsList) => () => Mock.of<ShlinkState>({ shortUrlsList });

    it('dispatches start and error when promise is rejected', async () => {
      getShortUrlCall.mockRejectedValue({});

      await getShortUrlDetail({ shortCode: 'abc123', domain: '' })(dispatchMock, buildGetState(), {});

      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenNthCalledWith(1, expect.objectContaining({
        type: getShortUrlDetail.pending.toString(),
      }));
      expect(dispatchMock).toHaveBeenNthCalledWith(2, expect.objectContaining({
        type: getShortUrlDetail.rejected.toString(),
      }));
      expect(getShortUrlCall).toHaveBeenCalledTimes(1);
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
      getShortUrlCall.mockResolvedValue(resolvedShortUrl);

      await getShortUrlDetail({ shortCode: 'abc123', domain: '' })(dispatchMock, buildGetState(shortUrlsList), {});

      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenNthCalledWith(1, expect.objectContaining({
        type: getShortUrlDetail.pending.toString(),
      }));
      expect(dispatchMock).toHaveBeenNthCalledWith(2, expect.objectContaining({
        type: getShortUrlDetail.fulfilled.toString(),
        payload: resolvedShortUrl,
      }));
      expect(getShortUrlCall).toHaveBeenCalledTimes(1);
    });

    it('avoids API calls when short URL is found in local state', async () => {
      const foundShortUrl = Mock.of<ShortUrl>({ longUrl: 'foo', shortCode: 'abc123' });
      getShortUrlCall.mockResolvedValue(Mock.all<ShortUrl>());

      await getShortUrlDetail(foundShortUrl)(
        dispatchMock,
        buildGetState(Mock.of<ShortUrlsList>({
          shortUrls: {
            data: [foundShortUrl],
          },
        })),
        {},
      );

      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenNthCalledWith(1, expect.objectContaining({
        type: getShortUrlDetail.pending.toString(),
      }));
      expect(dispatchMock).toHaveBeenNthCalledWith(2, expect.objectContaining({
        type: getShortUrlDetail.fulfilled.toString(),
        payload: foundShortUrl,
      }));
      expect(getShortUrlCall).not.toHaveBeenCalled();
    });
  });
});
