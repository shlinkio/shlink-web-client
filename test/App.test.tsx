import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Route } from 'react-router-dom';
import { identity } from 'ramda';
import appFactory from '../src/App';

describe('<App />', () => {
  let wrapper: ShallowWrapper;
  const MainHeader = () => null;

  beforeEach(() => {
    const App = appFactory(MainHeader, () => null, () => null, () => null, () => null, () => null, () => null);

    wrapper = shallow(<App fetchServers={identity} servers={{}} />);
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
