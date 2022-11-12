import { Mock } from 'ts-mockery';
import { addDays, formatISO, subDays } from 'date-fns';
import reducer, {
  getDomainVisits,
  cancelGetDomainVisits,
  GET_DOMAIN_VISITS_START,
  GET_DOMAIN_VISITS_ERROR,
  GET_DOMAIN_VISITS,
  GET_DOMAIN_VISITS_LARGE,
  GET_DOMAIN_VISITS_CANCEL,
  GET_DOMAIN_VISITS_PROGRESS_CHANGED,
  GET_DOMAIN_VISITS_FALLBACK_TO_INTERVAL,
  DomainVisits,
  DEFAULT_DOMAIN,
} from '../../../src/visits/reducers/domainVisits';
import { rangeOf } from '../../../src/utils/utils';
import { Visit } from '../../../src/visits/types';
import { ShlinkVisits } from '../../../src/api/types';
import { ShlinkApiClient } from '../../../src/api/services/ShlinkApiClient';
import { ShlinkState } from '../../../src/container/types';
import { formatIsoDate } from '../../../src/utils/helpers/date';
import { DateInterval } from '../../../src/utils/dates/types';
import { ShortUrl } from '../../../src/short-urls/data';
import { createNewVisits } from '../../../src/visits/reducers/visitCreation';

