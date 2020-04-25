import React from 'react';
import { shallow } from 'enzyme';
import { Route } from 'react-router-dom';
import { identity } from 'ramda';
import appFactory from '../src/App';

describe('<App />', () => {
  let wrapper;
  const MainHeader = () => '';

  beforeEach(() => {
    const App = appFactory(MainHeader, identity, identity, identity, identity);

    wrapper = shallow(<App />);
  });
  afterEach(() => wrapper.unmount());

  it('renders a header', () => expect(wrapper.find(MainHeader)).toHaveLength(1));

  it('renders app main routes', () => {
    const routes = wrapper.find(Route);
    const expectedPaths = [
      '/',
      '/settings',
      '/server/create',
      '/server/:serverId/edit',
      '/server/:serverId',
    ];

    expect.assertions(expectedPaths.length + 1);
    expect(routes).toHaveLength(expectedPaths.length + 1);
    expectedPaths.forEach((path, index) => {
      expect(routes.at(index).prop('path')).toEqual(path);
    });
  });
});
