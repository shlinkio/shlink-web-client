import React from 'react';
import { shallow } from 'enzyme';
import ShlinkVersions from '../../src/common/ShlinkVersions';

describe('<ShlinkVersions />', () => {
  let wrapper;
  const createWrapper = (props) => {
    wrapper = shallow(<ShlinkVersions {...props} />);

    return wrapper;
  };

  afterEach(() => wrapper && wrapper.unmount());

  it.each([
    [ '1.2.3', 'foo', 'Client: v1.2.3 - Server: foo' ],
    [ 'foo', '1.2.3', 'Client: latest - Server: 1.2.3' ],
    [ 'latest', 'latest', 'Client: latest - Server: latest' ],
    [ '5.5.0', '0.2.8', 'Client: v5.5.0 - Server: 0.2.8' ],
    [ 'not-semver', 'something', 'Client: latest - Server: something' ],
  ])('displays expected versions', (clientVersion, printableVersion, expected) => {
    const wrapper = createWrapper({ clientVersion, selectedServer: { printableVersion } });

    expect(wrapper.text()).toEqual(expected);
  });
});
