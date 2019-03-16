import React from 'react';
import PropTypes from 'prop-types';
import { fromPairs, head, keys, pipe, prop, reverse, sortBy, splitEvery, toLower, toPairs, type } from 'ramda';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import SortingDropdown from '../utils/SortingDropdown';
import PaginationDropdown from '../utils/PaginationDropdown';
import { rangeOf, roundTen } from '../utils/utils';
import GraphCard from './GraphCard';

const { max } = Math;
const toLowerIfString = (value) => type(value) === 'String' ? toLower(value) : value;
const pickValueFromPair = ([ , value ]) => value;

export default class SortableBarGraph extends React.Component {
  static propTypes = {
    stats: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    sortingItems: PropTypes.object.isRequired,
    extraHeaderContent: PropTypes.func,
    withPagination: PropTypes.bool,
  };

  state = {
    orderField: undefined,
    orderDir: undefined,
    currentPage: 1,
    itemsPerPage: Infinity,
  };

  determineStats(stats, sortingItems) {
    const pairs = toPairs(stats);
    const sortedPairs = !this.state.orderField ? pairs : sortBy(
      pipe(
        prop(this.state.orderField === head(keys(sortingItems)) ? 0 : 1),
        toLowerIfString
      ),
      pairs
    );
    const directionalPairs = !this.state.orderDir || this.state.orderDir === 'ASC' ? sortedPairs : reverse(sortedPairs);

    if (directionalPairs.length <= this.state.itemsPerPage) {
      return { currentPageStats: fromPairs(directionalPairs) };
    }

    const pages = splitEvery(this.state.itemsPerPage, directionalPairs);

    return {
      currentPageStats: fromPairs(this.determineCurrentPagePairs(pages)),
      pagination: this.renderPagination(pages.length),
      max: roundTen(max(...directionalPairs.map(pickValueFromPair))),
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

    return (
      <Pagination listClassName="flex-wrap mb-0">
        <PaginationItem disabled={currentPage === 1}>
          <PaginationLink previous tag="span" onClick={() => this.setState({ currentPage: currentPage - 1 })} />
        </PaginationItem>
        {rangeOf(pagesCount, (page) => (
          <PaginationItem key={page} active={page === currentPage}>
            <PaginationLink tag="span" onClick={() => this.setState({ currentPage: page })}>{page}</PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem disabled={currentPage >= pagesCount}>
          <PaginationLink next tag="span" onClick={() => this.setState({ currentPage: currentPage + 1 })} />
        </PaginationItem>
      </Pagination>
    );
  }

  render() {
    const { stats, sortingItems, title, extraHeaderContent, withPagination = true } = this.props;
    const { currentPageStats, pagination, max } = this.determineStats(stats, sortingItems);
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
              toggleClassName="btn-sm paddingless mr-3"
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

    return <GraphCard isBarChart title={computeTitle} stats={currentPageStats} footer={pagination} max={max} />;
  }
}
