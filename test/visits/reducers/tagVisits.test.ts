import { fromPartial } from '@total-typescript/shoehorn';
import { addDays, formatISO, subDays } from 'date-fns';
import type { ShlinkApiClient } from '../../../src/api/services/ShlinkApiClient';
import type { ShlinkVisits } from '../../../src/api/types';
import type { ShlinkState } from '../../../src/container/types';
import type {
  TagVisits } from '../../../src/shlink-web-component/visits/reducers/tagVisits';
import {
  getTagVisits as getTagVisitsCreator,
  tagVisitsReducerCreator,
} from '../../../src/shlink-web-component/visits/reducers/tagVisits';
import { createNewVisits } from '../../../src/shlink-web-component/visits/reducers/visitCreation';
import type { Visit } from '../../../src/shlink-web-component/visits/types';
import { formatIsoDate } from '../../../src/utils/helpers/date';
import type { DateInterval } from '../../../src/utils/helpers/dateIntervals';
import { rangeOf } from '../../../src/utils/utils';

describe('tagVisitsReducer', () => {
  const now = new Date();
  const visitsMocks = rangeOf(2, () => fromPartial<Visit>({}));
  const getTagVisitsCall = vi.fn();
  const buildShlinkApiClientMock = () => fromPartial<ShlinkApiClient>({ getTagVisits: getTagVisitsCall });
  const getTagVisits = getTagVisitsCreator(buildShlinkApiClientMock);
  const { reducer, cancelGetVisits: cancelGetTagVisits } = tagVisitsReducerCreator(getTagVisits);

  describe('reducer', () => {
    const buildState = (data: Partial<TagVisits>) => fromPartial<TagVisits>(data);

    it('returns loading on GET_TAG_VISITS_START', () => {
      const { loading } = reducer(buildState({ loading: false }), getTagVisits.pending('', { tag: '' }));
      expect(loading).toEqual(true);
    });

    it('returns loadingLarge on GET_TAG_VISITS_LARGE', () => {
      const { loadingLarge } = reducer(buildState({ loadingLarge: false }), getTagVisits.large());
      expect(loadingLarge).toEqual(true);
    });

    it('returns cancelLoad on GET_TAG_VISITS_CANCEL', () => {
      const { cancelLoad } = reducer(buildState({ cancelLoad: false }), cancelGetTagVisits());
      expect(cancelLoad).toEqual(true);
    });

    it('stops loading and returns error on GET_TAG_VISITS_ERROR', () => {
      const { loading, error } = reducer(
        buildState({ loading: true, error: false }),
        getTagVisits.rejected(null, '', { tag: '' }),
      );

      expect(loading).toEqual(false);
      expect(error).toEqual(true);
    });

    it('return visits on GET_TAG_VISITS', () => {
      const actionVisits: Visit[] = [fromPartial({}), fromPartial({})];
      const { loading, error, visits } = reducer(
        buildState({ loading: true, error: false }),
        getTagVisits.fulfilled({ visits: actionVisits }, '', { tag: '' }),
      );

      expect(loading).toEqual(false);
      expect(error).toEqual(false);
      expect(visits).toEqual(actionVisits);
    });

    it.each([
      [{ tag: 'foo' }, visitsMocks.length + 1],
      [{ tag: 'bar' }, visitsMocks.length],
      [
        fromPartial<TagVisits>({
          tag: 'foo',
          query: { endDate: formatIsoDate(subDays(now, 1)) ?? undefined },
        }),
        visitsMocks.length,
      ],
      [
        fromPartial<TagVisits>({
          tag: 'foo',
          query: { startDate: formatIsoDate(addDays(now, 1)) ?? undefined },
        }),
        visitsMocks.length,
      ],
      [
        fromPartial<TagVisits>({
          tag: 'foo',
          query: {
            startDate: formatIsoDate(subDays(now, 5)) ?? undefined,
            endDate: formatIsoDate(subDays(now, 2)) ?? undefined,
          },
        }),
        visitsMocks.length,
      ],
      [
        fromPartial<TagVisits>({
          tag: 'foo',
          query: {
            startDate: formatIsoDate(subDays(now, 5)) ?? undefined,
            endDate: formatIsoDate(addDays(now, 3)) ?? undefined,
          },
        }),
        visitsMocks.length + 1,
      ],
      [
        fromPartial<TagVisits>({
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

      const { visits } = reducer(
        prevState,
        createNewVisits([fromPartial({ shortUrl, visit: { date: formatIsoDate(now) ?? undefined } })]),
      );

      expect(visits).toHaveLength(expectedVisits);
    });

    it('returns new progress on GET_TAG_VISITS_PROGRESS_CHANGED', () => {
      const { progress } = reducer(undefined, getTagVisits.progressChanged(85));
      expect(progress).toEqual(85);
    });

    it('returns fallbackInterval on GET_TAG_VISITS_FALLBACK_TO_INTERVAL', () => {
      const fallbackInterval: DateInterval = 'last30Days';
      const state = reducer(undefined, getTagVisits.fallbackToInterval(fallbackInterval));

      expect(state).toEqual(expect.objectContaining({ fallbackInterval }));
    });
  });

  describe('getTagVisits', () => {
    const dispatchMock = vi.fn();
    const getState = () => fromPartial<ShlinkState>({
      tagVisits: { cancelLoad: false },
    });
    const tag = 'foo';

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
      expect(dispatchMock).toHaveBeenLastCalledWith(expect.objectContaining({
        payload: { visits, tag, query: query ?? {} },
      }));
      expect(getTagVisitsCall).toHaveBeenCalledTimes(1);
    });

    it.each([
      [
        [fromPartial<Visit>({ date: formatISO(subDays(now, 20)) })],
        getTagVisits.fallbackToInterval('last30Days'),
        3,
      ],
      [
        [fromPartial<Visit>({ date: formatISO(subDays(now, 100)) })],
        getTagVisits.fallbackToInterval('last180Days'),
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
      expect(dispatchMock).toHaveBeenNthCalledWith(2, expectedSecondDispatch);
      expect(getTagVisitsCall).toHaveBeenCalledTimes(2);
    });
  });
});