describe('domainVisitsReducer', () => {
  const now = new Date();
  const visitsMocks = rangeOf(2, () => Mock.all<Visit>());

  describe('reducer', () => {
    const buildState = (data: Partial<DomainVisits>) => Mock.of<DomainVisits>(data);

    it('returns loading on GET_DOMAIN_VISITS_START', () => {
      const state = reducer(buildState({ loading: false }), { type: GET_DOMAIN_VISITS_START } as any);
      const { loading } = state;

      expect(loading).toEqual(true);
    });

    it('returns loadingLarge on GET_DOMAIN_VISITS_LARGE', () => {
      const state = reducer(buildState({ loadingLarge: false }), { type: GET_DOMAIN_VISITS_LARGE } as any);
      const { loadingLarge } = state;

      expect(loadingLarge).toEqual(true);
    });

    it('returns cancelLoad on GET_DOMAIN_VISITS_CANCEL', () => {
      const state = reducer(buildState({ cancelLoad: false }), { type: GET_DOMAIN_VISITS_CANCEL } as any);
      const { cancelLoad } = state;

      expect(cancelLoad).toEqual(true);
    });

    it('stops loading and returns error on GET_DOMAIN_VISITS_ERROR', () => {
      const state = reducer(buildState({ loading: true, error: false }), { type: GET_DOMAIN_VISITS_ERROR } as any);
      const { loading, error } = state;

      expect(loading).toEqual(false);
      expect(error).toEqual(true);
    });

    it('return visits on GET_DOMAIN_VISITS', () => {
      const actionVisits = [{}, {}];
      const state = reducer(
        buildState({ loading: true, error: false }),
        { type: GET_DOMAIN_VISITS, visits: actionVisits } as any,
      );
      const { loading, error, visits } = state;

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
      const prevState = buildState({
        ...state,
        visits: visitsMocks,
      });

      const { visits } = reducer(prevState, {
        type: createNewVisits.toString(),
        payload: { createdVisits: [{ shortUrl, visit: { date: formatIsoDate(now) ?? undefined } }] },
      } as any);

      expect(visits).toHaveLength(expectedVisits);
    });

    it('returns new progress on GET_DOMAIN_VISITS_PROGRESS_CHANGED', () => {
      const state = reducer(undefined, { type: GET_DOMAIN_VISITS_PROGRESS_CHANGED, payload: 85 } as any);

      expect(state).toEqual(expect.objectContaining({ progress: 85 }));
    });

    it('returns fallbackInterval on GET_DOMAIN_VISITS_FALLBACK_TO_INTERVAL', () => {
      const fallbackInterval: DateInterval = 'last30Days';
      const state = reducer(
        undefined,
        { type: GET_DOMAIN_VISITS_FALLBACK_TO_INTERVAL, payload: fallbackInterval } as any,
      );

      expect(state).toEqual(expect.objectContaining({ fallbackInterval }));
    });
  });

  describe('getDomainVisits', () => {
    type GetVisitsReturn = Promise<ShlinkVisits> | ((shortCode: string, query: any) => Promise<ShlinkVisits>);

    const buildApiClientMock = (returned: GetVisitsReturn) => Mock.of<ShlinkApiClient>({
      getDomainVisits: jest.fn(typeof returned === 'function' ? returned : async () => returned),
    });
    const dispatchMock = jest.fn();
    const getState = () => Mock.of<ShlinkState>({
      domainVisits: { cancelLoad: false },
    });
    const domain = 'foo.com';

    beforeEach(jest.clearAllMocks);

    it('dispatches start and error when promise is rejected', async () => {
      const shlinkApiClient = buildApiClientMock(Promise.reject(new Error()));

      await getDomainVisits(() => shlinkApiClient)({ domain })(dispatchMock, getState);

      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenNthCalledWith(1, { type: GET_DOMAIN_VISITS_START });
      expect(dispatchMock).toHaveBeenNthCalledWith(2, { type: GET_DOMAIN_VISITS_ERROR });
      expect(shlinkApiClient.getDomainVisits).toHaveBeenCalledTimes(1);
    });

    it.each([
      [undefined],
      [{}],
    ])('dispatches start and success when promise is resolved', async (query) => {
      const visits = visitsMocks;
      const shlinkApiClient = buildApiClientMock(Promise.resolve({
        data: visitsMocks,
        pagination: {
          currentPage: 1,
          pagesCount: 1,
          totalItems: 1,
        },
      }));

      await getDomainVisits(() => shlinkApiClient)({ domain, query })(dispatchMock, getState);

      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenNthCalledWith(1, { type: GET_DOMAIN_VISITS_START });
      expect(dispatchMock).toHaveBeenNthCalledWith(2, { type: GET_DOMAIN_VISITS, visits, domain, query: query ?? {} });
      expect(shlinkApiClient.getDomainVisits).toHaveBeenCalledTimes(1);
    });

    it.each([
      [
        [Mock.of<Visit>({ date: formatISO(subDays(new Date(), 20)) })],
        { type: GET_DOMAIN_VISITS_FALLBACK_TO_INTERVAL, payload: 'last30Days' },
      ],
      [
        [Mock.of<Visit>({ date: formatISO(subDays(new Date(), 100)) })],
        { type: GET_DOMAIN_VISITS_FALLBACK_TO_INTERVAL, payload: 'last180Days' },
      ],
      [[], expect.objectContaining({ type: GET_DOMAIN_VISITS })],
    ])('dispatches fallback interval when the list of visits is empty', async (lastVisits, expectedSecondDispatch) => {
      const buildVisitsResult = (data: Visit[] = []): ShlinkVisits => ({
        data,
        pagination: {
          currentPage: 1,
          pagesCount: 1,
          totalItems: 1,
        },
      });
      const getShlinkDomainVisits = jest.fn()
        .mockResolvedValueOnce(buildVisitsResult())
        .mockResolvedValueOnce(buildVisitsResult(lastVisits));
      const ShlinkApiClient = Mock.of<ShlinkApiClient>({ getDomainVisits: getShlinkDomainVisits });

      await getDomainVisits(() => ShlinkApiClient)({ domain, doIntervalFallback: true })(dispatchMock, getState);

      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenNthCalledWith(1, { type: GET_DOMAIN_VISITS_START });
      expect(dispatchMock).toHaveBeenNthCalledWith(2, expectedSecondDispatch);
      expect(getShlinkDomainVisits).toHaveBeenCalledTimes(2);
    });
  });

  describe('cancelGetDomainVisits', () => {
    it('just returns the action with proper type', () =>
      expect(cancelGetDomainVisits()).toEqual({ type: GET_DOMAIN_VISITS_CANCEL }));
  });
});
