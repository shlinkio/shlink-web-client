import React from 'react';
import PropTypes from 'prop-types';
import { fromPairs, head, keys, pipe, prop, reverse, sortBy, splitEvery, toLower, toPairs, type, zipObj } from 'ramda';
import SortingDropdown from '../utils/SortingDropdown';
import PaginationDropdown from '../utils/PaginationDropdown';
import { rangeOf } from '../utils/utils';
import { roundTen } from '../utils/helpers/numbers';
import SimplePaginator from '../common/SimplePaginator';
import GraphCard from './GraphCard';

const { max } = Math;
const toLowerIfString = (value) => type(value) === 'String' ? toLower(value) : value;
const pickKeyFromPair = ([ key ]) => key;
const pickValueFromPair = ([ , value ]) => value;

export default class SortableBarGraph extends React.Component {
  static propTypes = {
    stats: PropTypes.object.isRequired,
    highlightedStats: PropTypes.object,
    highlightedLabel: PropTypes.string,
    title: PropTypes.string.isRequired,
    sortingItems: PropTypes.object.isRequired,
    extraHeaderContent: PropTypes.func,
    withPagination: PropTypes.bool,
    onClick: PropTypes.func,
  };

  state = {
    orderField: undefined,
    orderDir: undefined,
    currentPage: 1,
    itemsPerPage: 50,
  };

  getSortedPairsForStats(stats, sortingItems) {
    const pairs = toPairs(stats);
    const sortedPairs = !this.state.orderField ? pairs : sortBy(
      pipe(
        prop(this.state.orderField === head(keys(sortingItems)) ? 0 : 1),
        toLowerIfString
      ),
      pairs
    );

    return !this.state.orderDir || this.state.orderDir === 'ASC' ? sortedPairs : reverse(sortedPairs);
  }

  determineStats(stats, highlightedStats, sortingItems) {
    const sortedPairs = this.getSortedPairsForStats(stats, sortingItems);
    const sortedKeys = sortedPairs.map(pickKeyFromPair);
    // The highlighted stats have to be ordered based on the regular stats, not on its own values
    const sortedHighlightedPairs = highlightedStats && toPairs(
      { ...zipObj(sortedKeys, sortedKeys.map(() => 0)), ...highlightedStats }
    );

    if (sortedPairs.length <= this.state.itemsPerPage) {
      return {
        currentPageStats: fromPairs(sortedPairs),
        currentPageHighlightedStats: sortedHighlightedPairs && fromPairs(sortedHighlightedPairs),
      };
    }

    const pages = splitEvery(this.state.itemsPerPage, sortedPairs);
    const highlightedPages = sortedHighlightedPairs && splitEvery(this.state.itemsPerPage, sortedHighlightedPairs);

    return {
      currentPageStats: fromPairs(this.determineCurrentPagePairs(pages)),
      currentPageHighlightedStats: highlightedPages && fromPairs(this.determineCurrentPagePairs(highlightedPages)),
      pagination: this.renderPagination(pages.length),
      max: roundTen(max(...sortedPairs.map(pickValueFromPair))),
    };
  }

  determineCurrentPagePairs(pages) {
    const page = pages[this.state.currentPage - 1];

    if (this.state.currentPage < pages.length) {
      return page;
    }

    const firstPageLength = pages[0].length;

    // Using the "hidden" key, the chart will just replace the label by an empty string
    return [ ...page, ...rangeOf(firstPageLength - page.length, (i) => [ `hidden_${i}`, 0 ]) ];
  }

  renderPagination(pagesCount) {
    const { currentPage } = this.state;
    const setCurrentPage = (currentPage) => this.setState({ currentPage });

    return <SimplePaginator currentPage={currentPage} pagesCount={pagesCount} setCurrentPage={setCurrentPage} />;
  }

  render() {
    const {
      stats,
      highlightedStats,
      sortingItems,
      title,
      extraHeaderContent,
      withPagination = true,
      ...rest
    } = this.props;
    const { currentPageStats, currentPageHighlightedStats, pagination, max } = this.determineStats(
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
            orderField={this.state.orderField}
            orderDir={this.state.orderDir}
            onChange={(orderField, orderDir) => this.setState({ orderField, orderDir, currentPage: 1 })}
          />
        </div>
        {withPagination && keys(stats).length > 50 && (
          <div className="float-right">
            <PaginationDropdown
              toggleClassName="btn-sm p-0 mr-3"
              ranges={[ 50, 100, 200, 500 ]}
              value={this.state.itemsPerPage}
              setValue={(itemsPerPage) => this.setState({ itemsPerPage, currentPage: 1 })}
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
  }
}
