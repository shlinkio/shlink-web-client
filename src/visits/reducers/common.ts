import { flatten, prop, range, splitEvery } from 'ramda';
import { createAction, createSlice } from '@reduxjs/toolkit';
import { ShlinkPaginator, ShlinkVisits, ShlinkVisitsParams } from '../../api/types';
import { CreateVisit, Visit } from '../types';
import { DateInterval, dateToMatchingInterval } from '../../utils/dates/types';
import { LoadVisits, VisitsInfo, VisitsLoaded } from './types';
import { createAsyncThunk } from '../../utils/helpers/redux';
import { ShlinkState } from '../../container/types';
import { parseApiError } from '../../api/utils';
import { createNewVisits } from './visitCreation';

const ITEMS_PER_PAGE = 5000;
const PARALLEL_REQUESTS_COUNT = 4;
const PARALLEL_STARTING_PAGE = 2;

const isLastPage = ({ currentPage, pagesCount }: ShlinkPaginator): boolean => currentPage >= pagesCount;
const calcProgress = (total: number, current: number): number => (current * 100) / total;

type VisitsLoader = (page: number, itemsPerPage: number) => Promise<ShlinkVisits>;
type LastVisitLoader = () => Promise<Visit | undefined>;

interface VisitsAsyncThunkOptions<T extends LoadVisits = LoadVisits, R extends VisitsLoaded = VisitsLoaded> {
  typePrefix: string;
  createLoaders: (params: T, getState: () => ShlinkState) => [VisitsLoader, LastVisitLoader];
  getExtraFulfilledPayload: (params: T) => Partial<R>;
  shouldCancel: (getState: () => ShlinkState) => boolean;
}

export const createVisitsAsyncThunk = <T extends LoadVisits = LoadVisits, R extends VisitsLoaded = VisitsLoaded>(
  { typePrefix, createLoaders, getExtraFulfilledPayload, shouldCancel }: VisitsAsyncThunkOptions<T, R>,
) => {
  const progressChangedAction = createAction<number>(`${typePrefix}/progressChanged`);
  const largeAction = createAction<void>(`${typePrefix}/large`);
  const fallbackToIntervalAction = createAction<DateInterval>(`${typePrefix}/fallbackToInterval`);

  const asyncThunk = createAsyncThunk(typePrefix, async (params: T, { getState, dispatch }): Promise<R> => {
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

interface VisitsReducerOptions<State extends VisitsInfo, AT extends ReturnType<typeof createVisitsAsyncThunk>> {
  name: string;
  asyncThunkCreator: AT;
  initialState: State;
  filterCreatedVisits: (state: State, createdVisits: CreateVisit[]) => CreateVisit[];
}

export const createVisitsReducer = <State extends VisitsInfo, AT extends ReturnType<typeof createVisitsAsyncThunk>>(
  { name, asyncThunkCreator, initialState, filterCreatedVisits }: VisitsReducerOptions<State, AT>,
) => {
  const { asyncThunk, largeAction, fallbackToIntervalAction, progressChangedAction } = asyncThunkCreator;
  const { reducer, actions } = createSlice({
    name,
    initialState,
    reducers: {
      cancelGetVisits: (state) => ({ ...state, cancelLoad: true }),
    },
    extraReducers: (builder) => {
      builder.addCase(asyncThunk.pending, () => ({ ...initialState, loading: true }));
      builder.addCase(asyncThunk.rejected, (_, { error }) => (
        { ...initialState, error: true, errorData: parseApiError(error) }
      ));
      builder.addCase(asyncThunk.fulfilled, (state, { payload }) => (
        { ...state, ...payload, loading: false, loadingLarge: false, error: false }
      ));

      builder.addCase(largeAction, (state) => ({ ...state, loadingLarge: true }));
      builder.addCase(progressChangedAction, (state, { payload: progress }) => ({ ...state, progress }));
      builder.addCase(fallbackToIntervalAction, (state, { payload: fallbackInterval }) => (
        { ...state, fallbackInterval }
      ));

      builder.addCase(createNewVisits, (state, { payload }) => {
        const { visits } = state;
        // @ts-expect-error TODO Fix type inference
        const newVisits = filterCreatedVisits(state, payload.createdVisits).map(({ visit }) => visit);

        return !newVisits.length ? state : { ...state, visits: [...newVisits, ...visits] };
      });
    },
  });
  const { cancelGetVisits } = actions;

  return { reducer, cancelGetVisits };
};
