import { render, screen } from '@testing-library/react';
import { SimplePaginator } from '../../shlink-web-component/src/utils/components/SimplePaginator';
import { ELLIPSIS } from '../../shlink-web-component/src/utils/helpers/pagination';

describe('<SimplePaginator />', () => {
  const setUp = (pagesCount: number, currentPage = 1) => render(
    <SimplePaginator pagesCount={pagesCount} currentPage={currentPage} setCurrentPage={vi.fn()} />,
  );

  it.each([-3, -2, 0, 1])('renders empty when the amount of pages is smaller than 2', (pagesCount) => {
    const { container } = setUp(pagesCount);
    expect(container.firstChild).toBeNull();
  });

  describe('ELLIPSIS are rendered where expected', () => {
    const getItemsForPages = (pagesCount: number, currentPage: number) => {
      setUp(pagesCount, currentPage);

      const items = screen.getAllByRole('link');
      const itemsWithEllipsis = items.filter((item) => item.innerHTML.includes(ELLIPSIS));

      return { items, itemsWithEllipsis };
    };

    it('renders first ELLIPSIS', () => {
      const { items, itemsWithEllipsis } = getItemsForPages(9, 7);

      expect(items[1]).toHaveTextContent(ELLIPSIS);
      expect(itemsWithEllipsis).toHaveLength(1);
    });

    it('renders last ELLIPSIS', () => {
      const { items, itemsWithEllipsis } = getItemsForPages(9, 2);

      expect(items[items.length - 2]).toHaveTextContent(ELLIPSIS);
      expect(itemsWithEllipsis).toHaveLength(1);
    });

    it('renders both ELLIPSIS', () => {
      const { items, itemsWithEllipsis } = getItemsForPages(20, 9);

      expect(items[1]).toHaveTextContent(ELLIPSIS);
      expect(items[items.length - 2]).toHaveTextContent(ELLIPSIS);
      expect(itemsWithEllipsis).toHaveLength(2);
    });
  });
});
