import React from 'react';
import PropTypes from 'prop-types';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { rangeOf } from '../utils/utils';

const propTypes = {
  pagesCount: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
};

const SimplePaginator = ({ pagesCount, currentPage, setCurrentPage }) => (
  <Pagination listClassName="flex-wrap mb-0">
    <PaginationItem disabled={currentPage <= 1}>
      <PaginationLink previous tag="span" onClick={setCurrentPage(currentPage - 1)} />
    </PaginationItem>
    {rangeOf(pagesCount, (page) => (
      <PaginationItem key={page} active={page === currentPage}>
        <PaginationLink tag="span" onClick={setCurrentPage(page)}>{page}</PaginationLink>
      </PaginationItem>
    ))}
    <PaginationItem disabled={currentPage >= pagesCount}>
      <PaginationLink next tag="span" onClick={setCurrentPage(currentPage + 1)} />
    </PaginationItem>
  </Pagination>
);

SimplePaginator.propTypes = propTypes;

export default SimplePaginator;
