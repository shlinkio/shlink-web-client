import React from 'react';
import { shallow } from 'enzyme';
import { Route } from 'react-router-dom';
import { identity } from 'ramda';
import appFactory from '../src/App';

describe('<App />', () => {
  let wrapper;
  const MainHeader = () => '';

  beforeEach(() => {
    const App = appFactory(MainHeader, identity, identity, identity);

    wrapper = shallow(<App />);
  });
  afterEach(() => wrapper.unmount());

  it('renders a header', () => expect(wrapper.find(MainHeader)).toHaveLength(1));

  it('renders app main routes', () => {
    const routes = wrapper.find(Route);
    const expectedRoutesCount = 3;
    const second = 2;

    expect(routes).toHaveLength(expectedRoutesCount);
    expect(routes.at(0).prop('path')).toEqual('/server/create');
    expect(routes.at(1).prop('path')).toEqual('/');
    expect(routes.at(second).prop('path')).toEqual('/server/:serverId');
  });
});
