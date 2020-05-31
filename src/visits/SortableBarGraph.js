import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { fromPairs, head, keys, pipe, prop, reverse, sortBy, splitEvery, toLower, toPairs, type, zipObj } from 'ramda';
import SortingDropdown from '../utils/SortingDropdown';
import PaginationDropdown from '../utils/PaginationDropdown';
import { rangeOf } from '../utils/utils';
import { roundTen } from '../utils/helpers/numbers';
import SimplePaginator from '../common/SimplePaginator';
import GraphCard from './GraphCard';

const propTypes = {
  stats: PropTypes.object.isRequired,
  highlightedStats: PropTypes.object,
  highlightedLabel: PropTypes.string,
  title: PropTypes.string.isRequired,
  sortingItems: PropTypes.object.isRequired,
  extraHeaderContent: PropTypes.func,
  withPagination: PropTypes.bool,
  onClick: PropTypes.func,
};

const toLowerIfString = (value) => type(value) === 'String' ? toLower(value) : value;
const pickKeyFromPair = ([ key ]) => key;
const pickValueFromPair = ([ , value ]) => value;

const SortableBarGraph = ({
  stats,
  highlightedStats,
  title,
  sortingItems,
  extraHeaderContent,
  withPagination = true,
  ...rest
}) => {
  const [ order, setOrder ] = useState({
    orderField: undefined,
    orderDir: undefined,
  });
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ itemsPerPage, setItemsPerPage ] = useState(50);

  const getSortedPairsForStats = (stats, sortingItems) => {
    const pairs = toPairs(stats);
    const sortedPairs = !order.orderField ? pairs : sortBy(
      pipe(
        prop(order.orderField === head(keys(sortingItems)) ? 0 : 1),
        toLowerIfString
      ),
      pairs
    );

    return !order.orderDir || order.orderDir === 'ASC' ? sortedPairs : reverse(sortedPairs);
  };
  const determineStats = (stats, highlightedStats, sortingItems) => {
    const sortedPairs = getSortedPairsForStats(stats, sortingItems);
    const sortedKeys = sortedPairs.map(pickKeyFromPair);
    // The highlighted stats have to be ordered based on the regular stats, not on its own values
    const sortedHighlightedPairs = highlightedStats && toPairs(
      { ...zipObj(sortedKeys, sortedKeys.map(() => 0)), ...highlightedStats }
    );

    if (sortedPairs.length <= itemsPerPage) {
      return {
        currentPageStats: fromPairs(sortedPairs),
        currentPageHighlightedStats: sortedHighlightedPairs && fromPairs(sortedHighlightedPairs),
      };
    }

    const pages = splitEvery(itemsPerPage, sortedPairs);
    const highlightedPages = sortedHighlightedPairs && splitEvery(itemsPerPage, sortedHighlightedPairs);

    return {
      currentPageStats: fromPairs(determineCurrentPagePairs(pages)),
      currentPageHighlightedStats: highlightedPages && fromPairs(determineCurrentPagePairs(highlightedPages)),
      pagination: renderPagination(pages.length),
      max: roundTen(Math.max(...sortedPairs.map(pickValueFromPair))),
    };
  };
  const determineCurrentPagePairs = (pages) => {
    const page = pages[currentPage - 1];

    if (currentPage < pages.length) {
      return page;
    }

    const firstPageLength = pages[0].length;

    // Using the "hidden" key, the chart will just replace the label by an empty string
    return [ ...page, ...rangeOf(firstPageLength - page.length, (i) => [ `hidden_${i}`, 0 ]) ];
  };
  const renderPagination = (pagesCount) =>
    <SimplePaginator currentPage={currentPage} pagesCount={pagesCount} setCurrentPage={setCurrentPage} />;

  const { currentPageStats, currentPageHighlightedStats, pagination, max } = determineStats(
    stats,
    highlightedStats && keys(highlightedStats).length > 0 ? highlightedStats : undefined,
    sortingItems
  );
  const activeCities = keys(currentPageStats);
  const computeTitle = () => (
    <React.Fragment>
      {title}
      <div className="float-right">
        <SortingDropdown
          isButton={false}
          right
          items={sortingItems}
          orderField={order.orderField}
          orderDir={order.orderDir}
          onChange={(orderField, orderDir) => setOrder({ orderField, orderDir }) || setCurrentPage(1)}
        />
      </div>
      {withPagination && keys(stats).length > 50 && (
        <div className="float-right">
          <PaginationDropdown
            toggleClassName="btn-sm p-0 mr-3"
            ranges={[ 50, 100, 200, 500 ]}
            value={itemsPerPage}
            setValue={(itemsPerPage) => setItemsPerPage(itemsPerPage) || setCurrentPage(1)}
          />
        </div>
      )}
      {extraHeaderContent && (
        <div className="float-right">
          {extraHeaderContent(pagination ? activeCities : undefined)}
        </div>
      )}
    </React.Fragment>
  );

  return (
    <GraphCard
      isBarChart
      title={computeTitle}
      stats={currentPageStats}
      highlightedStats={currentPageHighlightedStats}
      footer={pagination}
      max={max}
      {...rest}
    />
  );
};

SortableBarGraph.propTypes = propTypes;

export default SortableBarGraph;
