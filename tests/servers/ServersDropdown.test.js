import React from 'react';
import { ServersDropdown } from '../../src/servers/ServersDropdown';
import { shallow } from 'enzyme';

describe('ServersDropdown', () => {
  let wrapped;
  const servers = [{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }];

  beforeEach(() => {
    wrapped = shallow(<ServersDropdown servers={servers} />);
  });
  afterEach(() => {
    wrapped.unmount();
  });

  it('contains the list of servers', () => {
    expect(wrapped.find('DropdownItem').length).toEqual(servers.length);
  });

  it('contains a toggle with proper title', () => {
    expect(wrapped.find('DropdownToggle').length).toEqual(1);
  });
});
