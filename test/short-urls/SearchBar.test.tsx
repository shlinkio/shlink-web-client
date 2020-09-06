import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import searchBarCreator from '../../src/short-urls/SearchBar';
import SearchField from '../../src/utils/SearchField';
import Tag from '../../src/tags/helpers/Tag';
import DateRangeRow from '../../src/utils/DateRangeRow';
import ColorGenerator from '../../src/utils/services/ColorGenerator';

describe('<SearchBar />', () => {
  let wrapper: ShallowWrapper;
  const listShortUrlsMock = jest.fn();
  const SearchBar = searchBarCreator(Mock.all<ColorGenerator>(), () => null);

  afterEach(jest.clearAllMocks);
  afterEach(() => wrapper?.unmount());

  it('renders a SearchField', () => {
    wrapper = shallow(<SearchBar shortUrlsListParams={{}} listShortUrls={listShortUrlsMock} />);

    expect(wrapper.find(SearchField)).toHaveLength(1);
  });

  it('renders a DateRangeRow', () => {
    wrapper = shallow(<SearchBar shortUrlsListParams={{}} listShortUrls={listShortUrlsMock} />);

    expect(wrapper.find(DateRangeRow)).toHaveLength(1);
  });

  it('renders no tags when the list of tags is empty', () => {
    wrapper = shallow(<SearchBar shortUrlsListParams={{}} listShortUrls={listShortUrlsMock} />);

    expect(wrapper.find(Tag)).toHaveLength(0);
  });

  it('renders the proper amount of tags', () => {
    const tags = [ 'foo', 'bar', 'baz' ];

    wrapper = shallow(<SearchBar shortUrlsListParams={{ tags }} listShortUrls={listShortUrlsMock} />);

    expect(wrapper.find(Tag)).toHaveLength(tags.length);
  });

  it('updates short URLs list when search field changes', () => {
    wrapper = shallow(<SearchBar shortUrlsListParams={{}} listShortUrls={listShortUrlsMock} />);
    const searchField = wrapper.find(SearchField);

    expect(listShortUrlsMock).not.toHaveBeenCalled();
    searchField.simulate('change');
    expect(listShortUrlsMock).toHaveBeenCalledTimes(1);
  });

  it('updates short URLs list when a tag is removed', () => {
    wrapper = shallow(
      <SearchBar shortUrlsListParams={{ tags: [ 'foo' ] }} listShortUrls={listShortUrlsMock} />,
    );
    const tag = wrapper.find(Tag).first();

    expect(listShortUrlsMock).not.toHaveBeenCalled();
    tag.simulate('close');
    expect(listShortUrlsMock).toHaveBeenCalledTimes(1);
  });

  it.each([ 'startDateChange', 'endDateChange' ])('updates short URLs list when date range changes', (event) => {
    wrapper = shallow(
      <SearchBar shortUrlsListParams={{}} listShortUrls={listShortUrlsMock} />,
    );
    const dateRange = wrapper.find(DateRangeRow);

    expect(listShortUrlsMock).not.toHaveBeenCalled();
    dateRange.simulate(event);
    expect(listShortUrlsMock).toHaveBeenCalledTimes(1);
  });
});
