import { Mock } from 'ts-mockery';
import { addDays, formatISO, subDays } from 'date-fns';
import {
  getDomainVisits as getDomainVisitsCreator,
  DomainVisits,
  DEFAULT_DOMAIN,
  domainVisitsReducerCreator,
} from '../../../src/visits/reducers/domainVisits';
import { rangeOf } from '../../../src/utils/utils';
import { Visit } from '../../../src/visits/types';
import { ShlinkVisits } from '../../../src/api/types';
import { ShlinkApiClient } from '../../../src/api/services/ShlinkApiClient';
import { ShlinkState } from '../../../src/container/types';
import { formatIsoDate } from '../../../src/utils/helpers/date';
import { DateInterval } from '../../../src/utils/helpers/dateIntervals';
import { ShortUrl } from '../../../src/short-urls/data';
import { createNewVisits } from '../../../src/visits/reducers/visitCreation';

describe('domainVisitsReducer', () => {
  const now = new Date();
  const visitsMocks = rangeOf(2, () => Mock.all<Visit>());
  const getDomainVisitsCall = jest.fn();
  const buildApiClientMock = () => Mock.of<ShlinkApiClient>({ getDomainVisits: getDomainVisitsCall });
  const creator = getDomainVisitsCreator(buildApiClientMock);
  const { asyncThunk: getDomainVisits, progressChangedAction, largeAction, fallbackToIntervalAction } = creator;
  const { reducer, cancelGetVisits: cancelGetDomainVisits } = domainVisitsReducerCreator(creator);

  beforeEach(jest.clearAllMocks);

  describe('reducer', () => {
    const buildState = (data: Partial<DomainVisits>) => Mock.of<DomainVisits>(data);

    it('returns loading on GET_DOMAIN_VISITS_START', () => {
      const { loading } = reducer(buildState({ loading: false }), { type: getDomainVisits.pending.toString() });
      expect(loading).toEqual(true);
    });

    it('returns loadingLarge on GET_DOMAIN_VISITS_LARGE', () => {
      const { loadingLarge } = reducer(buildState({ loadingLarge: false }), { type: largeAction.toString() });
      expect(loadingLarge).toEqual(true);
    });

    it('returns cancelLoad on GET_DOMAIN_VISITS_CANCEL', () => {
      const { cancelLoad } = reducer(buildState({ cancelLoad: false }), { type: cancelGetDomainVisits.toString() });
      expect(cancelLoad).toEqual(true);
    });

    it('stops loading and returns error on GET_DOMAIN_VISITS_ERROR', () => {
      const state = reducer(buildState({ loading: true, error: false }), { type: getDomainVisits.rejected.toString() });
      const { loading, error } = state;

      expect(loading).toEqual(false);
      expect(error).toEqual(true);
    });

    it('return visits on GET_DOMAIN_VISITS', () => {
      const actionVisits = [{}, {}];
      const { loading, error, visits } = reducer(buildState({ loading: true, error: false }), {
        type: getDomainVisits.fulfilled.toString(),
        payload: { visits: actionVisits },
      });

      expect(loading).toEqual(false);
      expect(error).toEqual(false);
      expect(visits).toEqual(actionVisits);
    });

    it.each([
      [{ domain: 'foo.com' }, 'foo.com', visitsMocks.length + 1],
      [{ domain: 'bar.com' }, 'foo.com', visitsMocks.length],
      [Mock.of<DomainVisits>({ domain: 'foo.com' }), 'foo.com', visitsMocks.length + 1],
      [Mock.of<DomainVisits>({ domain: DEFAULT_DOMAIN }), null, visitsMocks.length + 1],
      [
        Mock.of<DomainVisits>({
          domain: 'foo.com',
          query: { endDate: formatIsoDate(subDays(now, 1)) ?? undefined },
        }),
        'foo.com',
        visitsMocks.length,
      ],
      [
        Mock.of<DomainVisits>({
          domain: 'foo.com',
          query: { startDate: formatIsoDate(addDays(now, 1)) ?? undefined },
        }),
        'foo.com',
        visitsMocks.length,
      ],
      [
        Mock.of<DomainVisits>({
          domain: 'foo.com',
          query: {
            startDate: formatIsoDate(subDays(now, 5)) ?? undefined,
            endDate: formatIsoDate(subDays(now, 2)) ?? undefined,
          },
        }),
        'foo.com',
        visitsMocks.length,
      ],
      [
        Mock.of<DomainVisits>({
          domain: 'foo.com',
          query: {
            startDate: formatIsoDate(subDays(now, 5)) ?? undefined,
            endDate: formatIsoDate(addDays(now, 3)) ?? undefined,
          },
        }),
        'foo.com',
        visitsMocks.length + 1,
      ],
      [
        Mock.of<DomainVisits>({
          domain: 'bar.com',
          query: {
            startDate: formatIsoDate(subDays(now, 5)) ?? undefined,
            endDate: formatIsoDate(addDays(now, 3)) ?? undefined,
          },
        }),
        'foo.com',
        visitsMocks.length,
      ],
    ])('prepends new visits on CREATE_VISIT', (state, shortUrlDomain, expectedVisits) => {
      const shortUrl = Mock.of<ShortUrl>({ domain: shortUrlDomain });
      const { visits } = reducer(buildState({ ...state, visits: visitsMocks }), {
        type: createNewVisits.toString(),
        payload: { createdVisits: [{ shortUrl, visit: { date: formatIsoDate(now) ?? undefined } }] },
      });

      expect(visits).toHaveLength(expectedVisits);
    });

    it('returns new progress on GET_DOMAIN_VISITS_PROGRESS_CHANGED', () => {
      const state = reducer(undefined, { type: progressChangedAction.toString(), payload: 85 });

      expect(state).toEqual(expect.objectContaining({ progress: 85 }));
    });

    it('returns fallbackInterval on GET_DOMAIN_VISITS_FALLBACK_TO_INTERVAL', () => {
      const fallbackInterval: DateInterval = 'last30Days';
      const state = reducer(
        undefined,
        { type: fallbackToIntervalAction.toString(), payload: fallbackInterval },
      );

      expect(state).toEqual(expect.objectContaining({ fallbackInterval }));
    });
  });

  describe('getDomainVisits', () => {
    const dispatchMock = jest.fn();
    const getState = () => Mock.of<ShlinkState>({
      domainVisits: { cancelLoad: false },
    });
    const domain = 'foo.com';

    it('dispatches start and error when promise is rejected', async () => {
      getDomainVisitsCall.mockRejectedValue(new Error());

      await getDomainVisits({ domain })(dispatchMock, getState, {});

      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenNthCalledWith(1, expect.objectContaining({
        type: getDomainVisits.pending.toString(),
      }));
      expect(dispatchMock).toHaveBeenNthCalledWith(2, expect.objectContaining({
        type: getDomainVisits.rejected.toString(),
      }));
      expect(getDomainVisitsCall).toHaveBeenCalledTimes(1);
    });

    it.each([
      [undefined],
      [{}],
    ])('dispatches start and success when promise is resolved', async (query) => {
      const visits = visitsMocks;
      getDomainVisitsCall.mockResolvedValue({
        data: visitsMocks,
        pagination: {
          currentPage: 1,
          pagesCount: 1,
          totalItems: 1,
        },
      });

      await getDomainVisits({ domain, query })(dispatchMock, getState, {});

      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenNthCalledWith(1, expect.objectContaining({
        type: getDomainVisits.pending.toString(),
      }));
      expect(dispatchMock).toHaveBeenNthCalledWith(2, expect.objectContaining({
        type: getDomainVisits.fulfilled.toString(),
        payload: { visits, domain, query: query ?? {} },
      }));
      expect(getDomainVisitsCall).toHaveBeenCalledTimes(1);
    });

    it.each([
      [
        [Mock.of<Visit>({ date: formatISO(subDays(new Date(), 20)) })],
        { type: fallbackToIntervalAction.toString(), payload: 'last30Days' },
        3,
      ],
      [
        [Mock.of<Visit>({ date: formatISO(subDays(new Date(), 100)) })],
        { type: fallbackToIntervalAction.toString(), payload: 'last180Days' },
        3,
      ],
      [[], expect.objectContaining({ type: getDomainVisits.fulfilled.toString() }), 2],
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
      getDomainVisitsCall
        .mockResolvedValueOnce(buildVisitsResult())
        .mockResolvedValueOnce(buildVisitsResult(lastVisits));

      await getDomainVisits({ domain, doIntervalFallback: true })(dispatchMock, getState, {});

      expect(dispatchMock).toHaveBeenCalledTimes(expectedDispatchCalls);
      expect(dispatchMock).toHaveBeenNthCalledWith(1, expect.objectContaining({
        type: getDomainVisits.pending.toString(),
      }));
      expect(dispatchMock).toHaveBeenNthCalledWith(2, expectedSecondDispatch);
      expect(getDomainVisitsCall).toHaveBeenCalledTimes(2);
    });
  });

  describe('cancelGetDomainVisits', () => {
    it('just returns the action with proper type', () =>
      expect(cancelGetDomainVisits()).toEqual(expect.objectContaining({ type: cancelGetDomainVisits.toString() })));
  });
});
