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
    [ '1.2.3', 'foo', 'v1.2.3', 'foo' ],
    [ 'foo', '1.2.3', 'latest', '1.2.3' ],
    [ 'latest', 'latest', 'latest', 'latest' ],
    [ '5.5.0', '0.2.8', 'v5.5.0', '0.2.8' ],
    [ 'not-semver', 'something', 'latest', 'something' ],
  ])('displays expected versions', (clientVersion, printableVersion, expectedClientVersion, expectedServerVersion) => {
    const wrapper = createWrapper({ clientVersion, selectedServer: { printableVersion } });
    const links = wrapper.find('VersionLink');
    const clientLink = links.at(0);
    const serverLink = links.at(1);

    expect(clientLink.prop("project")).toEqual('shlink-web-client');
    expect(clientLink.prop("version")).toEqual(expectedClientVersion);
    expect(serverLink.prop("project")).toEqual('shlink');
    expect(serverLink.prop("version")).toEqual(expectedServerVersion);
  });
});
