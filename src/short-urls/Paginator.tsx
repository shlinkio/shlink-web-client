import { Link } from 'react-router-dom';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import {
  pageIsEllipsis,
  keyForPage,
  progressivePagination,
  prettifyPageNumber,
  NumberOrEllipsis,
} from '../utils/helpers/pagination';
import { ShlinkPaginator } from '../api/types';

interface PaginatorProps {
  paginator?: ShlinkPaginator;
  serverId: string;
  currentQueryString?: string;
}

const Paginator = ({ paginator, serverId, currentQueryString = '' }: PaginatorProps) => {
  const { currentPage = 0, pagesCount = 0 } = paginator ?? {};
  const urlForPage = (pageNumber: NumberOrEllipsis) =>
    `/server/${serverId}/list-short-urls/${pageNumber}${currentQueryString}`;

  if (pagesCount <= 1) {
    return null;
  }

  const renderPages = () =>
    progressivePagination(currentPage, pagesCount).map((pageNumber, index) => (
      <PaginationItem
        key={keyForPage(pageNumber, index)}
        disabled={pageIsEllipsis(pageNumber)}
        active={currentPage === pageNumber}
      >
        <PaginationLink tag={Link} to={urlForPage(pageNumber)}>
          {prettifyPageNumber(pageNumber)}
        </PaginationLink>
      </PaginationItem>
    ));

  return (
    <Pagination className="sticky-card-paginator" listClassName="flex-wrap justify-content-center mb-0">
      <PaginationItem disabled={currentPage === 1}>
        <PaginationLink previous tag={Link} to={urlForPage(currentPage - 1)} />
      </PaginationItem>
      {renderPages()}
      <PaginationItem disabled={currentPage >= pagesCount}>
        <PaginationLink next tag={Link} to={urlForPage(currentPage + 1)} />
      </PaginationItem>
    </Pagination>
  );
};

export default Paginator;
