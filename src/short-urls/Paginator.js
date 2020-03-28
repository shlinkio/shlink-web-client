import React from 'react';
import { Link } from 'react-router-dom';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import PropTypes from 'prop-types';
import { ELLIPSIS, progressivePagination } from '../utils/utils';

const propTypes = {
  serverId: PropTypes.string.isRequired,
  paginator: PropTypes.shape({
    currentPage: PropTypes.number,
    pagesCount: PropTypes.number,
  }),
};

const Paginator = ({ paginator = {}, serverId }) => {
  const { currentPage, pagesCount = 0 } = paginator;

  if (pagesCount <= 1) {
    return null;
  }

  const renderPages = () =>
    progressivePagination(currentPage, pagesCount).map((pageNumber, index) => (
      <PaginationItem
        key={pageNumber !== ELLIPSIS ? pageNumber : `${pageNumber}_${index}`}
        active={currentPage === pageNumber}
        disabled={pageNumber === ELLIPSIS}
      >
        <PaginationLink
          tag={Link}
          to={`/server/${serverId}/list-short-urls/${pageNumber}`}
        >
          {pageNumber}
        </PaginationLink>
      </PaginationItem>
    ));

  return (
    <Pagination listClassName="flex-wrap justify-content-center">
      <PaginationItem disabled={currentPage === 1}>
        <PaginationLink
          previous
          tag={Link}
          to={`/server/${serverId}/list-short-urls/${currentPage - 1}`}
        />
      </PaginationItem>
      {renderPages()}
      <PaginationItem disabled={currentPage >= pagesCount}>
        <PaginationLink
          next
          tag={Link}
          to={`/server/${serverId}/list-short-urls/${currentPage + 1}`}
        />
      </PaginationItem>
    </Pagination>
  );
};

Paginator.propTypes = propTypes;

export default Paginator;
