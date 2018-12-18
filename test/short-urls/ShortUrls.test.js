import React from 'react';
import { shallow } from 'enzyme';
import shortUrlsCreator from '../../src/short-urls/ShortUrls';
import Paginator from '../../src/short-urls/Paginator';

describe('<ShortUrls />', () => {
  let wrapper;
  const SearchBar = () => '';
  const ShortUrlsList = () => '';

  beforeEach(() => {
    const params = {
      serverId: '1',
      page: '1',
    };

    const ShortUrls = shortUrlsCreator(SearchBar, ShortUrlsList);

    wrapper = shallow(<ShortUrls match={{ params }} shortUrlsList={{ data: [] }} />);
  });
  afterEach(() => wrapper.unmount());

  it('wraps a SearchBar, ShortUrlsList as Paginator', () => {
    expect(wrapper.find(SearchBar)).toHaveLength(1);
    expect(wrapper.find(ShortUrlsList)).toHaveLength(1);
    expect(wrapper.find(Paginator)).toHaveLength(1);
  });
});
