import { flatten, prop, range, splitEvery } from 'ramda';

const ITEMS_PER_PAGE = 5000;
const PARALLEL_REQUESTS_COUNT = 4;
const PARALLEL_STARTING_PAGE = 2;

const isLastPage = ({ currentPage, pagesCount }) => currentPage >= pagesCount;
const calcProgress = (total, current) => current * 100 / total;

export const getVisitsWithLoader = async (visitsLoader, extraFinishActionData, actionMap, dispatch, getState) => {
  dispatch({ type: actionMap.start });

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
      dispatch({ type: actionMap.large });
    }

    return data.concat(await loadPagesBlocks(pagesBlocks));
  };

  const loadPagesBlocks = async (pagesBlocks, index = 0) => {
    const { shortUrlVisits: { cancelLoad } } = getState();

    if (cancelLoad) {
      return [];
    }

    const data = await loadVisitsInParallel(pagesBlocks[index]);

    dispatch({ type: actionMap.progress, progress: calcProgress(pagesBlocks.length, index + PARALLEL_STARTING_PAGE) });

    if (index < pagesBlocks.length - 1) {
      return data.concat(await loadPagesBlocks(pagesBlocks, index + 1));
    }

    return data;
  };

  const loadVisitsInParallel = (pages) =>
    Promise.all(pages.map((page) => visitsLoader(page, ITEMS_PER_PAGE).then(prop('data')))).then(flatten);

  try {
    const visits = await loadVisits();

    dispatch({ ...extraFinishActionData, visits, type: actionMap.finish });
  } catch (e) {
    dispatch({ type: actionMap.error });
  }
};
