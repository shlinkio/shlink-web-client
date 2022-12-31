import { Mock } from 'ts-mockery';
import { addDays, formatISO, subDays } from 'date-fns';
import {
  getTagVisits as getTagVisitsCreator,
  tagVisitsReducerCreator,
  TagVisits,
} from '../../../src/visits/reducers/tagVisits';
import { rangeOf } from '../../../src/utils/utils';
import { Visit } from '../../../src/visits/types';
import { ShlinkVisits } from '../../../src/api/types';
import { ShlinkApiClient } from '../../../src/api/services/ShlinkApiClient';
import { ShlinkState } from '../../../src/container/types';
import { formatIsoDate } from '../../../src/utils/helpers/date';
import { DateInterval } from '../../../src/utils/helpers/dateIntervals';
import { createNewVisits } from '../../../src/visits/reducers/visitCreation';

describe('tagVisitsReducer', () => {
  const now = new Date();
  const visitsMocks = rangeOf(2, () => Mock.all<Visit>());
  const getTagVisitsCall = jest.fn();
  const buildShlinkApiClientMock = () => Mock.of<ShlinkApiClient>({ getTagVisits: getTagVisitsCall });
  const getTagVisits = getTagVisitsCreator(buildShlinkApiClientMock);
  const { reducer, cancelGetVisits: cancelGetTagVisits } = tagVisitsReducerCreator(getTagVisits);

  beforeEach(jest.clearAllMocks);

  describe('reducer', () => {
    const buildState = (data: Partial<TagVisits>) => Mock.of<TagVisits>(data);

    it('returns loading on GET_TAG_VISITS_START', () => {
      const { loading } = reducer(buildState({ loading: false }), { type: getTagVisits.pending.toString() });
      expect(loading).toEqual(true);
    });

    it('returns loadingLarge on GET_TAG_VISITS_LARGE', () => {
      const { loadingLarge } = reducer(buildState({ loadingLarge: false }), { type: getTagVisits.large.toString() });
      expect(loadingLarge).toEqual(true);
    });

    it('returns cancelLoad on GET_TAG_VISITS_CANCEL', () => {
      const { cancelLoad } = reducer(buildState({ cancelLoad: false }), { type: cancelGetTagVisits.toString() });
      expect(cancelLoad).toEqual(true);
    });

    it('stops loading and returns error on GET_TAG_VISITS_ERROR', () => {
      const { loading, error } = reducer(
        buildState({ loading: true, error: false }),
        { type: getTagVisits.rejected.toString() },
      );

      expect(loading).toEqual(false);
      expect(error).toEqual(true);
    });

    it('return visits on GET_TAG_VISITS', () => {
      const actionVisits = [{}, {}];
      const { loading, error, visits } = reducer(buildState({ loading: true, error: false }), {
        type: getTagVisits.fulfilled.toString(),
        payload: { visits: actionVisits },
      });

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
        type: createNewVisits.toString(),
        payload: { createdVisits: [{ shortUrl, visit: { date: formatIsoDate(now) ?? undefined } }] },
      });

      expect(visits).toHaveLength(expectedVisits);
    });

    it('returns new progress on GET_TAG_VISITS_PROGRESS_CHANGED', () => {
      const state = reducer(undefined, { type: getTagVisits.progressChanged.toString(), payload: 85 });
      expect(state).toEqual(expect.objectContaining({ progress: 85 }));
    });

    it('returns fallbackInterval on GET_TAG_VISITS_FALLBACK_TO_INTERVAL', () => {
      const fallbackInterval: DateInterval = 'last30Days';
      const state = reducer(undefined, { type: getTagVisits.fallbackToInterval.toString(), payload: fallbackInterval });

      expect(state).toEqual(expect.objectContaining({ fallbackInterval }));
    });
  });

  describe('getTagVisits', () => {
    const dispatchMock = jest.fn();
    const getState = () => Mock.of<ShlinkState>({
      tagVisits: { cancelLoad: false },
    });
    const tag = 'foo';

    it('dispatches start and error when promise is rejected', async () => {
      getTagVisitsCall.mockRejectedValue(new Error());

      await getTagVisits({ tag })(dispatchMock, getState, {});

      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenNthCalledWith(1, expect.objectContaining({
        type: getTagVisits.pending.toString(),
      }));
      expect(dispatchMock).toHaveBeenNthCalledWith(2, expect.objectContaining({
        type: getTagVisits.rejected.toString(),
      }));
      expect(getTagVisitsCall).toHaveBeenCalledTimes(1);
    });

    it.each([
      [undefined],
      [{}],
    ])('dispatches start and success when promise is resolved', async (query) => {
      const visits = visitsMocks;
      getTagVisitsCall.mockResolvedValue({
        data: visitsMocks,
        pagination: {
          currentPage: 1,
          pagesCount: 1,
          totalItems: 1,
        },
      });

      await getTagVisits({ tag, query })(dispatchMock, getState, {});

      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenNthCalledWith(1, expect.objectContaining({
        type: getTagVisits.pending.toString(),
      }));
      expect(dispatchMock).toHaveBeenNthCalledWith(2, expect.objectContaining({
        type: getTagVisits.fulfilled.toString(),
        payload: { visits, tag, query: query ?? {} },
      }));
      expect(getTagVisitsCall).toHaveBeenCalledTimes(1);
    });

    it.each([
      [
        [Mock.of<Visit>({ date: formatISO(subDays(now, 20)) })],
        { type: getTagVisits.fallbackToInterval.toString(), payload: 'last30Days' },
        3,
      ],
      [
        [Mock.of<Visit>({ date: formatISO(subDays(now, 100)) })],
        { type: getTagVisits.fallbackToInterval.toString(), payload: 'last180Days' },
        3,
      ],
      [[], expect.objectContaining({ type: getTagVisits.fulfilled.toString() }), 2],
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
      getTagVisitsCall
        .mockResolvedValueOnce(buildVisitsResult())
        .mockResolvedValueOnce(buildVisitsResult(lastVisits));

      await getTagVisits({ tag, doIntervalFallback: true })(dispatchMock, getState, {});

      expect(dispatchMock).toHaveBeenCalledTimes(expectedDispatchCalls);
      expect(dispatchMock).toHaveBeenNthCalledWith(1, expect.objectContaining({
        type: getTagVisits.pending.toString(),
      }));
      expect(dispatchMock).toHaveBeenNthCalledWith(2, expectedSecondDispatch);
      expect(getTagVisitsCall).toHaveBeenCalledTimes(2);
    });
  });

  describe('cancelGetTagVisits', () => {
    it('just returns the action with proper type', () =>
      expect(cancelGetTagVisits()).toEqual({ type: cancelGetTagVisits.toString() }));
  });
});
