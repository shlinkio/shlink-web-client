import { fromPartial } from '@total-typescript/shoehorn';
import { addDays, formatISO, subDays } from 'date-fns';
import type { ShlinkApiClient } from '../../../src/api/services/ShlinkApiClient';
import type { ShlinkVisits } from '../../../src/api/types';
import type { ShlinkState } from '../../../src/container/types';
import type {
  ShortUrlVisits } from '../../../src/shlink-web-component/visits/reducers/shortUrlVisits';
import {
  getShortUrlVisits as getShortUrlVisitsCreator,
  shortUrlVisitsReducerCreator,
} from '../../../src/shlink-web-component/visits/reducers/shortUrlVisits';
import { createNewVisits } from '../../../src/shlink-web-component/visits/reducers/visitCreation';
import type { Visit } from '../../../src/shlink-web-component/visits/types';
import { formatIsoDate } from '../../../src/utils/helpers/date';
import type { DateInterval } from '../../../src/utils/helpers/dateIntervals';
import { rangeOf } from '../../../src/utils/utils';

describe('shortUrlVisitsReducer', () => {
  const now = new Date();
  const visitsMocks = rangeOf(2, () => fromPartial<Visit>({}));
  const getShortUrlVisitsCall = vi.fn();
  const buildApiClientMock = () => fromPartial<ShlinkApiClient>({ getShortUrlVisits: getShortUrlVisitsCall });
  const getShortUrlVisits = getShortUrlVisitsCreator(buildApiClientMock);
  const { reducer, cancelGetVisits: cancelGetShortUrlVisits } = shortUrlVisitsReducerCreator(getShortUrlVisits);

  describe('reducer', () => {
    const buildState = (data: Partial<ShortUrlVisits>) => fromPartial<ShortUrlVisits>(data);

    it('returns loading on GET_SHORT_URL_VISITS_START', () => {
      const { loading } = reducer(buildState({ loading: false }), getShortUrlVisits.pending('', { shortCode: '' }));
      expect(loading).toEqual(true);
    });

    it('returns loadingLarge on GET_SHORT_URL_VISITS_LARGE', () => {
      const { loadingLarge } = reducer(buildState({ loadingLarge: false }), getShortUrlVisits.large());
      expect(loadingLarge).toEqual(true);
    });

    it('returns cancelLoad on GET_SHORT_URL_VISITS_CANCEL', () => {
      const { cancelLoad } = reducer(buildState({ cancelLoad: false }), cancelGetShortUrlVisits());
      expect(cancelLoad).toEqual(true);
    });

    it('stops loading and returns error on GET_SHORT_URL_VISITS_ERROR', () => {
      const { loading, error } = reducer(
        buildState({ loading: true, error: false }),
        getShortUrlVisits.rejected(null, '', { shortCode: '' }),
      );

      expect(loading).toEqual(false);
      expect(error).toEqual(true);
    });

    it('return visits on GET_SHORT_URL_VISITS', () => {
      const actionVisits: Visit[] = [fromPartial({}), fromPartial({})];
      const { loading, error, visits } = reducer(
        buildState({ loading: true, error: false }),
        getShortUrlVisits.fulfilled({ visits: actionVisits }, '', { shortCode: '' }),
      );

      expect(loading).toEqual(false);
      expect(error).toEqual(false);
      expect(visits).toEqual(actionVisits);
    });

    it.each([
      [{ shortCode: 'abc123' }, visitsMocks.length + 1],
      [{ shortCode: 'def456' }, visitsMocks.length],
      [
        fromPartial<ShortUrlVisits>({
          shortCode: 'abc123',
          query: { endDate: formatIsoDate(subDays(now, 1)) ?? undefined },
        }),
        visitsMocks.length,
      ],
      [
        fromPartial<ShortUrlVisits>({
          shortCode: 'abc123',
          query: { startDate: formatIsoDate(addDays(now, 1)) ?? undefined },
        }),
        visitsMocks.length,
      ],
      [
        fromPartial<ShortUrlVisits>({
          shortCode: 'abc123',
          query: {
            startDate: formatIsoDate(subDays(now, 5)) ?? undefined,
            endDate: formatIsoDate(subDays(now, 2)) ?? undefined,
          },
        }),
        visitsMocks.length,
      ],
      [
        fromPartial<ShortUrlVisits>({
          shortCode: 'abc123',
          query: {
            startDate: formatIsoDate(subDays(now, 5)) ?? undefined,
            endDate: formatIsoDate(addDays(now, 3)) ?? undefined,
          },
        }),
        visitsMocks.length + 1,
      ],
      [
        fromPartial<ShortUrlVisits>({
          shortCode: 'def456',
          query: {
            startDate: formatIsoDate(subDays(now, 5)) ?? undefined,
            endDate: formatIsoDate(addDays(now, 3)) ?? undefined,
          },
        }),
        visitsMocks.length,
      ],
    ])('prepends new visits on CREATE_VISIT', (state, expectedVisits) => {
      const shortUrl = {
        shortCode: 'abc123',
      };
      const prevState = buildState({
        ...state,
        visits: visitsMocks,
      });

      const { visits } = reducer(
        prevState,
        createNewVisits([fromPartial({ shortUrl, visit: { date: formatIsoDate(now) ?? undefined } })]),
      );

      expect(visits).toHaveLength(expectedVisits);
    });

    it('returns new progress on GET_SHORT_URL_VISITS_PROGRESS_CHANGED', () => {
      const { progress } = reducer(undefined, getShortUrlVisits.progressChanged(85));
      expect(progress).toEqual(85);
    });

    it('returns fallbackInterval on GET_SHORT_URL_VISITS_FALLBACK_TO_INTERVAL', () => {
      const fallbackInterval: DateInterval = 'last30Days';
      const state = reducer(undefined, getShortUrlVisits.fallbackToInterval(fallbackInterval));

      expect(state).toEqual(expect.objectContaining({ fallbackInterval }));
    });
  });

  describe('getShortUrlVisits', () => {
    const dispatchMock = vi.fn();
    const getState = () => fromPartial<ShlinkState>({
      shortUrlVisits: { cancelLoad: false },
    });

    it.each([
      [undefined, undefined],
      [{}, undefined],
      [{ domain: 'foobar.com' }, 'foobar.com'],
    ])('dispatches start and success when promise is resolved', async (query, domain) => {
      const visits = visitsMocks;
      const shortCode = 'abc123';
      getShortUrlVisitsCall.mockResolvedValue({
        data: visitsMocks,
        pagination: {
          currentPage: 1,
          pagesCount: 1,
          totalItems: 1,
        },
      });

      await getShortUrlVisits({ shortCode, query })(dispatchMock, getState, {});

      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenLastCalledWith(expect.objectContaining({
        payload: { visits, shortCode, domain, query: query ?? {} },
      }));
      expect(getShortUrlVisitsCall).toHaveBeenCalledTimes(1);
    });

    it('performs multiple API requests when response contains more pages', async () => {
      const expectedRequests = 3;
      getShortUrlVisitsCall.mockImplementation(async (_, { page }) =>
        Promise.resolve({
          data: visitsMocks,
          pagination: {
            currentPage: page,
            pagesCount: expectedRequests,
            totalItems: 1,
          },
        }));

      await getShortUrlVisits({ shortCode: 'abc123' })(dispatchMock, getState, {});

      expect(getShortUrlVisitsCall).toHaveBeenCalledTimes(expectedRequests);
      expect(dispatchMock).toHaveBeenNthCalledWith(3, expect.objectContaining({
        payload: expect.objectContaining({
          visits: [...visitsMocks, ...visitsMocks, ...visitsMocks],
        }),
      }));
    });

    it.each([
      [
        [fromPartial<Visit>({ date: formatISO(subDays(now, 5)) })],
        getShortUrlVisits.fallbackToInterval('last7Days'),
        3,
      ],
      [
        [fromPartial<Visit>({ date: formatISO(subDays(now, 200)) })],
        getShortUrlVisits.fallbackToInterval('last365Days'),
        3,
      ],
      [[], expect.objectContaining({ type: getShortUrlVisits.fulfilled.toString() }), 2],
    ])('dispatches fallback interval when the list of visits is empty', async (
      lastVisits,
      expectedSecondDispatch,
      expectedDispatchCalls,
    ) => {
      const buildVisitsResult = (data: Visit[] = []): ShlinkVisits => ({
        data,
        pagination: {
          currentPage: 1,
          pagesCount: 1,
          totalItems: 1,
        },
      });
      getShortUrlVisitsCall
        .mockResolvedValueOnce(buildVisitsResult())
        .mockResolvedValueOnce(buildVisitsResult(lastVisits));

      await getShortUrlVisits({ shortCode: 'abc123', doIntervalFallback: true })(dispatchMock, getState, {});

      expect(dispatchMock).toHaveBeenCalledTimes(expectedDispatchCalls);
      expect(dispatchMock).toHaveBeenNthCalledWith(2, expectedSecondDispatch);
      expect(getShortUrlVisitsCall).toHaveBeenCalledTimes(2);
    });
  });
});
