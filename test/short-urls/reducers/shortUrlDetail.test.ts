import { fromPartial } from '@total-typescript/shoehorn';
import type { ShlinkApiClient } from '../../../src/api/services/ShlinkApiClient';
import type { ShlinkState } from '../../../src/container/types';
import type { ShortUrl } from '../../../src/short-urls/data';
import { shortUrlDetailReducerCreator } from '../../../src/short-urls/reducers/shortUrlDetail';
import type { ShortUrlsList } from '../../../src/short-urls/reducers/shortUrlsList';

describe('shortUrlDetailReducer', () => {
  const getShortUrlCall = jest.fn();
  const buildShlinkApiClient = () => fromPartial<ShlinkApiClient>({ getShortUrl: getShortUrlCall });
  const { reducer, getShortUrlDetail } = shortUrlDetailReducerCreator(buildShlinkApiClient);

  beforeEach(jest.clearAllMocks);

  describe('reducer', () => {
    it('returns loading on GET_SHORT_URL_DETAIL_START', () => {
      const { loading } = reducer({ loading: false, error: false }, getShortUrlDetail.pending('', { shortCode: '' }));
      expect(loading).toEqual(true);
    });

    it('stops loading and returns error on GET_SHORT_URL_DETAIL_ERROR', () => {
      const state = reducer({ loading: true, error: false }, getShortUrlDetail.rejected(null, '', { shortCode: '' }));
      const { loading, error } = state;

      expect(loading).toEqual(false);
      expect(error).toEqual(true);
    });

    it('return short URL on GET_SHORT_URL_DETAIL', () => {
      const actionShortUrl = fromPartial<ShortUrl>({ longUrl: 'foo', shortCode: 'bar' });
      const state = reducer(
        { loading: true, error: false },
        getShortUrlDetail.fulfilled(actionShortUrl, '', { shortCode: '' }),
      );
      const { loading, error, shortUrl } = state;

      expect(loading).toEqual(false);
      expect(error).toEqual(false);
      expect(shortUrl).toEqual(actionShortUrl);
    });
  });

  describe('getShortUrlDetail', () => {
    const dispatchMock = jest.fn();
    const buildGetState = (shortUrlsList?: ShortUrlsList) => () => fromPartial<ShlinkState>({ shortUrlsList });

    it.each([
      [undefined],
      [fromPartial<ShortUrlsList>({})],
      [
        fromPartial<ShortUrlsList>({
          shortUrls: { data: [] },
        }),
      ],
      [
        fromPartial<ShortUrlsList>({
          shortUrls: {
            data: [{ shortCode: 'this_will_not_match' }],
          },
        }),
      ],
    ])('performs API call when short URL is not found in local state', async (shortUrlsList?: ShortUrlsList) => {
      const resolvedShortUrl = fromPartial<ShortUrl>({ longUrl: 'foo', shortCode: 'abc123' });
      getShortUrlCall.mockResolvedValue(resolvedShortUrl);

      await getShortUrlDetail({ shortCode: 'abc123', domain: '' })(dispatchMock, buildGetState(shortUrlsList), {});

      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenLastCalledWith(expect.objectContaining({ payload: resolvedShortUrl }));
      expect(getShortUrlCall).toHaveBeenCalledTimes(1);
    });

    it('avoids API calls when short URL is found in local state', async () => {
      const foundShortUrl = fromPartial<ShortUrl>({ longUrl: 'foo', shortCode: 'abc123' });
      getShortUrlCall.mockResolvedValue(fromPartial<ShortUrl>({}));

      await getShortUrlDetail(foundShortUrl)(
        dispatchMock,
        buildGetState(fromPartial({
          shortUrls: {
            data: [foundShortUrl],
          },
        })),
        {},
      );

      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenLastCalledWith(expect.objectContaining({ payload: foundShortUrl }));
      expect(getShortUrlCall).not.toHaveBeenCalled();
    });
  });
});
