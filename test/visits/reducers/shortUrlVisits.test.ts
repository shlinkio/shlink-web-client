import { Mock } from 'ts-mockery';
import { addDays, formatISO, subDays } from 'date-fns';
import {
  getShortUrlVisits as getShortUrlVisitsCreator,
  shortUrlVisitsReducerCreator,
  ShortUrlVisits,
} from '../../../src/visits/reducers/shortUrlVisits';
import { rangeOf } from '../../../src/utils/utils';
import { Visit } from '../../../src/visits/types';
import { ShlinkVisits } from '../../../src/api/types';
import { ShlinkApiClient } from '../../../src/api/services/ShlinkApiClient';
import { ShlinkState } from '../../../src/container/types';
import { formatIsoDate } from '../../../src/utils/helpers/date';
import { DateInterval } from '../../../src/utils/helpers/dateIntervals';
import { createNewVisits } from '../../../src/visits/reducers/visitCreation';

describe('shortUrlVisitsReducer', () => {
  const now = new Date();
  const visitsMocks = rangeOf(2, () => Mock.all<Visit>());
  const getShortUrlVisitsCall = vi.fn();
  const buildApiClientMock = () => Mock.of<ShlinkApiClient>({ getShortUrlVisits: getShortUrlVisitsCall });
  const getShortUrlVisits = getShortUrlVisitsCreator(buildApiClientMock);
  const { reducer, cancelGetVisits: cancelGetShortUrlVisits } = shortUrlVisitsReducerCreator(getShortUrlVisits);

  beforeEach(vi.clearAllMocks);

  describe('reducer', () => {
    const buildState = (data: Partial<ShortUrlVisits>) => Mock.of<ShortUrlVisits>(data);

    it('returns loading on GET_SHORT_URL_VISITS_START', () => {
      const { loading } = reducer(buildState({ loading: false }), { type: getShortUrlVisits.pending.toString() });
      expect(loading).toEqual(true);
    });

    it('returns loadingLarge on GET_SHORT_URL_VISITS_LARGE', () => {
      const { loadingLarge } = reducer(
        buildState({ loadingLarge: false }),
        { type: getShortUrlVisits.large.toString() },
      );
      expect(loadingLarge).toEqual(true);
    });

    it('returns cancelLoad on GET_SHORT_URL_VISITS_CANCEL', () => {
      const { cancelLoad } = reducer(buildState({ cancelLoad: false }), { type: cancelGetShortUrlVisits.toString() });
      expect(cancelLoad).toEqual(true);
    });

    it('stops loading and returns error on GET_SHORT_URL_VISITS_ERROR', () => {
      const { loading, error } = reducer(
        buildState({ loading: true, error: false }),
        { type: getShortUrlVisits.rejected.toString() },
      );

      expect(loading).toEqual(false);
      expect(error).toEqual(true);
    });

    it('return visits on GET_SHORT_URL_VISITS', () => {
      const actionVisits = [{}, {}];
      const { loading, error, visits } = reducer(buildState({ loading: true, error: false }), {
        type: getShortUrlVisits.fulfilled.toString(),
        payload: { visits: actionVisits },
      });

      expect(loading).toEqual(false);
      expect(error).toEqual(false);
      expect(visits).toEqual(actionVisits);
    });

    it.each([
      [{ shortCode: 'abc123' }, visitsMocks.length + 1],
      [{ shortCode: 'def456' }, visitsMocks.length],
      [
        Mock.of<ShortUrlVisits>({
          shortCode: 'abc123',
          query: { endDate: formatIsoDate(subDays(now, 1)) ?? undefined },
        }),
        visitsMocks.length,
      ],
      [
        Mock.of<ShortUrlVisits>({
          shortCode: 'abc123',
          query: { startDate: formatIsoDate(addDays(now, 1)) ?? undefined },
        }),
        visitsMocks.length,
      ],
      [
        Mock.of<ShortUrlVisits>({
          shortCode: 'abc123',
          query: {
            startDate: formatIsoDate(subDays(now, 5)) ?? undefined,
            endDate: formatIsoDate(subDays(now, 2)) ?? undefined,
          },
        }),
        visitsMocks.length,
      ],
      [
        Mock.of<ShortUrlVisits>({
          shortCode: 'abc123',
          query: {
            startDate: formatIsoDate(subDays(now, 5)) ?? undefined,
            endDate: formatIsoDate(addDays(now, 3)) ?? undefined,
          },
        }),
        visitsMocks.length + 1,
      ],
      [
        Mock.of<ShortUrlVisits>({
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

      const { visits } = reducer(prevState, {
        type: createNewVisits.toString(),
        payload: { createdVisits: [{ shortUrl, visit: { date: formatIsoDate(now) ?? undefined } }] },
      });

      expect(visits).toHaveLength(expectedVisits);
    });

    it('returns new progress on GET_SHORT_URL_VISITS_PROGRESS_CHANGED', () => {
      const state = reducer(undefined, { type: getShortUrlVisits.progressChanged.toString(), payload: 85 });
      expect(state).toEqual(expect.objectContaining({ progress: 85 }));
    });

    it('returns fallbackInterval on GET_SHORT_URL_VISITS_FALLBACK_TO_INTERVAL', () => {
      const fallbackInterval: DateInterval = 'last30Days';
      const state = reducer(
        undefined,
        { type: getShortUrlVisits.fallbackToInterval.toString(), payload: fallbackInterval },
      );

      expect(state).toEqual(expect.objectContaining({ fallbackInterval }));
    });
  });

  describe('getShortUrlVisits', () => {
    const dispatchMock = vi.fn();
    const getState = () => Mock.of<ShlinkState>({
      shortUrlVisits: Mock.of<ShortUrlVisits>({ cancelLoad: false }),
    });

    it('dispatches start and error when promise is rejected', async () => {
      getShortUrlVisitsCall.mockRejectedValue({});

      await getShortUrlVisits({ shortCode: 'abc123' })(dispatchMock, getState, {});

      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenNthCalledWith(1, expect.objectContaining({
        type: getShortUrlVisits.pending.toString(),
      }));
      expect(dispatchMock).toHaveBeenNthCalledWith(2, expect.objectContaining({
        type: getShortUrlVisits.rejected.toString(),
      }));
      expect(getShortUrlVisitsCall).toHaveBeenCalledTimes(1);
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
      expect(dispatchMock).toHaveBeenNthCalledWith(1, expect.objectContaining({
        type: getShortUrlVisits.pending.toString(),
      }));
      expect(dispatchMock).toHaveBeenNthCalledWith(2, expect.objectContaining({
        type: getShortUrlVisits.fulfilled.toString(),
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
        [Mock.of<Visit>({ date: formatISO(subDays(now, 5)) })],
        { type: getShortUrlVisits.fallbackToInterval.toString(), payload: 'last7Days' },
        3,
      ],
      [
        [Mock.of<Visit>({ date: formatISO(subDays(now, 200)) })],
        { type: getShortUrlVisits.fallbackToInterval.toString(), payload: 'last365Days' },
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
      expect(dispatchMock).toHaveBeenNthCalledWith(1, expect.objectContaining({
        type: getShortUrlVisits.pending.toString(),
      }));
      expect(dispatchMock).toHaveBeenNthCalledWith(2, expectedSecondDispatch);
      expect(getShortUrlVisitsCall).toHaveBeenCalledTimes(2);
    });
  });

  describe('cancelGetShortUrlVisits', () => {
    it('just returns the action with proper type', () =>
      expect(cancelGetShortUrlVisits()).toEqual({ type: cancelGetShortUrlVisits.toString() }));
  });
});
