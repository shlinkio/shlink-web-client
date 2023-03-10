import { createAction, createSlice } from '@reduxjs/toolkit';
import { flatten, prop, range, splitEvery } from 'ramda';
import type { ShlinkPaginator, ShlinkVisits, ShlinkVisitsParams } from '../../api/types';
import { parseApiError } from '../../api/utils';
import type { ShlinkState } from '../../container/types';
import type { DateInterval } from '../../utils/helpers/dateIntervals';
import { dateToMatchingInterval } from '../../utils/helpers/dateIntervals';
import { createAsyncThunk } from '../../utils/helpers/redux';
import type { CreateVisit, Visit } from '../types';
import type { LoadVisits, VisitsInfo, VisitsLoaded } from './types';
import { createNewVisits } from './visitCreation';

const ITEMS_PER_PAGE = 5000;
const PARALLEL_REQUESTS_COUNT = 4;
const PARALLEL_STARTING_PAGE = 2;

const isLastPage = ({ currentPage, pagesCount }: ShlinkPaginator): boolean => currentPage >= pagesCount;
const calcProgress = (total: number, current: number): number => (current * 100) / total;

type VisitsLoader = (page: number, itemsPerPage: number) => Promise<ShlinkVisits>;
type LastVisitLoader = (excludeBots?: boolean) => Promise<Visit | undefined>;

interface VisitsAsyncThunkOptions<T extends LoadVisits = LoadVisits, R extends VisitsLoaded = VisitsLoaded> {
  typePrefix: string;
  createLoaders: (params: T, getState: () => ShlinkState) => [VisitsLoader, LastVisitLoader];
  getExtraFulfilledPayload: (params: T) => Partial<R>;
  shouldCancel: (getState: () => ShlinkState) => boolean;
}

export const createVisitsAsyncThunk = <T extends LoadVisits = LoadVisits, R extends VisitsLoaded = VisitsLoaded>(
  { typePrefix, createLoaders, getExtraFulfilledPayload, shouldCancel }: VisitsAsyncThunkOptions<T, R>,
) => {
  const progressChanged = createAction<number>(`${typePrefix}/progressChanged`);
  const large = createAction<void>(`${typePrefix}/large`);
  const fallbackToInterval = createAction<DateInterval>(`${typePrefix}/fallbackToInterval`);

  const asyncThunk = createAsyncThunk(typePrefix, async (params: T, { getState, dispatch }): Promise<Partial<R>> => {
    const [visitsLoader, lastVisitLoader] = createLoaders(params, getState);

    const loadVisitsInParallel = async (pages: number[]): Promise<Visit[]> =>
      Promise.all(pages.map(async (page) => visitsLoader(page, ITEMS_PER_PAGE).then(prop('data')))).then(flatten);

    const loadPagesBlocks = async (pagesBlocks: number[][], index = 0): Promise<Visit[]> => {
      if (shouldCancel(getState)) {
        return [];
      }

      const data = await loadVisitsInParallel(pagesBlocks[index]);

      dispatch(progressChanged(calcProgress(pagesBlocks.length, index + PARALLEL_STARTING_PAGE)));

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
        dispatch(large());
      }

      return data.concat(await loadPagesBlocks(pagesBlocks));
    };

    const [visits, lastVisit] = await Promise.all([loadVisits(), lastVisitLoader(params.query?.excludeBots)]);

    if (!visits.length && lastVisit) {
      dispatch(fallbackToInterval(dateToMatchingInterval(lastVisit.date)));
    }

    return { ...getExtraFulfilledPayload(params), visits };
  });

  // Enhance the async thunk with extra actions
  return Object.assign(asyncThunk, { progressChanged, large, fallbackToInterval });
};

export const lastVisitLoaderForLoader = (
  doIntervalFallback: boolean,
  loader: (params: ShlinkVisitsParams) => Promise<ShlinkVisits>,
): LastVisitLoader => async (excludeBots?: boolean) => (
  !doIntervalFallback
    ? Promise.resolve(undefined)
    : loader({ page: 1, itemsPerPage: 1, excludeBots }).then(({ data }) => data[0])
);

interface VisitsReducerOptions<State extends VisitsInfo, AT extends ReturnType<typeof createVisitsAsyncThunk>> {
  name: string;
  asyncThunkCreator: AT;
  initialState: State;
  filterCreatedVisits: (state: State, createdVisits: CreateVisit[]) => CreateVisit[];
}

export const createVisitsReducer = <State extends VisitsInfo, AT extends ReturnType<typeof createVisitsAsyncThunk>>(
  { name, asyncThunkCreator, initialState, filterCreatedVisits }: VisitsReducerOptions<State, AT>,
) => {
  const { pending, rejected, fulfilled, large, progressChanged, fallbackToInterval } = asyncThunkCreator;
  const { reducer, actions } = createSlice({
    name,
    initialState,
    reducers: {
      cancelGetVisits: (state) => ({ ...state, cancelLoad: true }),
    },
    extraReducers: (builder) => {
      builder.addCase(pending, () => ({ ...initialState, loading: true }));
      builder.addCase(rejected, (_, { error }) => (
        { ...initialState, error: true, errorData: parseApiError(error) }
      ));
      builder.addCase(fulfilled, (state, { payload }) => (
        { ...state, ...payload, loading: false, loadingLarge: false, error: false }
      ));

      builder.addCase(large, (state) => ({ ...state, loadingLarge: true }));
      builder.addCase(progressChanged, (state, { payload: progress }) => ({ ...state, progress }));
      builder.addCase(fallbackToInterval, (state, { payload: fallbackInterval }) => (
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
