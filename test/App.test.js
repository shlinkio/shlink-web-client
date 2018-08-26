import React from 'react';
import { shallow } from 'enzyme';
import { Route } from 'react-router-dom';
import App from '../src/App';
import MainHeader from '../src/common/MainHeader';

describe('<App />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<App />);
  });
  afterEach(() => wrapper.unmount());

  it('renders a header', () => expect(wrapper.find(MainHeader)).toHaveLength(1));

  it('renders app main routes', () => {
    const routes = wrapper.find(Route);
    const expectedRoutesCount = 3;

    expect(routes).toHaveLength(expectedRoutesCount);
    expect(routes.at(0).prop('path')).toEqual('/server/create');
    expect(routes.at(1).prop('path')).toEqual('/');
    expect(routes.at(2).prop('path')).toEqual('/server/:serverId');
  });
});
