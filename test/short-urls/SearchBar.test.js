import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import searchBarCreator from '../../src/short-urls/SearchBar';
import SearchField from '../../src/utils/SearchField';
import Tag from '../../src/tags/helpers/Tag';

describe('<SearchBar />', () => {
  let wrapper;
  const listShortUrlsMock = sinon.spy();
  const SearchBar = searchBarCreator({});

  afterEach(() => {
    listShortUrlsMock.resetHistory();

    if (wrapper) {
      wrapper.unmount();
    }
  });

  it('renders a SearchField', () => {
    wrapper = shallow(<SearchBar shortUrlsListParams={{}} />);

    expect(wrapper.find(SearchField)).toHaveLength(1);
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

    expect(listShortUrlsMock.callCount).toEqual(0);
    searchField.simulate('change');
    expect(listShortUrlsMock.callCount).toEqual(1);
  });

  it('updates short URLs list when a tag is removed', () => {
    wrapper = shallow(
      <SearchBar shortUrlsListParams={{ tags: [ 'foo' ] }} listShortUrls={listShortUrlsMock} />
    );
    const tag = wrapper.find(Tag).first();

    expect(listShortUrlsMock.callCount).toEqual(0);
    tag.simulate('close');
    expect(listShortUrlsMock.callCount).toEqual(1);
  });
});
