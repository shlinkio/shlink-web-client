import React from 'react';
import { shallow } from 'enzyme';
import { ShortUrlsComponent as ShortUrls } from '../../src/short-urls/ShortUrls';
import Paginator from '../../src/short-urls/Paginator';
import ShortUrlsList from '../../src/short-urls/ShortUrlsList';
import SearchBar from '../../src/short-urls/SearchBar';

describe('<ShortUrlsList />', () => {
  let wrapper;

  beforeEach(() => {
    const params = {
      serverId: '1',
      page: '1',
    };

    wrapper = shallow(<ShortUrls match={{ params }} shortUrlsList={{ data: [] }} />);
  });
  afterEach(() => wrapper.unmount());

  it('wraps a SearchBar, ShortUrlsList as Paginator', () => {
    expect(wrapper.find(SearchBar)).toHaveLength(1);
    expect(wrapper.find(ShortUrlsList)).toHaveLength(1);
    expect(wrapper.find(Paginator)).toHaveLength(1);
  });
});
