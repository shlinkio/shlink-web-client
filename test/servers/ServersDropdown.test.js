import { identity } from 'ramda';
import React from 'react';
import { ServersDropdown } from '../../src/servers/ServersDropdown';
import { shallow } from 'enzyme';

describe('<ServersDropdown />', () => {
  let wrapped;
  const servers = [{ name: 'foo', id: 1 }, { name: 'bar', id: 2 }, { name: 'baz', id: 3 }];

  beforeEach(() => {
    wrapped = shallow(<ServersDropdown servers={servers} listServers={identity} />);
  });
  afterEach(() => wrapped.unmount());

  it('contains the list of servers', () => {
    expect(wrapped.find('DropdownItem').length).toEqual(servers.length);
  });

  it('contains a toggle with proper title', () => {
    expect(wrapped.find('DropdownToggle').length).toEqual(1);
  });
});
