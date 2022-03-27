import { shallow, ShallowWrapper } from 'enzyme';
import { identity } from 'ramda';
import { PaginationItem } from 'reactstrap';
import SimplePaginator from '../../src/common/SimplePaginator';
import { ELLIPSIS } from '../../src/utils/helpers/pagination';

describe('<SimplePaginator />', () => {
  let wrapper: ShallowWrapper;
  const createWrapper = (pagesCount: number, currentPage = 1) => {
    wrapper = shallow(<SimplePaginator pagesCount={pagesCount} currentPage={currentPage} setCurrentPage={identity} />);

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());

  it.each([-3, -2, 0, 1])('renders empty when the amount of pages is smaller than 2', (pagesCount) => {
    expect(createWrapper(pagesCount).text()).toEqual('');
  });

  describe('ELLIPSIS are rendered where expected', () => {
    const getItemsForPages = (pagesCount: number, currentPage: number) => {
      const paginator = createWrapper(pagesCount, currentPage);
      const items = paginator.find(PaginationItem);
      const itemsWithEllipsis = items.filterWhere((item) => item?.key()?.includes(ELLIPSIS));

      return { items, itemsWithEllipsis };
    };

    it('renders first ELLIPSIS', () => {
      const { items, itemsWithEllipsis } = getItemsForPages(9, 7);

      expect(items.at(2).html()).toContain(ELLIPSIS);
      expect(itemsWithEllipsis).toHaveLength(1);
    });

    it('renders last ELLIPSIS', () => {
      const { items, itemsWithEllipsis } = getItemsForPages(9, 2);

      expect(items.at(items.length - 3).html()).toContain(ELLIPSIS);
      expect(itemsWithEllipsis).toHaveLength(1);
    });

    it('renders both ELLIPSIS', () => {
      const { items, itemsWithEllipsis } = getItemsForPages(20, 9);

      expect(items.at(2).html()).toContain(ELLIPSIS);
      expect(items.at(items.length - 3).html()).toContain(ELLIPSIS);
      expect(itemsWithEllipsis).toHaveLength(2);
    });
  });
});
