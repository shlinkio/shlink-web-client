import { flatten, prop, range, splitEvery } from 'ramda';

const ITEMS_PER_PAGE = 5000;
const isLastPage = ({ currentPage, pagesCount }) => currentPage >= pagesCount;

export const getVisitsWithLoader = async (visitsLoader, extraFinishActionData, actionMap, dispatch, getState) => {
  dispatch({ type: actionMap.start });

  const loadVisits = async (page = 1) => {
    const { pagination, data } = await visitsLoader(page, ITEMS_PER_PAGE);

    // If pagination was not returned, then this is an old shlink version. Just return data
    if (!pagination || isLastPage(pagination)) {
      return data;
    }

    // If there are more pages, make requests in blocks of 4
    const parallelRequestsCount = 4;
    const parallelStartingPage = 2;
    const pagesRange = range(parallelStartingPage, pagination.pagesCount + 1);
    const pagesBlocks = splitEvery(parallelRequestsCount, pagesRange);

    if (pagination.pagesCount - 1 > parallelRequestsCount) {
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
