import { shallow, ShallowWrapper } from 'enzyme';
import { UncontrolledTooltip } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { ManageServersRow as createManageServersRow } from '../../src/servers/ManageServersRow';
import { ServerWithId } from '../../src/servers/data';

describe('<ManageServersRow />', () => {
  const ManageServersRowDropdown = () => null;
  const ManageServersRow = createManageServersRow(ManageServersRowDropdown);
  const server: ServerWithId = {
    name: 'My server',
    url: 'https://example.com',
    apiKey: '123',
    id: 'abc',
  };
  let wrapper: ShallowWrapper;
  const createWrapper = (hasAutoConnect = false, autoConnect = false) => {
    wrapper = shallow(<ManageServersRow server={{ ...server, autoConnect }} hasAutoConnect={hasAutoConnect} />);

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());

  it.each([
    [true, 4],
    [false, 3],
  ])('renders expected amount of columns', (hasAutoConnect, expectedCols) => {
    const wrapper = createWrapper(hasAutoConnect);
    const td = wrapper.find('td');
    const th = wrapper.find('th');

    expect(td.length + th.length).toEqual(expectedCols);
  });

  it('renders a dropdown', () => {
    const wrapper = createWrapper();
    const dropdown = wrapper.find(ManageServersRowDropdown);

    expect(dropdown).toHaveLength(1);
    expect(dropdown.prop('server')).toEqual(expect.objectContaining(server));
  });

  it.each([
    [true, 1],
    [false, 0],
  ])('renders auto-connect icon only if server is autoConnect', (autoConnect, expectedIcons) => {
    const wrapper = createWrapper(true, autoConnect);
    const icon = wrapper.find(FontAwesomeIcon);
    const iconTooltip = wrapper.find(UncontrolledTooltip);

    expect(icon).toHaveLength(expectedIcons);
    expect(iconTooltip).toHaveLength(expectedIcons);
  });

  it('renders server props where appropriate', () => {
    const wrapper = createWrapper();
    const link = wrapper.find(Link);
    const td = wrapper.find('td').first();

    expect(link.prop('to')).toEqual(`/server/${server.id}`);
    expect(link.prop('children')).toEqual(server.name);
    expect(td.prop('children')).toEqual(server.url);
  });
});
