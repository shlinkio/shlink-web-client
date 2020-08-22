import { identity, values } from 'ramda';
import React from 'react';
import { shallow } from 'enzyme';
import { DropdownItem, DropdownToggle } from 'reactstrap';
import serversDropdownCreator from '../../src/servers/ServersDropdown';

describe('<ServersDropdown />', () => {
  let wrapped;
  let ServersDropdown;
  const servers = {
    '1a': { name: 'foo', id: 1 },
    '2b': { name: 'bar', id: 2 },
    '3c': { name: 'baz', id: 3 },
  };
  const history = {
    push: jest.fn(),
  };

  beforeEach(() => {
    ServersDropdown = serversDropdownCreator({});
    wrapped = shallow(<ServersDropdown servers={servers} listServers={identity} history={history} />);
  });
  afterEach(() => wrapped.unmount());

  it('contains the list of servers, the divider and the export button', () =>
    expect(wrapped.find(DropdownItem)).toHaveLength(values(servers).length + 2));

  it('contains a toggle with proper title', () =>
    expect(wrapped.find(DropdownToggle)).toHaveLength(1));

  it('contains a button to export servers', () => {
    const items = wrapped.find(DropdownItem);

    expect(items.filter('[divider]')).toHaveLength(1);
    expect(items.filter('.servers-dropdown__export-item')).toHaveLength(1);
  });

  it('shows a message when no servers exist yet', () => {
    wrapped = shallow(
      <ServersDropdown servers={{}} listServers={identity} history={history} />,
    );
    const item = wrapped.find(DropdownItem);

    expect(item).toHaveLength(1);
    expect(item.prop('disabled')).toEqual(true);
    expect(item.find('i').text()).toEqual('Add a server first...');
  });
});
