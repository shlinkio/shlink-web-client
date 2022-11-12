import { flatten, prop, range, splitEvery } from 'ramda';
import { Action, Dispatch } from 'redux';
import { ShlinkPaginator, ShlinkVisits, ShlinkVisitsParams } from '../../api/types';
import { Visit, VisitsLoadProgressChangedAction } from '../types';
import { parseApiError } from '../../api/utils';
import { ApiErrorAction } from '../../api/types/actions';
import { dateToMatchingInterval } from '../../utils/dates/types';

const ITEMS_PER_PAGE = 5000;
const PARALLEL_REQUESTS_COUNT = 4;
const PARALLEL_STARTING_PAGE = 2;

const isLastPage = ({ currentPage, pagesCount }: ShlinkPaginator): boolean => currentPage >= pagesCount;
const calcProgress = (total: number, current: number): number => (current * 100) / total;

type VisitsLoader = (page: number, itemsPerPage: number) => Promise<ShlinkVisits>;
type LastVisitLoader = () => Promise<Visit | undefined>;

export const getVisitsWithLoader = async <T extends Action<string> & { visits: Visit[] }>(
  visitsLoader: VisitsLoader,
  lastVisitLoader: LastVisitLoader,
  extraFinishActionData: Partial<T>,
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
        : { ...extraFinishActionData, visits, type: `${actionsPrefix}/fulfilled` },
    );
  } catch (e: any) {
    dispatch<ApiErrorAction>({ type: `${actionsPrefix}/rejected`, errorData: parseApiError(e) });
  }
};

export const lastVisitLoaderForLoader = (
  doIntervalFallback: boolean,
  loader: (params: ShlinkVisitsParams) => Promise<ShlinkVisits>,
): LastVisitLoader => {
  if (!doIntervalFallback) {
    return async () => Promise.resolve(undefined);
  }

  return async () => loader({ page: 1, itemsPerPage: 1 }).then((result) => result.data[0]);
};
