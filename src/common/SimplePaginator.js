import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { isPageDisabled, keyForPage, progressivePagination } from '../utils/helpers/pagination';
import './SimplePaginator.scss';

const propTypes = {
  pagesCount: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  centered: PropTypes.bool,
};

const SimplePaginator = ({ pagesCount, currentPage, setCurrentPage, centered = true }) => {
  if (pagesCount < 2) {
    return null;
  }

  const onClick = (page) => () => setCurrentPage(page);

  return (
    <Pagination listClassName={classNames('flex-wrap mb-0 simple-paginator', { 'justify-content-center': centered })}>
      <PaginationItem disabled={currentPage <= 1}>
        <PaginationLink previous tag="span" onClick={onClick(currentPage - 1)} />
      </PaginationItem>
      {progressivePagination(currentPage, pagesCount).map((pageNumber, index) => (
        <PaginationItem
          key={keyForPage(pageNumber, index)}
          disabled={isPageDisabled(pageNumber)}
          active={currentPage === pageNumber}
        >
          <PaginationLink tag="span" onClick={onClick(pageNumber)}>{pageNumber}</PaginationLink>
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
