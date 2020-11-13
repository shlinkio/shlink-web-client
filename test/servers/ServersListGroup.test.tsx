import { shallow, ShallowWrapper } from 'enzyme';
import { ListGroup } from 'reactstrap';
import { Mock } from 'ts-mockery';
import ServersListGroup from '../../src/servers/ServersListGroup';
import { ServerWithId } from '../../src/servers/data';

describe('<ServersListGroup />', () => {
  let wrapped: ShallowWrapper;
  const createComponent = (servers: ServerWithId[]) => {
    wrapped = shallow(<ServersListGroup servers={servers}>The list of servers</ServersListGroup>);

    return wrapped;
  };

  afterEach(() => wrapped?.unmount());

  it('Renders title', () => {
    const wrapped = createComponent([]);
    const title = wrapped.find('h5');

    expect(title).toHaveLength(1);
    expect(title.text()).toEqual('The list of servers');
  });

  it('shows servers list', () => {
    const servers = [
      Mock.of<ServerWithId>({ name: 'foo', id: '123' }),
      Mock.of<ServerWithId>({ name: 'bar', id: '456' }),
    ];
    const wrapped = createComponent(servers);

    expect(wrapped.find(ListGroup)).toHaveLength(1);
    expect(wrapped.find('ServerListItem')).toHaveLength(servers.length);
  });
});
