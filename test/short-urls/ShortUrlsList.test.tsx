import { shallow, ShallowWrapper } from 'enzyme';
import { ReactElement } from 'react';
import { Mock } from 'ts-mockery';
import shortUrlsListCreator, { ShortUrlsListProps } from '../../src/short-urls/ShortUrlsList';
import { ShortUrl } from '../../src/short-urls/data';
import { MercureBoundProps } from '../../src/mercure/helpers/boundToMercureHub';
import { ShortUrlsList as ShortUrlsListModel } from '../../src/short-urls/reducers/shortUrlsList';
import SortingDropdown from '../../src/utils/SortingDropdown';
import { OrderableFields, OrderBy } from '../../src/short-urls/reducers/shortUrlsListParams';
import Paginator from '../../src/short-urls/Paginator';

describe('<ShortUrlsList />', () => {
  let wrapper: ShallowWrapper;
  const ShortUrlsTable = () => null;
  const listShortUrlsMock = jest.fn();
  const resetShortUrlParamsMock = jest.fn();
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
  const ShortUrlsList = shortUrlsListCreator(ShortUrlsTable);
  const createWrapper = (orderBy: OrderBy = {}) => shallow(
    <ShortUrlsList
      {...Mock.all<ShortUrlsListProps>()}
      {...Mock.of<MercureBoundProps>({ mercureInfo: { loading: true } })}
      listShortUrls={listShortUrlsMock}
      resetShortUrlParams={resetShortUrlParamsMock}
      shortUrlsListParams={{
        page: '1',
        tags: [ 'test tag' ],
        searchTerm: 'example.com',
        orderBy,
      }}
      match={{ params: {} } as any}
      location={{} as any}
      shortUrlsList={shortUrlsList}
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
  });

  it('gets list refreshed every time a tag is clicked', () => {
    wrapper.find(ShortUrlsTable).simulate('tagClick', 'foo');
    wrapper.find(ShortUrlsTable).simulate('tagClick', 'bar');
    wrapper.find(ShortUrlsTable).simulate('tagClick', 'baz');

    expect(listShortUrlsMock).toHaveBeenCalledTimes(3);
    expect(listShortUrlsMock).toHaveBeenNthCalledWith(1, expect.objectContaining({
      tags: [ 'test tag', 'foo' ],
    }));
    expect(listShortUrlsMock).toHaveBeenNthCalledWith(2, expect.objectContaining({
      tags: [ 'test tag', 'bar' ],
    }));
    expect(listShortUrlsMock).toHaveBeenNthCalledWith(3, expect.objectContaining({
      tags: [ 'test tag', 'baz' ],
    }));
  });

  it('invokes order icon rendering', () => {
    const renderIcon = (field: OrderableFields) =>
      (wrapper.find(ShortUrlsTable).prop('renderOrderIcon') as (field: OrderableFields) => ReactElement | null)(field);

    expect(renderIcon('visits')).toEqual(undefined);

    wrapper.find(SortingDropdown).simulate('change', 'visits');
    expect(renderIcon('visits')).toEqual(undefined);

    wrapper.find(SortingDropdown).simulate('change', 'visits', 'ASC');
    expect(renderIcon('visits')).not.toEqual(undefined);
  });

  it('handles order by through table', () => {
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

  it('handles order by through dropdown', () => {
    expect(wrapper.find(SortingDropdown).prop('orderField')).not.toBeDefined();
    expect(wrapper.find(SortingDropdown).prop('orderDir')).not.toBeDefined();

    wrapper.find(SortingDropdown).simulate('change', 'visits', 'ASC');

    expect(wrapper.find(SortingDropdown).prop('orderField')).toEqual('visits');
    expect(wrapper.find(SortingDropdown).prop('orderDir')).toEqual('ASC');

    wrapper.find(SortingDropdown).simulate('change', 'shortCode', 'DESC');

    expect(wrapper.find(SortingDropdown).prop('orderField')).toEqual('shortCode');
    expect(wrapper.find(SortingDropdown).prop('orderDir')).toEqual('DESC');

    wrapper.find(SortingDropdown).simulate('change', undefined, undefined);

    expect(wrapper.find(SortingDropdown).prop('orderField')).toEqual(undefined);
    expect(wrapper.find(SortingDropdown).prop('orderDir')).toEqual(undefined);

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
  ])('has expected initial ordering', (initialOrderBy, expectedField, expectedDir) => {
    const wrapper = createWrapper(initialOrderBy);

    expect(wrapper.find(SortingDropdown).prop('orderField')).toEqual(expectedField);
    expect(wrapper.find(SortingDropdown).prop('orderDir')).toEqual(expectedDir);
  });
});
