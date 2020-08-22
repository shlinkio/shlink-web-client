import { max, min, range } from 'ramda';

export const ELLIPSIS = '...';

type NumberOrEllipsis = number | '...';

export const progressivePagination = (currentPage: number, pageCount: number): NumberOrEllipsis[] => {
  const delta = 2;
  const pages: NumberOrEllipsis[] = range(
    max(delta, currentPage - delta),
    min(pageCount - 1, currentPage + delta) + 1,
  );

  if (currentPage - delta > delta) {
    pages.unshift(ELLIPSIS);
  }
  if (currentPage + delta < pageCount - 1) {
    pages.push(ELLIPSIS);
  }

  pages.unshift(1);
  pages.push(pageCount);

  return pages;
};

export const keyForPage = (pageNumber: NumberOrEllipsis, index: number) => pageNumber !== ELLIPSIS ? pageNumber : `${pageNumber}_${index}`;

export const isPageDisabled = (pageNumber: NumberOrEllipsis) => pageNumber === ELLIPSIS;
