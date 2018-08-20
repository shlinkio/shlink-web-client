import { identity } from 'ramda';
import React from 'react';
import { ServersDropdown } from '../../src/servers/ServersDropdown';
import { shallow } from 'enzyme';
import { DropdownItem, DropdownToggle } from 'reactstrap';

describe('<ServersDropdown />', () => {
  let wrapped;
  const servers = [{ name: 'foo', id: 1 }, { name: 'bar', id: 2 }, { name: 'baz', id: 3 }];

  beforeEach(() => {
    wrapped = shallow(<ServersDropdown servers={servers} listServers={identity} />);
  });
  afterEach(() => wrapped.unmount());

  it('contains the list of servers', () =>
    expect(wrapped.find(DropdownItem).filter('[to]')).toHaveLength(servers.length)
  );

  it('contains a toggle with proper title', () =>
    expect(wrapped.find(DropdownToggle)).toHaveLength(1)
  );

  it('contains a button to export servers', () => {
    const items = wrapped.find(DropdownItem);
    expect(items.filter('[divider]')).toHaveLength(1);
    expect(items.filter('.servers-dropdown__export-item')).toHaveLength(1);
  });

  it('contains a message when no servers exist yet', () => {
    wrapped = shallow(<ServersDropdown servers={[]} listServers={identity} />);
    const item = wrapped.find(DropdownItem);

    expect(item).toHaveLength(1);
    expect(item.prop('disabled')).toEqual(true);
    expect(item.find('i').text()).toEqual('Add a server first...');
  });
});
