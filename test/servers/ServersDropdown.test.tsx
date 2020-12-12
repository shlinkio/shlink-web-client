import { values } from 'ramda';
import { Mock } from 'ts-mockery';
import { FC } from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { DropdownItem, DropdownToggle } from 'reactstrap';
import serversDropdownCreator, { ServersDropdownProps } from '../../src/servers/ServersDropdown';
import { ServerWithId } from '../../src/servers/data';
import ServersExporter from '../../src/servers/services/ServersExporter';

describe('<ServersDropdown />', () => {
  let wrapped: ShallowWrapper;
  let ServersDropdown: FC<ServersDropdownProps>;
  const servers = {
    '1a': Mock.of<ServerWithId>({ name: 'foo', id: '1a' }),
    '2b': Mock.of<ServerWithId>({ name: 'bar', id: '2b' }),
    '3c': Mock.of<ServerWithId>({ name: 'baz', id: '3c' }),
  };

  beforeEach(() => {
    ServersDropdown = serversDropdownCreator(Mock.of<ServersExporter>());
    wrapped = shallow(<ServersDropdown servers={servers} selectedServer={null} />);
  });
  afterEach(() => wrapped.unmount());

  it('contains the list of servers, the divider, the create button and the export button', () =>
    expect(wrapped.find(DropdownItem)).toHaveLength(values(servers).length + 3));

  it('contains a toggle with proper title', () =>
    expect(wrapped.find(DropdownToggle)).toHaveLength(1));

  it('contains a button to export servers', () => {
    const items = wrapped.find(DropdownItem);

    expect(items.filter('[divider]')).toHaveLength(1);
    expect(items.filter('.servers-dropdown__export-item')).toHaveLength(1);
  });

  it('shows only create link when no servers exist yet', () => {
    wrapped = shallow(
      <ServersDropdown servers={{}} selectedServer={null} />,
    );
    const item = wrapped.find(DropdownItem);

    expect(item).toHaveLength(1);
    expect(item.prop('to')).toEqual('/server/create');
    expect(item.find('span').text()).toContain('Add server');
  });
});
