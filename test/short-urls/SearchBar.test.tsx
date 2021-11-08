import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import { History, Location } from 'history';
import { match } from 'react-router';
import searchBarCreator, { SearchBarProps } from '../../src/short-urls/SearchBar';
import SearchField from '../../src/utils/SearchField';
import Tag from '../../src/tags/helpers/Tag';
import { DateRangeSelector } from '../../src/utils/dates/DateRangeSelector';
import ColorGenerator from '../../src/utils/services/ColorGenerator';
import { ShortUrlListRouteParams } from '../../src/short-urls/helpers/hooks';

describe('<SearchBar />', () => {
  let wrapper: ShallowWrapper;
  const listShortUrlsMock = jest.fn();
  const SearchBar = searchBarCreator(Mock.all<ColorGenerator>());
  const push = jest.fn();
  const createWrapper = (props: Partial<SearchBarProps> = {}) => {
    wrapper = shallow(
      <SearchBar
        listShortUrls={listShortUrlsMock}
        shortUrlsListParams={{}}
        history={Mock.of<History>({ push })}
        location={Mock.of<Location>({ search: '' })}
        match={Mock.of<match<ShortUrlListRouteParams>>({ params: { serverId: '1' } })}
        {...props}
      />,
    );

    return wrapper;
  };

  afterEach(jest.clearAllMocks);
  afterEach(() => wrapper?.unmount());

  it('renders some children components SearchField', () => {
    const wrapper = createWrapper();

    expect(wrapper.find(SearchField)).toHaveLength(1);
    expect(wrapper.find(DateRangeSelector)).toHaveLength(1);
  });

  it.each([
    [ 'tags=foo,bar,baz', 3 ],
    [ 'tags=foo,baz', 2 ],
    [ '', 0 ],
    [ 'foo=bar', 0 ],
  ])('renders the proper amount of tags', (search, expectedTagComps) => {
    const wrapper = createWrapper({ location: Mock.of<Location>({ search }) });

    expect(wrapper.find(Tag)).toHaveLength(expectedTagComps);
  });

  it('updates short URLs list when search field changes', () => {
    const wrapper = createWrapper();
    const searchField = wrapper.find(SearchField);

    expect(push).not.toHaveBeenCalled();
    searchField.simulate('change', 'search-term');
    expect(push).toHaveBeenCalledWith('/server/1/list-short-urls/1?search=search-term');
  });

  it('updates short URLs list when a tag is removed', () => {
    const wrapper = createWrapper({ location: Mock.of<Location>({ search: 'tags=foo,bar' }) });
    const tag = wrapper.find(Tag).first();

    expect(push).not.toHaveBeenCalled();
    tag.simulate('close');
    expect(push).toHaveBeenCalledWith('/server/1/list-short-urls/1?tags=bar');
  });

  it('updates short URLs list when date range changes', () => {
    const wrapper = createWrapper();
    const dateRange = wrapper.find(DateRangeSelector);

    expect(listShortUrlsMock).not.toHaveBeenCalled();
    dateRange.simulate('datesChange', {});
    expect(listShortUrlsMock).toHaveBeenCalledTimes(1);
  });
});
