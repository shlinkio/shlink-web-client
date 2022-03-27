import { Mock } from 'ts-mockery';
import { addDays, formatISO, subDays } from 'date-fns';
import reducer, {
  getTagVisits,
  cancelGetTagVisits,
  GET_TAG_VISITS_START,
  GET_TAG_VISITS_ERROR,
  GET_TAG_VISITS,
  GET_TAG_VISITS_LARGE,
  GET_TAG_VISITS_CANCEL,
  GET_TAG_VISITS_PROGRESS_CHANGED,
  GET_TAG_VISITS_FALLBACK_TO_INTERVAL,
  TagVisits,
} from '../../../src/visits/reducers/tagVisits';
import { CREATE_VISITS } from '../../../src/visits/reducers/visitCreation';
import { rangeOf } from '../../../src/utils/utils';
import { Visit } from '../../../src/visits/types';
import { ShlinkVisits } from '../../../src/api/types';
import ShlinkApiClient from '../../../src/api/services/ShlinkApiClient';
import { ShlinkState } from '../../../src/container/types';
import { formatIsoDate } from '../../../src/utils/helpers/date';
import { DateInterval } from '../../../src/utils/dates/types';

describe('tagVisitsReducer', () => {
  const now = new Date();
  const visitsMocks = rangeOf(2, () => Mock.all<Visit>());

  describe('reducer', () => {
    const buildState = (data: Partial<TagVisits>) => Mock.of<TagVisits>(data);

    it('returns loading on GET_TAG_VISITS_START', () => {
      const state = reducer(buildState({ loading: false }), { type: GET_TAG_VISITS_START } as any);
      const { loading } = state;

      expect(loading).toEqual(true);
    });

    it('returns loadingLarge on GET_TAG_VISITS_LARGE', () => {
      const state = reducer(buildState({ loadingLarge: false }), { type: GET_TAG_VISITS_LARGE } as any);
      const { loadingLarge } = state;

      expect(loadingLarge).toEqual(true);
    });

    it('returns cancelLoad on GET_TAG_VISITS_CANCEL', () => {
      const state = reducer(buildState({ cancelLoad: false }), { type: GET_TAG_VISITS_CANCEL } as any);
      const { cancelLoad } = state;

      expect(cancelLoad).toEqual(true);
    });

    it('stops loading and returns error on GET_TAG_VISITS_ERROR', () => {
      const state = reducer(buildState({ loading: true, error: false }), { type: GET_TAG_VISITS_ERROR } as any);
      const { loading, error } = state;

      expect(loading).toEqual(false);
      expect(error).toEqual(true);
    });

    it('return visits on GET_TAG_VISITS', () => {
      const actionVisits = [{}, {}];
      const state = reducer(
        buildState({ loading: true, error: false }),
        { type: GET_TAG_VISITS, visits: actionVisits } as any,
      );
      const { loading, error, visits } = state;

      expect(loading).toEqual(false);
      expect(error).toEqual(false);
      expect(visits).toEqual(actionVisits);
    });

    it.each([
      [{ tag: 'foo' }, visitsMocks.length + 1],
      [{ tag: 'bar' }, visitsMocks.length],
      [
        Mock.of<TagVisits>({
          tag: 'foo',
          query: { endDate: formatIsoDate(subDays(now, 1)) ?? undefined },
        }),
        visitsMocks.length,
      ],
      [
        Mock.of<TagVisits>({
          tag: 'foo',
          query: { startDate: formatIsoDate(addDays(now, 1)) ?? undefined },
        }),
        visitsMocks.length,
      ],
      [
        Mock.of<TagVisits>({
          tag: 'foo',
          query: {
            startDate: formatIsoDate(subDays(now, 5)) ?? undefined,
            endDate: formatIsoDate(subDays(now, 2)) ?? undefined,
          },
        }),
        visitsMocks.length,
      ],
      [
        Mock.of<TagVisits>({
          tag: 'foo',
          query: {
            startDate: formatIsoDate(subDays(now, 5)) ?? undefined,
            endDate: formatIsoDate(addDays(now, 3)) ?? undefined,
          },
        }),
        visitsMocks.length + 1,
      ],
      [
        Mock.of<TagVisits>({
          tag: 'bar',
          query: {
            startDate: formatIsoDate(subDays(now, 5)) ?? undefined,
            endDate: formatIsoDate(addDays(now, 3)) ?? undefined,
          },
        }),
        visitsMocks.length,
      ],
    ])('prepends new visits on CREATE_VISIT', (state, expectedVisits) => {
      const shortUrl = {
        tags: ['foo', 'baz'],
      };
      const prevState = buildState({
        ...state,
        visits: visitsMocks,
      });

      const { visits } = reducer(prevState, {
        type: CREATE_VISITS,
        createdVisits: [{ shortUrl, visit: { date: formatIsoDate(now) ?? undefined } }],
      } as any);

      expect(visits).toHaveLength(expectedVisits);
    });

    it('returns new progress on GET_TAG_VISITS_PROGRESS_CHANGED', () => {
      const state = reducer(undefined, { type: GET_TAG_VISITS_PROGRESS_CHANGED, progress: 85 } as any);

      expect(state).toEqual(expect.objectContaining({ progress: 85 }));
    });

    it('returns fallbackInterval on GET_TAG_VISITS_FALLBACK_TO_INTERVAL', () => {
      const fallbackInterval: DateInterval = 'last30Days';
      const state = reducer(undefined, { type: GET_TAG_VISITS_FALLBACK_TO_INTERVAL, fallbackInterval } as any);

      expect(state).toEqual(expect.objectContaining({ fallbackInterval }));
    });
  });

  describe('getTagVisits', () => {
    type GetVisitsReturn = Promise<ShlinkVisits> | ((shortCode: string, query: any) => Promise<ShlinkVisits>);

    const buildApiClientMock = (returned: GetVisitsReturn) => Mock.of<ShlinkApiClient>({
      getTagVisits: jest.fn(typeof returned === 'function' ? returned : async () => returned),
    });
    const dispatchMock = jest.fn();
    const getState = () => Mock.of<ShlinkState>({
      tagVisits: { cancelLoad: false },
    });
    const tag = 'foo';

    beforeEach(jest.clearAllMocks);

    it('dispatches start and error when promise is rejected', async () => {
      const shlinkApiClient = buildApiClientMock(Promise.reject(new Error()));

      await getTagVisits(() => shlinkApiClient)('foo')(dispatchMock, getState);

      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenNthCalledWith(1, { type: GET_TAG_VISITS_START });
      expect(dispatchMock).toHaveBeenNthCalledWith(2, { type: GET_TAG_VISITS_ERROR });
      expect(shlinkApiClient.getTagVisits).toHaveBeenCalledTimes(1);
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

      await getTagVisits(() => shlinkApiClient)(tag, query)(dispatchMock, getState);

      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenNthCalledWith(1, { type: GET_TAG_VISITS_START });
      expect(dispatchMock).toHaveBeenNthCalledWith(2, { type: GET_TAG_VISITS, visits, tag, query: query ?? {} });
      expect(shlinkApiClient.getTagVisits).toHaveBeenCalledTimes(1);
    });

    it.each([
      [
        [Mock.of<Visit>({ date: formatISO(subDays(new Date(), 20)) })],
        { type: GET_TAG_VISITS_FALLBACK_TO_INTERVAL, fallbackInterval: 'last30Days' },
      ],
      [
        [Mock.of<Visit>({ date: formatISO(subDays(new Date(), 100)) })],
        { type: GET_TAG_VISITS_FALLBACK_TO_INTERVAL, fallbackInterval: 'last180Days' },
      ],
      [[], expect.objectContaining({ type: GET_TAG_VISITS })],
    ])('dispatches fallback interval when the list of visits is empty', async (lastVisits, expectedSecondDispatch) => {
      const buildVisitsResult = (data: Visit[] = []): ShlinkVisits => ({
        data,
        pagination: {
          currentPage: 1,
          pagesCount: 1,
          totalItems: 1,
        },
      });
      const getShlinkTagVisits = jest.fn()
        .mockResolvedValueOnce(buildVisitsResult())
        .mockResolvedValueOnce(buildVisitsResult(lastVisits));
      const ShlinkApiClient = Mock.of<ShlinkApiClient>({ getTagVisits: getShlinkTagVisits });

      await getTagVisits(() => ShlinkApiClient)(tag, {}, true)(dispatchMock, getState);

      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenNthCalledWith(1, { type: GET_TAG_VISITS_START });
      expect(dispatchMock).toHaveBeenNthCalledWith(2, expectedSecondDispatch);
      expect(getShlinkTagVisits).toHaveBeenCalledTimes(2);
    });
  });

  describe('cancelGetTagVisits', () => {
    it('just returns the action with proper type', () =>
      expect(cancelGetTagVisits()).toEqual({ type: GET_TAG_VISITS_CANCEL }));
  });
});
