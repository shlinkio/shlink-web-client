import React from 'react';
import PropTypes from 'prop-types';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { ELLIPSIS, progressivePagination } from '../utils/helpers/pagination';
import './SimplePaginator.scss';

const propTypes = {
  pagesCount: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
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
      {progressivePagination(currentPage, pagesCount).map((page, index) => (
        <PaginationItem
          key={page !== ELLIPSIS ? page : `${page}_${index}`}
          active={page === currentPage}
          disabled={page === ELLIPSIS}
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
