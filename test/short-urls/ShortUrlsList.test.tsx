import { shallow, ShallowWrapper } from 'enzyme';
import { ReactElement } from 'react';
import { Mock } from 'ts-mockery';
import { History, Location } from 'history';
import { match } from 'react-router';
import shortUrlsListCreator from '../../src/short-urls/ShortUrlsList';
import { ShortUrlsOrderableFields, ShortUrl, ShortUrlsOrder } from '../../src/short-urls/data';
import { MercureBoundProps } from '../../src/mercure/helpers/boundToMercureHub';
import { ShortUrlsList as ShortUrlsListModel } from '../../src/short-urls/reducers/shortUrlsList';
import { OrderingDropdown } from '../../src/utils/OrderingDropdown';
import Paginator from '../../src/short-urls/Paginator';
import { ReachableServer } from '../../src/servers/data';
import { ShortUrlListRouteParams } from '../../src/short-urls/helpers/hooks';
import { Settings } from '../../src/settings/reducers/settings';

describe('<ShortUrlsList />', () => {
  let wrapper: ShallowWrapper;
  const ShortUrlsTable = () => null;
  const ShortUrlsFilteringBar = () => null;
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
  const ShortUrlsList = shortUrlsListCreator(ShortUrlsTable, ShortUrlsFilteringBar);
  const createWrapper = (defaultOrdering: ShortUrlsOrder = {}) => shallow(
    <ShortUrlsList
      {...Mock.of<MercureBoundProps>({ mercureInfo: { loading: true } })}
      listShortUrls={listShortUrlsMock}
      match={Mock.of<match<ShortUrlListRouteParams>>({ params: {} })}
      location={Mock.of<Location>({ search: '?tags=test%20tag&search=example.com' })}
      shortUrlsList={shortUrlsList}
      history={Mock.of<History>({ push })}
      selectedServer={Mock.of<ReachableServer>({ id: '1' })}
      settings={Mock.of<Settings>({ shortUrlsList: { defaultOrdering } })}
    />,
  ).dive(); // Dive is needed as this component is wrapped in a HOC

  beforeEach(() => {
    wrapper = createWrapper();
  });

  afterEach(jest.resetAllMocks);
  afterEach(() => wrapper?.unmount());

  it('wraps expected components', () => {
    expect(wrapper.find(ShortUrlsTable)).toHaveLength(1);
    expect(wrapper.find(OrderingDropdown)).toHaveLength(1);
    expect(wrapper.find(Paginator)).toHaveLength(1);
    expect(wrapper.find(ShortUrlsFilteringBar)).toHaveLength(1);
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
    const renderIcon = (field: ShortUrlsOrderableFields) =>
      (wrapper.find(ShortUrlsTable).prop('renderOrderIcon') as (field: ShortUrlsOrderableFields) => ReactElement)(field);

    expect(renderIcon('visits').props.currentOrder).toEqual({});

    wrapper.find(OrderingDropdown).simulate('change', 'visits');
    expect(renderIcon('visits').props.currentOrder).toEqual({ field: 'visits' });

    wrapper.find(OrderingDropdown).simulate('change', 'visits', 'ASC');
    expect(renderIcon('visits').props.currentOrder).toEqual({ field: 'visits', dir: 'ASC' });
  });

  it('handles order through table', () => {
    const orderByColumn: (field: ShortUrlsOrderableFields) => Function = wrapper.find(ShortUrlsTable).prop('orderByColumn');

    expect(wrapper.find(OrderingDropdown).prop('order')).toEqual({});

    orderByColumn('visits')();
    expect(wrapper.find(OrderingDropdown).prop('order')).toEqual({ field: 'visits', dir: 'ASC' });

    orderByColumn('title')();
    expect(wrapper.find(OrderingDropdown).prop('order')).toEqual({ field: 'title', dir: 'ASC' });

    orderByColumn('shortCode')();
    expect(wrapper.find(OrderingDropdown).prop('order')).toEqual({ field: 'shortCode', dir: 'ASC' });
  });

  it('handles order through dropdown', () => {
    expect(wrapper.find(OrderingDropdown).prop('order')).toEqual({});

    wrapper.find(OrderingDropdown).simulate('change', 'visits', 'ASC');
    expect(wrapper.find(OrderingDropdown).prop('order')).toEqual({ field: 'visits', dir: 'ASC' });

    wrapper.find(OrderingDropdown).simulate('change', 'shortCode', 'DESC');
    expect(wrapper.find(OrderingDropdown).prop('order')).toEqual({ field: 'shortCode', dir: 'DESC' });

    wrapper.find(OrderingDropdown).simulate('change', undefined, undefined);
    expect(wrapper.find(OrderingDropdown).prop('order')).toEqual({});
  });

  it.each([
    [ Mock.of<ShortUrlsOrder>({ field: 'visits', dir: 'ASC' }), 'visits', 'ASC' ],
    [ Mock.of<ShortUrlsOrder>({ field: 'title', dir: 'DESC' }), 'title', 'DESC' ],
    [ Mock.of<ShortUrlsOrder>(), undefined, undefined ],
  ])('has expected initial ordering', (initialOrderBy, field, dir) => {
    const wrapper = createWrapper(initialOrderBy);

    expect(wrapper.find(OrderingDropdown).prop('order')).toEqual({ field, dir });
  });
});
