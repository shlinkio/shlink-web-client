import { Mock } from 'ts-mockery';
import { addDays, formatISO, subDays } from 'date-fns';
import reducer, {
  getShortUrlVisits,
  cancelGetShortUrlVisits,
  GET_SHORT_URL_VISITS_START,
  GET_SHORT_URL_VISITS_ERROR,
  GET_SHORT_URL_VISITS,
  GET_SHORT_URL_VISITS_LARGE,
  GET_SHORT_URL_VISITS_CANCEL,
  GET_SHORT_URL_VISITS_PROGRESS_CHANGED,
  GET_SHORT_URL_VISITS_FALLBACK_TO_INTERVAL,
  ShortUrlVisits,
} from '../../../src/visits/reducers/shortUrlVisits';
import { CREATE_VISITS } from '../../../src/visits/reducers/visitCreation';
import { rangeOf } from '../../../src/utils/utils';
import { Visit } from '../../../src/visits/types';
import { ShlinkVisits } from '../../../src/api/types';
import ShlinkApiClient from '../../../src/api/services/ShlinkApiClient';
import { ShlinkState } from '../../../src/container/types';
import { formatIsoDate } from '../../../src/utils/helpers/date';
import { DateInterval } from '../../../src/utils/dates/types';

describe('shortUrlVisitsReducer', () => {
  const now = new Date();
  const visitsMocks = rangeOf(2, () => Mock.all<Visit>());

  describe('reducer', () => {
    const buildState = (data: Partial<ShortUrlVisits>) => Mock.of<ShortUrlVisits>(data);

    it('returns loading on GET_SHORT_URL_VISITS_START', () => {
      const state = reducer(buildState({ loading: false }), { type: GET_SHORT_URL_VISITS_START } as any);
      const { loading } = state;

      expect(loading).toEqual(true);
    });

    it('returns loadingLarge on GET_SHORT_URL_VISITS_LARGE', () => {
      const state = reducer(buildState({ loadingLarge: false }), { type: GET_SHORT_URL_VISITS_LARGE } as any);
      const { loadingLarge } = state;

      expect(loadingLarge).toEqual(true);
    });

    it('returns cancelLoad on GET_SHORT_URL_VISITS_CANCEL', () => {
      const state = reducer(buildState({ cancelLoad: false }), { type: GET_SHORT_URL_VISITS_CANCEL } as any);
      const { cancelLoad } = state;

      expect(cancelLoad).toEqual(true);
    });

    it('stops loading and returns error on GET_SHORT_URL_VISITS_ERROR', () => {
      const state = reducer(buildState({ loading: true, error: false }), { type: GET_SHORT_URL_VISITS_ERROR } as any);
      const { loading, error } = state;

      expect(loading).toEqual(false);
      expect(error).toEqual(true);
    });

    it('return visits on GET_SHORT_URL_VISITS', () => {
      const actionVisits = [{}, {}];
      const state = reducer(
        buildState({ loading: true, error: false }),
        { type: GET_SHORT_URL_VISITS, visits: actionVisits } as any,
      );
      const { loading, error, visits } = state;

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

      const { visits } = reducer(
        prevState,
        { type: CREATE_VISITS, createdVisits: [{ shortUrl, visit: { date: formatIsoDate(now) ?? undefined } }] } as any,
      );

      expect(visits).toHaveLength(expectedVisits);
    });

    it('returns new progress on GET_SHORT_URL_VISITS_PROGRESS_CHANGED', () => {
      const state = reducer(undefined, { type: GET_SHORT_URL_VISITS_PROGRESS_CHANGED, progress: 85 } as any);

      expect(state).toEqual(expect.objectContaining({ progress: 85 }));
    });

    it('returns fallbackInterval on GET_SHORT_URL_VISITS_FALLBACK_TO_INTERVAL', () => {
      const fallbackInterval: DateInterval = 'last30Days';
      const state = reducer(undefined, { type: GET_SHORT_URL_VISITS_FALLBACK_TO_INTERVAL, fallbackInterval } as any);

      expect(state).toEqual(expect.objectContaining({ fallbackInterval }));
    });
  });

  describe('getShortUrlVisits', () => {
    type GetVisitsReturn = Promise<ShlinkVisits> | ((shortCode: string, query: any) => Promise<ShlinkVisits>);

    const buildApiClientMock = (returned: GetVisitsReturn) => Mock.of<ShlinkApiClient>({
      getShortUrlVisits: jest.fn(typeof returned === 'function' ? returned : async () => returned),
    });
    const dispatchMock = jest.fn();
    const getState = () => Mock.of<ShlinkState>({
      shortUrlVisits: Mock.of<ShortUrlVisits>({ cancelLoad: false }),
    });

    beforeEach(() => dispatchMock.mockReset());

    it('dispatches start and error when promise is rejected', async () => {
      const ShlinkApiClient = buildApiClientMock(Promise.reject({}));

      await getShortUrlVisits(() => ShlinkApiClient)('abc123')(dispatchMock, getState);

      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenNthCalledWith(1, { type: GET_SHORT_URL_VISITS_START });
      expect(dispatchMock).toHaveBeenNthCalledWith(2, { type: GET_SHORT_URL_VISITS_ERROR });
      expect(ShlinkApiClient.getShortUrlVisits).toHaveBeenCalledTimes(1);
    });

    it.each([
      [undefined, undefined],
      [{}, undefined],
      [{ domain: 'foobar.com' }, 'foobar.com'],
    ])('dispatches start and success when promise is resolved', async (query, domain) => {
      const visits = visitsMocks;
      const shortCode = 'abc123';
      const ShlinkApiClient = buildApiClientMock(Promise.resolve({
        data: visitsMocks,
        pagination: {
          currentPage: 1,
          pagesCount: 1,
          totalItems: 1,
        },
      }));

      await getShortUrlVisits(() => ShlinkApiClient)(shortCode, query)(dispatchMock, getState);

      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenNthCalledWith(1, { type: GET_SHORT_URL_VISITS_START });
      expect(dispatchMock).toHaveBeenNthCalledWith(
        2,
        { type: GET_SHORT_URL_VISITS, visits, shortCode, domain, query: query ?? {} },
      );
      expect(ShlinkApiClient.getShortUrlVisits).toHaveBeenCalledTimes(1);
    });

    it('performs multiple API requests when response contains more pages', async () => {
      const expectedRequests = 3;
      const ShlinkApiClient = buildApiClientMock(async (_, { page }) =>
        Promise.resolve({
          data: visitsMocks,
          pagination: {
            currentPage: page,
            pagesCount: expectedRequests,
            totalItems: 1,
          },
        }));

      await getShortUrlVisits(() => ShlinkApiClient)('abc123')(dispatchMock, getState);

      expect(ShlinkApiClient.getShortUrlVisits).toHaveBeenCalledTimes(expectedRequests);
      expect(dispatchMock).toHaveBeenNthCalledWith(3, expect.objectContaining({
        visits: [...visitsMocks, ...visitsMocks, ...visitsMocks],
      }));
    });

    it.each([
      [
        [Mock.of<Visit>({ date: formatISO(subDays(new Date(), 5)) })],
        { type: GET_SHORT_URL_VISITS_FALLBACK_TO_INTERVAL, fallbackInterval: 'last7Days' },
      ],
      [
        [Mock.of<Visit>({ date: formatISO(subDays(new Date(), 200)) })],
        { type: GET_SHORT_URL_VISITS_FALLBACK_TO_INTERVAL, fallbackInterval: 'last365Days' },
      ],
      [[], expect.objectContaining({ type: GET_SHORT_URL_VISITS })],
    ])('dispatches fallback interval when the list of visits is empty', async (lastVisits, expectedSecondDispatch) => {
      const buildVisitsResult = (data: Visit[] = []): ShlinkVisits => ({
        data,
        pagination: {
          currentPage: 1,
          pagesCount: 1,
          totalItems: 1,
        },
      });
      const getShlinkShortUrlVisits = jest.fn()
        .mockResolvedValueOnce(buildVisitsResult())
        .mockResolvedValueOnce(buildVisitsResult(lastVisits));
      const ShlinkApiClient = Mock.of<ShlinkApiClient>({ getShortUrlVisits: getShlinkShortUrlVisits });

      await getShortUrlVisits(() => ShlinkApiClient)('abc123', {}, true)(dispatchMock, getState);

      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenNthCalledWith(1, { type: GET_SHORT_URL_VISITS_START });
      expect(dispatchMock).toHaveBeenNthCalledWith(2, expectedSecondDispatch);
      expect(getShlinkShortUrlVisits).toHaveBeenCalledTimes(2);
    });
  });

  describe('cancelGetShortUrlVisits', () => {
    it('just returns the action with proper type', () =>
      expect(cancelGetShortUrlVisits()).toEqual({ type: GET_SHORT_URL_VISITS_CANCEL }));
  });
});
