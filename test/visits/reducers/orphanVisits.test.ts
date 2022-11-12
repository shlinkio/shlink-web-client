import { Mock } from 'ts-mockery';
import { addDays, formatISO, subDays } from 'date-fns';
import {
  getOrphanVisits as getOrphanVisitsCreator,
  orphanVisitsReducerCreator,
} from '../../../src/visits/reducers/orphanVisits';
import { rangeOf } from '../../../src/utils/utils';
import { Visit } from '../../../src/visits/types';
import { ShlinkVisits } from '../../../src/api/types';
import { ShlinkApiClient } from '../../../src/api/services/ShlinkApiClient';
import { ShlinkState } from '../../../src/container/types';
import { formatIsoDate } from '../../../src/utils/helpers/date';
import { DateInterval } from '../../../src/utils/dates/types';
import { createNewVisits } from '../../../src/visits/reducers/visitCreation';
import { VisitsInfo } from '../../../src/visits/reducers/types';

describe('orphanVisitsReducer', () => {
  const now = new Date();
  const visitsMocks = rangeOf(2, () => Mock.all<Visit>());
  const getOrphanVisitsCall = jest.fn();
  const buildShlinkApiClientMock = () => Mock.of<ShlinkApiClient>({ getOrphanVisits: getOrphanVisitsCall });
  const creator = getOrphanVisitsCreator(buildShlinkApiClientMock);
  const { asyncThunk: getOrphanVisits, largeAction, progressChangedAction, fallbackToIntervalAction } = creator;
  const { reducer, cancelGetVisits: cancelGetOrphanVisits } = orphanVisitsReducerCreator(creator);

  beforeEach(jest.clearAllMocks);

  describe('reducer', () => {
    const buildState = (data: Partial<VisitsInfo>) => Mock.of<VisitsInfo>(data);

    it('returns loading on GET_ORPHAN_VISITS_START', () => {
      const { loading } = reducer(buildState({ loading: false }), { type: getOrphanVisits.pending.toString() });
      expect(loading).toEqual(true);
    });

    it('returns loadingLarge on GET_ORPHAN_VISITS_LARGE', () => {
      const { loadingLarge } = reducer(buildState({ loadingLarge: false }), { type: largeAction.toString() });
      expect(loadingLarge).toEqual(true);
    });

    it('returns cancelLoad on GET_ORPHAN_VISITS_CANCEL', () => {
      const { cancelLoad } = reducer(buildState({ cancelLoad: false }), { type: cancelGetOrphanVisits.toString() });
      expect(cancelLoad).toEqual(true);
    });

    it('stops loading and returns error on GET_ORPHAN_VISITS_ERROR', () => {
      const { loading, error } = reducer(
        buildState({ loading: true, error: false }),
        { type: getOrphanVisits.rejected.toString() },
      );

      expect(loading).toEqual(false);
      expect(error).toEqual(true);
    });

    it('return visits on GET_ORPHAN_VISITS', () => {
      const actionVisits = [{}, {}];
      const { loading, error, visits } = reducer(buildState({ loading: true, error: false }), {
        type: getOrphanVisits.fulfilled.toString(),
        payload: { visits: actionVisits },
      });

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

      const { visits } = reducer(prevState, {
        type: createNewVisits.toString(),
        payload: { createdVisits: [{ visit }, { visit }] },
      });

      expect(visits).toHaveLength(expectedVisits);
    });

    it('returns new progress on GET_ORPHAN_VISITS_PROGRESS_CHANGED', () => {
      const state = reducer(undefined, { type: progressChangedAction.toString(), payload: 85 });
      expect(state).toEqual(expect.objectContaining({ progress: 85 }));
    });

    it('returns fallbackInterval on GET_ORPHAN_VISITS_FALLBACK_TO_INTERVAL', () => {
      const fallbackInterval: DateInterval = 'last30Days';
      const state = reducer(
        undefined,
        { type: fallbackToIntervalAction.toString(), payload: fallbackInterval },
      );

      expect(state).toEqual(expect.objectContaining({ fallbackInterval }));
    });
  });

  describe('getOrphanVisits', () => {
    const dispatchMock = jest.fn();
    const getState = () => Mock.of<ShlinkState>({
      orphanVisits: { cancelLoad: false },
    });

    it('dispatches start and error when promise is rejected', async () => {
      getOrphanVisitsCall.mockRejectedValue({});

      await getOrphanVisits({})(dispatchMock, getState, {});

      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenNthCalledWith(1, expect.objectContaining({
        type: getOrphanVisits.pending.toString(),
      }));
      expect(dispatchMock).toHaveBeenNthCalledWith(2, expect.objectContaining({
        type: getOrphanVisits.rejected.toString(),
      }));
      expect(getOrphanVisitsCall).toHaveBeenCalledTimes(1);
    });

    it.each([
      [undefined],
      [{}],
    ])('dispatches start and success when promise is resolved', async (query) => {
      const visits = visitsMocks.map((visit) => ({ ...visit, visitedUrl: '' }));
      getOrphanVisitsCall.mockResolvedValue({
        data: visits,
        pagination: {
          currentPage: 1,
          pagesCount: 1,
          totalItems: 1,
        },
      });

      await getOrphanVisits({ query })(dispatchMock, getState, {});

      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenNthCalledWith(1, expect.objectContaining({
        type: getOrphanVisits.pending.toString(),
      }));
      expect(dispatchMock).toHaveBeenNthCalledWith(2, expect.objectContaining({
        type: getOrphanVisits.fulfilled.toString(),
        payload: { visits, query: query ?? {} },
      }));
      expect(getOrphanVisitsCall).toHaveBeenCalledTimes(1);
    });

    it.each([
      [
        [Mock.of<Visit>({ date: formatISO(subDays(new Date(), 5)) })],
        { type: fallbackToIntervalAction.toString(), payload: 'last7Days' },
        3,
      ],
      [
        [Mock.of<Visit>({ date: formatISO(subDays(new Date(), 200)) })],
        { type: fallbackToIntervalAction.toString(), payload: 'last365Days' },
        3,
      ],
      [[], expect.objectContaining({ type: getOrphanVisits.fulfilled.toString() }), 2],
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
      getOrphanVisitsCall
        .mockResolvedValueOnce(buildVisitsResult())
        .mockResolvedValueOnce(buildVisitsResult(lastVisits));

      await getOrphanVisits({ doIntervalFallback: true })(dispatchMock, getState, {});

      expect(dispatchMock).toHaveBeenCalledTimes(expectedDispatchCalls);
      expect(dispatchMock).toHaveBeenNthCalledWith(1, expect.objectContaining({
        type: getOrphanVisits.pending.toString(),
      }));
      expect(dispatchMock).toHaveBeenNthCalledWith(2, expectedSecondDispatch);
      expect(getOrphanVisitsCall).toHaveBeenCalledTimes(2);
    });
  });

  describe('cancelGetOrphanVisits', () => {
    it('just returns the action with proper type', () =>
      expect(cancelGetOrphanVisits()).toEqual({ type: cancelGetOrphanVisits.toString() }));
  });
});
