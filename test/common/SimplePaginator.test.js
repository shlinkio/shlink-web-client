import React from 'react';
import { shallow } from 'enzyme';
import { identity } from 'ramda';
import each from 'jest-each';
import { PaginationItem } from 'reactstrap';
import SimplePaginator, { ellipsis } from '../../src/common/SimplePaginator';

describe('<SimplePaginator />', () => {
  let wrapper;
  const createWrapper = (pagesCount, currentPage = 1) => {
    wrapper = shallow(<SimplePaginator pagesCount={pagesCount} currentPage={currentPage} setCurrentPage={identity} />);

    return wrapper;
  };

  afterEach(() => wrapper && wrapper.unmount());

  each([ -3, -2, 0, 1 ]).it('renders empty when the amount of pages is smaller than 2', (pagesCount) => {
    expect(createWrapper(pagesCount).text()).toEqual('');
  });

  describe('ellipsis are rendered where expected', () => {
    const getItemsForPages = (pagesCount, currentPage) => {
      const paginator = createWrapper(pagesCount, currentPage);
      const items = paginator.find(PaginationItem);
      const itemsWithEllipsis = items.filterWhere((item) => item.key() && item.key().includes(ellipsis));

      return { items, itemsWithEllipsis };
    };

    it('renders first ellipsis', () => {
      const { items, itemsWithEllipsis } = getItemsForPages(9, 7);

      expect(items.at(2).html()).toContain(ellipsis);
      expect(itemsWithEllipsis).toHaveLength(1);
    });

    it('renders last ellipsis', () => {
      const { items, itemsWithEllipsis } = getItemsForPages(9, 2);

      expect(items.at(items.length - 3).html()).toContain(ellipsis);
      expect(itemsWithEllipsis).toHaveLength(1);
    });

    it('renders both ellipsis', () => {
      const { items, itemsWithEllipsis } = getItemsForPages(20, 9);

      expect(items.at(2).html()).toContain(ellipsis);
      expect(items.at(items.length - 3).html()).toContain(ellipsis);
      expect(itemsWithEllipsis).toHaveLength(2);
    });
  });
});
