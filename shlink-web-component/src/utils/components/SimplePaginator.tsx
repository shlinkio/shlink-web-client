import classNames from 'classnames';
import type { FC } from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import type { NumberOrEllipsis } from '../helpers/pagination';
import {
  keyForPage,
  pageIsEllipsis,
  prettifyPageNumber,
  progressivePagination,
} from '../helpers/pagination';
import './SimplePaginator.scss';

interface SimplePaginatorProps {
  pagesCount: number;
  currentPage: number;
  setCurrentPage: (currentPage: number) => void;
  centered?: boolean;
}

export const SimplePaginator: FC<SimplePaginatorProps> = (
  { pagesCount, currentPage, setCurrentPage, centered = true },
) => {
  if (pagesCount < 2) {
    return null;
  }

  const onClick = (page: NumberOrEllipsis) => () => !pageIsEllipsis(page) && setCurrentPage(page);

  return (
    <Pagination listClassName={classNames('flex-wrap mb-0 simple-paginator', { 'justify-content-center': centered })}>
      <PaginationItem disabled={currentPage <= 1}>
        <PaginationLink previous tag="span" onClick={onClick(currentPage - 1)} />
      </PaginationItem>
      {progressivePagination(currentPage, pagesCount).map((pageNumber, index) => (
        <PaginationItem
          key={keyForPage(pageNumber, index)}
          disabled={pageIsEllipsis(pageNumber)}
          active={currentPage === pageNumber}
        >
          <PaginationLink role="link" tag="span" onClick={onClick(pageNumber)}>
            {prettifyPageNumber(pageNumber)}
          </PaginationLink>
        </PaginationItem>
      ))}
      <PaginationItem disabled={currentPage >= pagesCount}>
        <PaginationLink next tag="span" onClick={onClick(currentPage + 1)} />
      </PaginationItem>
    </Pagination>
  );
};
