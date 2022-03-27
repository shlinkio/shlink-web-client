import { shallow, ShallowWrapper } from 'enzyme';
import { PaginationItem, PaginationLink } from 'reactstrap';
import { Mock } from 'ts-mockery';
import Paginator from '../../src/short-urls/Paginator';
import { ShlinkPaginator } from '../../src/api/types';
import { ELLIPSIS } from '../../src/utils/helpers/pagination';

describe('<Paginator />', () => {
  let wrapper: ShallowWrapper;
  const buildPaginator = (pagesCount?: number) => Mock.of<ShlinkPaginator>({ pagesCount, currentPage: 1 });

  afterEach(() => wrapper?.unmount());

  it.each([
    [undefined],
    [buildPaginator()],
    [buildPaginator(0)],
    [buildPaginator(1)],
  ])('renders nothing if the number of pages is below 2', (paginator) => {
    wrapper = shallow(<Paginator serverId="abc123" paginator={paginator} />);
    expect(wrapper.text()).toEqual('');
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
    wrapper = shallow(<Paginator serverId="abc123" paginator={paginator} />);
    const items = wrapper.find(PaginationItem);
    const ellipsis = items.filterWhere((item) => item.find(PaginationLink).prop('children') === ELLIPSIS);

    expect(items).toHaveLength(expectedPages);
    expect(ellipsis).toHaveLength(expectedEllipsis);
  });

  it('appends query string to all pages', () => {
    const paginator = buildPaginator(3);
    const currentQueryString = '?foo=bar';

    wrapper = shallow(<Paginator serverId="abc123" paginator={paginator} currentQueryString={currentQueryString} />);
    const links = wrapper.find(PaginationLink);

    expect(links).toHaveLength(5);
    links.forEach((link) => expect(link.prop('to')).toContain(currentQueryString));
  });
});
