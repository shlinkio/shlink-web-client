import { shallow, ShallowWrapper } from 'enzyme';
import { ReactElement } from 'react';
import { Mock } from 'ts-mockery';
import { History, Location } from 'history';
import { match } from 'react-router';
import shortUrlsListCreator from '../../src/short-urls/ShortUrlsList';
import { ShortUrl } from '../../src/short-urls/data';
import { MercureBoundProps } from '../../src/mercure/helpers/boundToMercureHub';
import { ShortUrlsList as ShortUrlsListModel } from '../../src/short-urls/reducers/shortUrlsList';
import SortingDropdown from '../../src/utils/SortingDropdown';
import { OrderableFields, OrderBy } from '../../src/short-urls/reducers/shortUrlsListParams';
import Paginator from '../../src/short-urls/Paginator';
import { ReachableServer } from '../../src/servers/data';
import { ShortUrlListRouteParams } from '../../src/short-urls/helpers/hooks';

describe('<ShortUrlsList />', () => {
  let wrapper: ShallowWrapper;
  const ShortUrlsTable = () => null;
  const SearchBar = () => null;
  const listShortUrlsMock = jest.fn();
  const push = jest.fn();
  const shortUrlsList = Mock.of<ShortUrlsListModel>({
    shortUrls: {
      data: [
        Mock.of<ShortUrl>({
          shortCode: 'testShortCode',
          shortUrl: 'https://www.example.com/testShortUrl',
          longUrl: 'https://www.example.com/testLongUrl',
          tags: [ 'test tag' ],
        }),
      ],
    },
  });
  const ShortUrlsList = shortUrlsListCreator(ShortUrlsTable, SearchBar);
  const createWrapper = (orderBy: OrderBy = {}) => shallow(
    <ShortUrlsList
      {...Mock.of<MercureBoundProps>({ mercureInfo: { loading: true } })}
      listShortUrls={listShortUrlsMock}
      resetShortUrlParams={jest.fn()}
      shortUrlsListParams={{ page: '1', orderBy }}
      match={Mock.of<match<ShortUrlListRouteParams>>({ params: {} })}
      location={Mock.of<Location>({ search: '?tags=test%20tag&search=example.com' })}
      shortUrlsList={shortUrlsList}
      history={Mock.of<History>({ push })}
      selectedServer={Mock.of<ReachableServer>({ id: '1' })}
    />,
  ).dive(); // Dive is needed as this component is wrapped in a HOC

  beforeEach(() => {
    wrapper = createWrapper();
  });

  afterEach(jest.resetAllMocks);
  afterEach(() => wrapper?.unmount());

  it('wraps expected components', () => {
    expect(wrapper.find(ShortUrlsTable)).toHaveLength(1);
    expect(wrapper.find(SortingDropdown)).toHaveLength(1);
    expect(wrapper.find(Paginator)).toHaveLength(1);
    expect(wrapper.find(SearchBar)).toHaveLength(1);
  });

  it('passes current query to paginator', () => {
    expect(wrapper.find(Paginator).prop('currentQueryString')).toEqual('?tags=test%20tag&search=example.com');
  });

  it('gets list refreshed every time a tag is clicked', () => {
    wrapper.find(ShortUrlsTable).simulate('tagClick', 'foo');
    wrapper.find(ShortUrlsTable).simulate('tagClick', 'bar');
    wrapper.find(ShortUrlsTable).simulate('tagClick', 'baz');

    expect(push).toHaveBeenCalledTimes(3);
    expect(push).toHaveBeenNthCalledWith(1, expect.stringContaining(`tags=${encodeURIComponent('test tag,foo')}`));
    expect(push).toHaveBeenNthCalledWith(2, expect.stringContaining(`tags=${encodeURIComponent('test tag,bar')}`));
    expect(push).toHaveBeenNthCalledWith(3, expect.stringContaining(`tags=${encodeURIComponent('test tag,baz')}`));
  });

  it('invokes order icon rendering', () => {
    const renderIcon = (field: OrderableFields) =>
      (wrapper.find(ShortUrlsTable).prop('renderOrderIcon') as (field: OrderableFields) => ReactElement)(field);

    expect(renderIcon('visits').props.currentOrder).toEqual({});

    wrapper.find(SortingDropdown).simulate('change', 'visits');
    expect(renderIcon('visits').props.currentOrder).toEqual({ field: 'visits' });

    wrapper.find(SortingDropdown).simulate('change', 'visits', 'ASC');
    expect(renderIcon('visits').props.currentOrder).toEqual({ field: 'visits', dir: 'ASC' });
  });

  it('handles order through table', () => {
    const orderByColumn: (field: OrderableFields) => Function = wrapper.find(ShortUrlsTable).prop('orderByColumn');

    orderByColumn('visits')();
    orderByColumn('title')();
    orderByColumn('shortCode')();

    expect(listShortUrlsMock).toHaveBeenCalledTimes(3);
    expect(listShortUrlsMock).toHaveBeenNthCalledWith(1, expect.objectContaining({
      orderBy: { visits: 'ASC' },
    }));
    expect(listShortUrlsMock).toHaveBeenNthCalledWith(2, expect.objectContaining({
      orderBy: { title: 'ASC' },
    }));
    expect(listShortUrlsMock).toHaveBeenNthCalledWith(3, expect.objectContaining({
      orderBy: { shortCode: 'ASC' },
    }));
  });

  it('handles order through dropdown', () => {
    expect(wrapper.find(SortingDropdown).prop('order')).toEqual({});

    wrapper.find(SortingDropdown).simulate('change', 'visits', 'ASC');
    expect(wrapper.find(SortingDropdown).prop('order')).toEqual({ field: 'visits', dir: 'ASC' });

    wrapper.find(SortingDropdown).simulate('change', 'shortCode', 'DESC');
    expect(wrapper.find(SortingDropdown).prop('order')).toEqual({ field: 'shortCode', dir: 'DESC' });

    wrapper.find(SortingDropdown).simulate('change', undefined, undefined);
    expect(wrapper.find(SortingDropdown).prop('order')).toEqual({});

    expect(listShortUrlsMock).toHaveBeenCalledTimes(3);
    expect(listShortUrlsMock).toHaveBeenNthCalledWith(1, expect.objectContaining({
      orderBy: { visits: 'ASC' },
    }));
    expect(listShortUrlsMock).toHaveBeenNthCalledWith(2, expect.objectContaining({
      orderBy: { shortCode: 'DESC' },
    }));
    expect(listShortUrlsMock).toHaveBeenNthCalledWith(3, expect.objectContaining({ orderBy: undefined }));
  });

  it.each([
    [ Mock.of<OrderBy>({ visits: 'ASC' }), 'visits', 'ASC' ],
    [ Mock.of<OrderBy>({ title: 'DESC' }), 'title', 'DESC' ],
    [ Mock.of<OrderBy>(), undefined, undefined ],
  ])('has expected initial ordering', (initialOrderBy, field, dir) => {
    const wrapper = createWrapper(initialOrderBy);

    expect(wrapper.find(SortingDropdown).prop('order')).toEqual({ field, dir });
  });
});
