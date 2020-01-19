import React from 'react';
import { shallow } from 'enzyme';
import each from 'jest-each';
import searchBarCreator from '../../src/short-urls/SearchBar';
import SearchField from '../../src/utils/SearchField';
import Tag from '../../src/tags/helpers/Tag';
import DateRangeRow from '../../src/utils/DateRangeRow';

describe('<SearchBar />', () => {
  let wrapper;
  const listShortUrlsMock = jest.fn();
  const SearchBar = searchBarCreator({});

  afterEach(() => {
    listShortUrlsMock.mockReset();
    wrapper && wrapper.unmount();
  });

  it('renders a SearchField', () => {
    wrapper = shallow(<SearchBar shortUrlsListParams={{}} />);

    expect(wrapper.find(SearchField)).toHaveLength(1);
  });

  each([
    [ '2.0.0', 1 ],
    [ '1.21.2', 1 ],
    [ '1.21.0', 1 ],
    [ '1.20.0', 0 ],
  ]).it('renders a DateRangeRow when proper version is run', (version, expectedLength) => {
    wrapper = shallow(<SearchBar shortUrlsListParams={{}} selectedServer={{ version }} />);

    expect(wrapper.find(DateRangeRow)).toHaveLength(expectedLength);
  });

  it('renders no tags when the list of tags is empty', () => {
    wrapper = shallow(<SearchBar shortUrlsListParams={{}} />);

    expect(wrapper.find(Tag)).toHaveLength(0);
  });

  it('renders the proper amount of tags', () => {
    const tags = [ 'foo', 'bar', 'baz' ];

    wrapper = shallow(<SearchBar shortUrlsListParams={{ tags }} />);

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
      <SearchBar shortUrlsListParams={{ tags: [ 'foo' ] }} listShortUrls={listShortUrlsMock} />
    );
    const tag = wrapper.find(Tag).first();

    expect(listShortUrlsMock).not.toHaveBeenCalled();
    tag.simulate('close');
    expect(listShortUrlsMock).toHaveBeenCalledTimes(1);
  });

  each([ 'startDateChange', 'endDateChange' ]).it('updates short URLs list when date range changes', (event) => {
    wrapper = shallow(
      <SearchBar shortUrlsListParams={{}} listShortUrls={listShortUrlsMock} selectedServer={{ version: '2.0.0' }} />
    );
    const dateRange = wrapper.find(DateRangeRow);

    expect(listShortUrlsMock).not.toHaveBeenCalled();
    dateRange.simulate(event);
    expect(listShortUrlsMock).toHaveBeenCalledTimes(1);
  });
});
