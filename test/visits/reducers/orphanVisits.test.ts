import { Mock } from 'ts-mockery';
import { addDays, formatISO, subDays } from 'date-fns';
import reducer, {
  getOrphanVisits,
  cancelGetOrphanVisits,
  GET_ORPHAN_VISITS_START,
  GET_ORPHAN_VISITS_ERROR,
  GET_ORPHAN_VISITS,
  GET_ORPHAN_VISITS_LARGE,
  GET_ORPHAN_VISITS_CANCEL,
  GET_ORPHAN_VISITS_PROGRESS_CHANGED,
  GET_ORPHAN_VISITS_FALLBACK_TO_INTERVAL,
} from '../../../src/visits/reducers/orphanVisits';
import { CREATE_VISITS } from '../../../src/visits/reducers/visitCreation';
import { rangeOf } from '../../../src/utils/utils';
import { Visit, VisitsInfo } from '../../../src/visits/types';
import { ShlinkVisits } from '../../../src/api/types';
import ShlinkApiClient from '../../../src/api/services/ShlinkApiClient';
import { ShlinkState } from '../../../src/container/types';
import { formatIsoDate } from '../../../src/utils/helpers/date';
import { DateInterval } from '../../../src/utils/dates/types';

describe('orphanVisitsReducer', () => {
  const now = new Date();
  const visitsMocks = rangeOf(2, () => Mock.all<Visit>());

  describe('reducer', () => {
    const buildState = (data: Partial<VisitsInfo>) => Mock.of<VisitsInfo>(data);

    it('returns loading on GET_ORPHAN_VISITS_START', () => {
      const state = reducer(buildState({ loading: false }), { type: GET_ORPHAN_VISITS_START } as any);
      const { loading } = state;

      expect(loading).toEqual(true);
    });

    it('returns loadingLarge on GET_ORPHAN_VISITS_LARGE', () => {
      const state = reducer(buildState({ loadingLarge: false }), { type: GET_ORPHAN_VISITS_LARGE } as any);
      const { loadingLarge } = state;

      expect(loadingLarge).toEqual(true);
    });

    it('returns cancelLoad on GET_ORPHAN_VISITS_CANCEL', () => {
      const state = reducer(buildState({ cancelLoad: false }), { type: GET_ORPHAN_VISITS_CANCEL } as any);
      const { cancelLoad } = state;

      expect(cancelLoad).toEqual(true);
    });

    it('stops loading and returns error on GET_ORPHAN_VISITS_ERROR', () => {
      const state = reducer(buildState({ loading: true, error: false }), { type: GET_ORPHAN_VISITS_ERROR } as any);
      const { loading, error } = state;

      expect(loading).toEqual(false);
      expect(error).toEqual(true);
    });

    it('return visits on GET_ORPHAN_VISITS', () => {
      const actionVisits = [{}, {}];
      const state = reducer(
        buildState({ loading: true, error: false }),
        { type: GET_ORPHAN_VISITS, visits: actionVisits } as any,
      );
      const { loading, error, visits } = state;

      expect(loading).toEqual(false);
      expect(error).toEqual(false);
      expect(visits).toEqual(actionVisits);
    });

    it.each([
      [{}, visitsMocks.length + 2],
      [
        Mock.of<VisitsInfo>({
          query: { endDate: formatIsoDate(subDays(now, 1)) ?? undefined },
        }),
        visitsMocks.length,
      ],
      [
        Mock.of<VisitsInfo>({
          query: { startDate: formatIsoDate(addDays(now, 1)) ?? undefined },
        }),
        visitsMocks.length,
      ],
      [
        Mock.of<VisitsInfo>({
          query: {
            startDate: formatIsoDate(subDays(now, 5)) ?? undefined,
            endDate: formatIsoDate(subDays(now, 2)) ?? undefined,
          },
        }),
        visitsMocks.length,
      ],
      [
        Mock.of<VisitsInfo>({
          query: {
            startDate: formatIsoDate(subDays(now, 5)) ?? undefined,
            endDate: formatIsoDate(addDays(now, 3)) ?? undefined,
          },
        }),
        visitsMocks.length + 2,
      ],
    ])('prepends new visits on CREATE_VISIT', (state, expectedVisits) => {
      const prevState = buildState({ ...state, visits: visitsMocks });
      const visit = Mock.of<Visit>({ date: formatIsoDate(now) ?? undefined });

      const { visits } = reducer(
        prevState,
        { type: CREATE_VISITS, createdVisits: [{ visit }, { visit }] } as any,
      );

      expect(visits).toHaveLength(expectedVisits);
    });

    it('returns new progress on GET_ORPHAN_VISITS_PROGRESS_CHANGED', () => {
      const state = reducer(undefined, { type: GET_ORPHAN_VISITS_PROGRESS_CHANGED, progress: 85 } as any);

      expect(state).toEqual(expect.objectContaining({ progress: 85 }));
    });

    it('returns fallbackInterval on GET_ORPHAN_VISITS_FALLBACK_TO_INTERVAL', () => {
      const fallbackInterval: DateInterval = 'last30Days';
      const state = reducer(undefined, { type: GET_ORPHAN_VISITS_FALLBACK_TO_INTERVAL, fallbackInterval } as any);

      expect(state).toEqual(expect.objectContaining({ fallbackInterval }));
    });
  });

  describe('getOrphanVisits', () => {
    type GetVisitsReturn = Promise<ShlinkVisits> | ((query: any) => Promise<ShlinkVisits>);

    const buildApiClientMock = (returned: GetVisitsReturn) => Mock.of<ShlinkApiClient>({
      getOrphanVisits: jest.fn(typeof returned === 'function' ? returned : async () => returned),
    });
    const dispatchMock = jest.fn();
    const getState = () => Mock.of<ShlinkState>({
      orphanVisits: { cancelLoad: false },
    });

    beforeEach(jest.resetAllMocks);

    it('dispatches start and error when promise is rejected', async () => {
      const ShlinkApiClient = buildApiClientMock(Promise.reject({}));

      await getOrphanVisits(() => ShlinkApiClient)()(dispatchMock, getState);

      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenNthCalledWith(1, { type: GET_ORPHAN_VISITS_START });
      expect(dispatchMock).toHaveBeenNthCalledWith(2, { type: GET_ORPHAN_VISITS_ERROR });
      expect(ShlinkApiClient.getOrphanVisits).toHaveBeenCalledTimes(1);
    });

    it.each([
      [undefined],
      [{}],
    ])('dispatches start and success when promise is resolved', async (query) => {
      const visits = visitsMocks.map((visit) => ({ ...visit, visitedUrl: '' }));
      const ShlinkApiClient = buildApiClientMock(Promise.resolve({
        data: visits,
        pagination: {
          currentPage: 1,
          pagesCount: 1,
          totalItems: 1,
        },
      }));

      await getOrphanVisits(() => ShlinkApiClient)(query)(dispatchMock, getState);

      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenNthCalledWith(1, { type: GET_ORPHAN_VISITS_START });
      expect(dispatchMock).toHaveBeenNthCalledWith(2, { type: GET_ORPHAN_VISITS, visits, query: query ?? {} });
      expect(ShlinkApiClient.getOrphanVisits).toHaveBeenCalledTimes(1);
    });

    it.each([
      [
        [Mock.of<Visit>({ date: formatISO(subDays(new Date(), 5)) })],
        { type: GET_ORPHAN_VISITS_FALLBACK_TO_INTERVAL, fallbackInterval: 'last7Days' },
      ],
      [
        [Mock.of<Visit>({ date: formatISO(subDays(new Date(), 200)) })],
        { type: GET_ORPHAN_VISITS_FALLBACK_TO_INTERVAL, fallbackInterval: 'last365Days' },
      ],
      [[], expect.objectContaining({ type: GET_ORPHAN_VISITS })],
    ])('dispatches fallback interval when the list of visits is empty', async (lastVisits, expectedSecondDispatch) => {
      const buildVisitsResult = (data: Visit[] = []): ShlinkVisits => ({
        data,
        pagination: {
          currentPage: 1,
          pagesCount: 1,
          totalItems: 1,
        },
      });
      const getShlinkOrphanVisits = jest.fn()
        .mockResolvedValueOnce(buildVisitsResult())
        .mockResolvedValueOnce(buildVisitsResult(lastVisits));
      const ShlinkApiClient = Mock.of<ShlinkApiClient>({ getOrphanVisits: getShlinkOrphanVisits });

      await getOrphanVisits(() => ShlinkApiClient)({}, undefined, true)(dispatchMock, getState);

      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenNthCalledWith(1, { type: GET_ORPHAN_VISITS_START });
      expect(dispatchMock).toHaveBeenNthCalledWith(2, expectedSecondDispatch);
      expect(getShlinkOrphanVisits).toHaveBeenCalledTimes(2);
    });
  });

  describe('cancelGetOrphanVisits', () => {
    it('just returns the action with proper type', () =>
      expect(cancelGetOrphanVisits()).toEqual({ type: GET_ORPHAN_VISITS_CANCEL }));
  });
});
