import { shallow, ShallowWrapper } from 'enzyme';
import { ListGroup } from 'reactstrap';
import { Mock } from 'ts-mockery';
import ServersListGroup from '../../src/servers/ServersListGroup';
import { ServerWithId } from '../../src/servers/data';

describe('<ServersListGroup />', () => {
  const servers = [
    Mock.of<ServerWithId>({ name: 'foo', id: '123' }),
    Mock.of<ServerWithId>({ name: 'bar', id: '456' }),
  ];
  let wrapped: ShallowWrapper;
  const createComponent = (params: { servers?: ServerWithId[]; withChildren?: boolean; embedded?: boolean }) => {
    const { servers = [], withChildren = true, embedded } = params;

    wrapped = shallow(
      <ServersListGroup servers={servers} embedded={embedded}>
        {withChildren ? 'The list of servers' : undefined}
      </ServersListGroup>,
    );

    return wrapped;
  };

  afterEach(() => wrapped?.unmount());

  it('renders title', () => {
    const wrapped = createComponent({});
    const title = wrapped.find('h5');

    expect(title).toHaveLength(1);
    expect(title.text()).toEqual('The list of servers');
  });

  it('does not render title when children is not provided', () => {
    const wrapped = createComponent({ withChildren: false });
    const title = wrapped.find('h5');

    expect(title).toHaveLength(0);
  });

  it.each([
    [servers],
    [[]],
  ])('shows servers list', (servers) => {
    const wrapped = createComponent({ servers });

    expect(wrapped.find(ListGroup)).toHaveLength(servers.length ? 1 : 0);
    expect(wrapped.find('ServerListItem')).toHaveLength(servers.length);
  });

  it.each([
    [true, 'servers-list__list-group servers-list__list-group--embedded'],
    [false, 'servers-list__list-group'],
    [undefined, 'servers-list__list-group'],
  ])('renders proper classes for embedded', (embedded, expectedClasses) => {
    const wrapped = createComponent({ servers, embedded });
    const listGroup = wrapped.find(ListGroup);

    expect(listGroup.prop('className')).toEqual(expectedClasses);
  });
});
