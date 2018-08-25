import React from 'react';
import { Link } from 'react-router-dom';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import PropTypes from 'prop-types';
import { range } from 'ramda';

const propTypes = {
  serverId: PropTypes.string.isRequired,
  paginator: PropTypes.shape({
    currentPage: PropTypes.number,
    pagesCount: PropTypes.number,
  }),
};

export default function Paginator({ paginator = {}, serverId }) {
  const { currentPage, pagesCount = 0 } = paginator;

  if (pagesCount <= 1) {
    return null;
  }

  const renderPages = () =>
    range(1, pagesCount + 1).map((i) => (
      <PaginationItem key={i} active={currentPage === i}>
        <PaginationLink
          tag={Link}
          to={`/server/${serverId}/list-short-urls/${i}`}
        >
          {i}
        </PaginationLink>
      </PaginationItem>
    ));

  return (
    <Pagination listClassName="flex-wrap">
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
}

Paginator.propTypes = propTypes;
