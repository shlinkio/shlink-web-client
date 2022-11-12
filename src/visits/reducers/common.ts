import { flatten, prop, range, splitEvery } from 'ramda';
import { createAction, Dispatch } from '@reduxjs/toolkit';
import { ShlinkPaginator, ShlinkVisits, ShlinkVisitsParams } from '../../api/types';
import { Visit } from '../types';
import { parseApiError } from '../../api/utils';
import { ApiErrorAction } from '../../api/types/actions';
import { DateInterval, dateToMatchingInterval } from '../../utils/dates/types';
import { LoadVisits, VisitsLoaded, VisitsLoadProgressChangedAction } from './types';
import { createAsyncThunk } from '../../utils/helpers/redux';
import { ShlinkState } from '../../container/types';

const ITEMS_PER_PAGE = 5000;
const PARALLEL_REQUESTS_COUNT = 4;
const PARALLEL_STARTING_PAGE = 2;

const isLastPage = ({ currentPage, pagesCount }: ShlinkPaginator): boolean => currentPage >= pagesCount;
const calcProgress = (total: number, current: number): number => (current * 100) / total;

type VisitsLoader = (page: number, itemsPerPage: number) => Promise<ShlinkVisits>;
type LastVisitLoader = () => Promise<Visit | undefined>;

interface VisitsAsyncThunkOptions<T extends LoadVisits = LoadVisits, R extends VisitsLoaded = VisitsLoaded> {
  actionsPrefix: string;
  createLoaders: (params: T, getState: () => ShlinkState) => [VisitsLoader, LastVisitLoader];
  getExtraFulfilledPayload: (params: T) => Partial<R>;
  shouldCancel: (getState: () => ShlinkState) => boolean;
}

export const getVisitsWithLoader = async <T extends VisitsLoaded>(
  visitsLoader: VisitsLoader,
  lastVisitLoader: LastVisitLoader,
  extraFulfilledPayload: Partial<T>,
  actionsPrefix: string,
  dispatch: Dispatch,
  shouldCancel: () => boolean,
) => {
  dispatch({ type: `${actionsPrefix}/pending` });

  const loadVisitsInParallel = async (pages: number[]): Promise<Visit[]> =>
    Promise.all(pages.map(async (page) => visitsLoader(page, ITEMS_PER_PAGE).then(prop('data')))).then(flatten);

  const loadPagesBlocks = async (pagesBlocks: number[][], index = 0): Promise<Visit[]> => {
    if (shouldCancel()) {
      return [];
    }

    const data = await loadVisitsInParallel(pagesBlocks[index]);

    dispatch<VisitsLoadProgressChangedAction>({
      type: `${actionsPrefix}/progressChanged`,
      payload: calcProgress(pagesBlocks.length, index + PARALLEL_STARTING_PAGE),
    });

    if (index < pagesBlocks.length - 1) {
      return data.concat(await loadPagesBlocks(pagesBlocks, index + 1));
    }

    return data;
  };

  const loadVisits = async (page = 1) => {
    const { pagination, data } = await visitsLoader(page, ITEMS_PER_PAGE);

    // If pagination was not returned, then this is an old shlink version. Just return data
    if (!pagination || isLastPage(pagination)) {
      return data;
    }

    // If there are more pages, make requests in blocks of 4
    const pagesRange = range(PARALLEL_STARTING_PAGE, pagination.pagesCount + 1);
    const pagesBlocks = splitEvery(PARALLEL_REQUESTS_COUNT, pagesRange);

    if (pagination.pagesCount - 1 > PARALLEL_REQUESTS_COUNT) {
      dispatch({ type: `${actionsPrefix}/large` });
    }

    return data.concat(await loadPagesBlocks(pagesBlocks));
  };

  try {
    const [visits, lastVisit] = await Promise.all([loadVisits(), lastVisitLoader()]);

    dispatch(
      !visits.length && lastVisit
        ? { type: `${actionsPrefix}/fallbackToInterval`, payload: dateToMatchingInterval(lastVisit.date) }
        : { type: `${actionsPrefix}/fulfilled`, payload: { ...extraFulfilledPayload, visits } },
    );
  } catch (e: any) {
    dispatch<ApiErrorAction>({ type: `${actionsPrefix}/rejected`, errorData: parseApiError(e) });
  }
};

export const createVisitsAsyncThunk = <T extends LoadVisits = LoadVisits, R extends VisitsLoaded = VisitsLoaded>(
  { actionsPrefix, createLoaders, getExtraFulfilledPayload, shouldCancel }: VisitsAsyncThunkOptions<T, R>,
) => {
  const progressChangedAction = createAction<number>(`${actionsPrefix}/progressChanged`);
  const largeAction = createAction<void>(`${actionsPrefix}/large`);
  const fallbackToIntervalAction = createAction<DateInterval>(`${actionsPrefix}/fallbackToInterval`);

  const asyncThunk = createAsyncThunk(actionsPrefix, async (params: T, { getState, dispatch }): Promise<R> => {
    const [visitsLoader, lastVisitLoader] = createLoaders(params, getState);

    const loadVisitsInParallel = async (pages: number[]): Promise<Visit[]> =>
      Promise.all(pages.map(async (page) => visitsLoader(page, ITEMS_PER_PAGE).then(prop('data')))).then(flatten);

    const loadPagesBlocks = async (pagesBlocks: number[][], index = 0): Promise<Visit[]> => {
      if (shouldCancel(getState)) {
        return [];
      }

      const data = await loadVisitsInParallel(pagesBlocks[index]);

      dispatch(progressChangedAction(calcProgress(pagesBlocks.length, index + PARALLEL_STARTING_PAGE)));

      if (index < pagesBlocks.length - 1) {
        return data.concat(await loadPagesBlocks(pagesBlocks, index + 1));
      }

      return data;
    };

    const loadVisits = async (page = 1) => {
      const { pagination, data } = await visitsLoader(page, ITEMS_PER_PAGE);

      // If pagination was not returned, then this is an old shlink version. Just return data
      if (!pagination || isLastPage(pagination)) {
        return data;
      }

      // If there are more pages, make requests in blocks of 4
      const pagesRange = range(PARALLEL_STARTING_PAGE, pagination.pagesCount + 1);
      const pagesBlocks = splitEvery(PARALLEL_REQUESTS_COUNT, pagesRange);

      if (pagination.pagesCount - 1 > PARALLEL_REQUESTS_COUNT) {
        dispatch(largeAction());
      }

      return data.concat(await loadPagesBlocks(pagesBlocks));
    };

    const [visits, lastVisit] = await Promise.all([loadVisits(), lastVisitLoader()]);

    if (!visits.length && lastVisit) {
      dispatch(fallbackToIntervalAction(dateToMatchingInterval(lastVisit.date)));
    }

    return { ...getExtraFulfilledPayload(params), visits } as any; // TODO Get rid of this casting
  });

  return { asyncThunk, progressChangedAction, largeAction, fallbackToIntervalAction };
};

export const lastVisitLoaderForLoader = (
  doIntervalFallback: boolean,
  loader: (params: ShlinkVisitsParams) => Promise<ShlinkVisits>,
): LastVisitLoader => {
  if (!doIntervalFallback) {
    return async () => Promise.resolve(undefined);
  }

  return async () => loader({ page: 1, itemsPerPage: 1 }).then(({ data }) => data[0]);
};
