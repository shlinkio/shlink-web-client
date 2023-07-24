import { render, screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { MemoryRouter } from 'react-router-dom';
import { Paginator } from '../../shlink-web-component/short-urls/Paginator';
import type { ShlinkPaginator } from '../../src/api/types';
import { ELLIPSIS } from '../../src/utils/helpers/pagination';

describe('<Paginator />', () => {
  const buildPaginator = (pagesCount?: number) => fromPartial<ShlinkPaginator>({ pagesCount, currentPage: 1 });
  const setUp = (paginator?: ShlinkPaginator, currentQueryString?: string) => render(
    <MemoryRouter>
      <Paginator serverId="abc123" paginator={paginator} currentQueryString={currentQueryString} />
    </MemoryRouter>,
  );

  it.each([
    [undefined],
    [buildPaginator()],
    [buildPaginator(0)],
    [buildPaginator(1)],
  ])('renders an empty gap if the number of pages is below 2', (paginator) => {
    const { container } = setUp(paginator);

    expect(container.firstChild).toBeEmptyDOMElement();
    expect(container.firstChild).toHaveClass('pb-3');
  });

  it.each([
    [buildPaginator(2), 4, 0],
    [buildPaginator(3), 5, 0],
    [buildPaginator(4), 6, 0],
    [buildPaginator(5), 7, 1],
    [buildPaginator(6), 7, 1],
    [buildPaginator(23), 7, 1],
  ])('renders previous, next and the list of pages, with ellipses when expected', (
    paginator,
    expectedPages,
    expectedEllipsis,
  ) => {
    setUp(paginator);

    const links = screen.getAllByRole('link');
    const ellipsis = screen.queryAllByText(ELLIPSIS);

    expect(links).toHaveLength(expectedPages);
    expect(ellipsis).toHaveLength(expectedEllipsis);
  });

  it('appends query string to all pages', () => {
    const paginator = buildPaginator(3);
    const currentQueryString = '?foo=bar';

    setUp(paginator, currentQueryString);
    const links = screen.getAllByRole('link');

    expect(links).toHaveLength(5);
    links.forEach((link) => expect(link).toHaveAttribute('href', expect.stringContaining(currentQueryString)));
  });
});
