import { shallow } from 'enzyme';
import React from 'react';
import { ListGroup } from 'reactstrap';
import ServersListGroup from '../../src/servers/ServersListGroup';

describe('<ServersListGroup />', () => {
  let wrapped;
  const createComponent = (servers) => {
    wrapped = shallow(<ServersListGroup servers={servers}>The list of servers</ServersListGroup>);

    return wrapped;
  };

  afterEach(() => wrapped && wrapped.unmount());

  it('Renders title', () => {
    const wrapped = createComponent([]);
    const title = wrapped.find('h5');

    expect(title).toHaveLength(1);
    expect(title.text()).toEqual('The list of servers');
  });

  it('shows servers list', () => {
    const servers = [
      { name: 'foo', id: '123' },
      { name: 'bar', id: '456' },
    ];
    const wrapped = createComponent(servers);

    expect(wrapped.find(ListGroup)).toHaveLength(1);
    expect(wrapped.find('ServerListItem')).toHaveLength(servers.length);
  });
});
