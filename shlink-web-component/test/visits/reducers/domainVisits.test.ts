import { fromPartial } from '@total-typescript/shoehorn';
import { addDays, formatISO, subDays } from 'date-fns';
import type { ShlinkApiClient, ShlinkVisits } from '../../../src/api-contract';
import type { RootState } from '../../../src/container/store';
import type { ShortUrl } from '../../../src/short-urls/data';
import { formatIsoDate } from '../../../src/utils/dates/helpers/date';
import type { DateInterval } from '../../../src/utils/dates/helpers/dateIntervals';
import { rangeOf } from '../../../src/utils/helpers';
import type {
  DomainVisits, LoadDomainVisits,
} from '../../../src/visits/reducers/domainVisits';
import {
  DEFAULT_DOMAIN,
  domainVisitsReducerCreator,
  getDomainVisits as getDomainVisitsCreator,
} from '../../../src/visits/reducers/domainVisits';
import { createNewVisits } from '../../../src/visits/reducers/visitCreation';
import type { Visit } from '../../../src/visits/types';

describe('domainVisitsReducer', () => {
  const now = new Date();
  const visitsMocks = rangeOf(2, () => fromPartial<Visit>({}));
  const getDomainVisitsCall = vi.fn();
  const buildApiClientMock = () => fromPartial<ShlinkApiClient>({ getDomainVisits: getDomainVisitsCall });
  const getDomainVisits = getDomainVisitsCreator(buildApiClientMock);
  const { reducer, cancelGetVisits: cancelGetDomainVisits } = domainVisitsReducerCreator(getDomainVisits);

  describe('reducer', () => {
    const buildState = (data: Partial<DomainVisits>) => fromPartial<DomainVisits>(data);

    it('returns loading on GET_DOMAIN_VISITS_START', () => {
      const { loading } = reducer(
        buildState({ loading: false }),
        getDomainVisits.pending('', fromPartial<LoadDomainVisits>({})),
      );
      expect(loading).toEqual(true);
    });

    it('returns loadingLarge on GET_DOMAIN_VISITS_LARGE', () => {
      const { loadingLarge } = reducer(buildState({ loadingLarge: false }), getDomainVisits.large());
      expect(loadingLarge).toEqual(true);
    });

    it('returns cancelLoad on GET_DOMAIN_VISITS_CANCEL', () => {
      const { cancelLoad } = reducer(buildState({ cancelLoad: false }), cancelGetDomainVisits());
      expect(cancelLoad).toEqual(true);
    });

    it('stops loading and returns error on GET_DOMAIN_VISITS_ERROR', () => {
      const state = reducer(
        buildState({ loading: true, error: false }),
        getDomainVisits.rejected(null, '', fromPartial({})),
      );
      const { loading, error } = state;

      expect(loading).toEqual(false);
      expect(error).toEqual(true);
    });

    it('return visits on GET_DOMAIN_VISITS', () => {
      const actionVisits: Visit[] = [fromPartial({}), fromPartial({})];
      const { loading, error, visits } = reducer(
        buildState({ loading: true, error: false }),
        getDomainVisits.fulfilled({ visits: actionVisits }, '', fromPartial({})),
      );

      expect(loading).toEqual(false);
      expect(error).toEqual(false);
      expect(visits).toEqual(actionVisits);
    });

    it.each([
      [{ domain: 'foo.com' }, 'foo.com', visitsMocks.length + 1],
      [{ domain: 'bar.com' }, 'foo.com', visitsMocks.length],
      [fromPartial<DomainVisits>({ domain: 'foo.com' }), 'foo.com', visitsMocks.length + 1],
      [fromPartial<DomainVisits>({ domain: DEFAULT_DOMAIN }), null, visitsMocks.length + 1],
      [
        fromPartial<DomainVisits>({
          domain: 'foo.com',
          query: { endDate: formatIsoDate(subDays(now, 1)) ?? undefined },
        }),
        'foo.com',
        visitsMocks.length,
      ],
      [
        fromPartial<DomainVisits>({
          domain: 'foo.com',
          query: { startDate: formatIsoDate(addDays(now, 1)) ?? undefined },
        }),
        'foo.com',
        visitsMocks.length,
      ],
      [
        fromPartial<DomainVisits>({
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
        fromPartial<DomainVisits>({
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
        fromPartial<DomainVisits>({
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
      const shortUrl = fromPartial<ShortUrl>({ domain: shortUrlDomain });
      const { visits } = reducer(buildState({ ...state, visits: visitsMocks }), createNewVisits([
        fromPartial({ shortUrl, visit: { date: formatIsoDate(now) ?? undefined } }),
      ]));

      expect(visits).toHaveLength(expectedVisits);
    });

    it('returns new progress on GET_DOMAIN_VISITS_PROGRESS_CHANGED', () => {
      const { progress } = reducer(undefined, getDomainVisits.progressChanged(85));
      expect(progress).toEqual(85);
    });

    it('returns fallbackInterval on GET_DOMAIN_VISITS_FALLBACK_TO_INTERVAL', () => {
      const fallbackInterval: DateInterval = 'last30Days';
      const state = reducer(
        undefined,
        getDomainVisits.fallbackToInterval(fallbackInterval),
      );

      expect(state).toEqual(expect.objectContaining({ fallbackInterval }));
    });
  });

  describe('getDomainVisits', () => {
    const dispatchMock = vi.fn();
    const getState = () => fromPartial<RootState>({
      domainVisits: { cancelLoad: false },
    });
    const domain = 'foo.com';

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
      expect(dispatchMock).toHaveBeenLastCalledWith(expect.objectContaining({
        payload: { visits, domain, query: query ?? {} },
      }));
      expect(getDomainVisitsCall).toHaveBeenCalledTimes(1);
    });

    it.each([
      [
        [fromPartial<Visit>({ date: formatISO(subDays(now, 20)) })],
        getDomainVisits.fallbackToInterval('last30Days'),
        3,
      ],
      [
        [fromPartial<Visit>({ date: formatISO(subDays(now, 100)) })],
        getDomainVisits.fallbackToInterval('last180Days'),
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
      expect(dispatchMock).toHaveBeenNthCalledWith(2, expectedSecondDispatch);
      expect(getDomainVisitsCall).toHaveBeenCalledTimes(2);
    });
  });
});
