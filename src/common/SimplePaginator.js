import React from 'react';
import PropTypes from 'prop-types';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { range, max, min } from 'ramda';
import './SimplePaginator.scss';

const propTypes = {
  pagesCount: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
};

export const ellipsis = '...';

const pagination = (currentPage, pageCount) => {
  const delta = 2;
  const pages = range(
    max(delta, currentPage - delta),
    min(pageCount - 1, currentPage + delta) + 1
  );

  if (currentPage - delta > delta) {
    pages.unshift(ellipsis);
  }
  if (currentPage + delta < pageCount - 1) {
    pages.push(ellipsis);
  }

  pages.unshift(1);
  pages.push(pageCount);

  return pages;
};

const SimplePaginator = ({ pagesCount, currentPage, setCurrentPage }) => {
  if (pagesCount < 2) {
    return null;
  }

  const onClick = (page) => () => setCurrentPage(page);

  return (
    <Pagination listClassName="flex-wrap justify-content-center mb-0 simple-paginator">
      <PaginationItem disabled={currentPage <= 1}>
        <PaginationLink previous tag="span" onClick={onClick(currentPage - 1)} />
      </PaginationItem>
      {pagination(currentPage, pagesCount).map((page, index) => (
        <PaginationItem
          key={page !== ellipsis ? page : `${page}_${index}`}
          active={page === currentPage}
          disabled={page === ellipsis}
        >
          <PaginationLink tag="span" onClick={onClick(page)}>{page}</PaginationLink>
        </PaginationItem>
      ))}
      <PaginationItem disabled={currentPage >= pagesCount}>
        <PaginationLink next tag="span" onClick={onClick(currentPage + 1)} />
      </PaginationItem>
    </Pagination>
  );
};

SimplePaginator.propTypes = propTypes;

export default SimplePaginator;
