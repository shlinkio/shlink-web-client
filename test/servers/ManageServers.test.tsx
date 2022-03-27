import { Mock } from 'ts-mockery';
import { shallow, ShallowWrapper } from 'enzyme';
import { Button } from 'reactstrap';
import ServersExporter from '../../src/servers/services/ServersExporter';
import { ManageServers as createManageServers } from '../../src/servers/ManageServers';
import { ServersMap, ServerWithId } from '../../src/servers/data';
import SearchField from '../../src/utils/SearchField';
import { Result } from '../../src/utils/Result';

describe('<ManageServers />', () => {
  const exportServers = jest.fn();
  const serversExporter = Mock.of<ServersExporter>({ exportServers });
  const ImportServersBtn = () => null;
  const ManageServersRow = () => null;
  const useStateFlagTimeout = jest.fn().mockReturnValue([false, jest.fn()]);
  const ManageServers = createManageServers(serversExporter, ImportServersBtn, useStateFlagTimeout, ManageServersRow);
  let wrapper: ShallowWrapper;
  const createServerMock = (value: string, autoConnect = false) => Mock.of<ServerWithId>(
    { id: value, name: value, url: value, autoConnect },
  );
  const createWrapper = (servers: ServersMap = {}) => {
    wrapper = shallow(<ManageServers servers={servers} />);

    return wrapper;
  };

  afterEach(jest.clearAllMocks);
  afterEach(() => wrapper?.unmount());

  it('shows search field which allows searching servers, affecting te amount of rendered rows', () => {
    const wrapper = createWrapper({
      foo: createServerMock('foo'),
      bar: createServerMock('bar'),
      baz: createServerMock('baz'),
    });
    const searchField = wrapper.find(SearchField);

    expect(wrapper.find(ManageServersRow)).toHaveLength(3);
    expect(wrapper.find('tbody').find('tr')).toHaveLength(0);

    searchField.simulate('change', 'foo');
    expect(wrapper.find(ManageServersRow)).toHaveLength(1);
    expect(wrapper.find('tbody').find('tr')).toHaveLength(0);

    searchField.simulate('change', 'ba');
    expect(wrapper.find(ManageServersRow)).toHaveLength(2);
    expect(wrapper.find('tbody').find('tr')).toHaveLength(0);

    searchField.simulate('change', 'invalid');
    expect(wrapper.find(ManageServersRow)).toHaveLength(0);
    expect(wrapper.find('tbody').find('tr')).toHaveLength(1);
  });

  it.each([
    [createServerMock('foo'), 3],
    [createServerMock('foo', true), 4],
  ])('shows different amount of columns if there are at least one auto-connect server', (server, expectedCols) => {
    const wrapper = createWrapper({ server });
    const row = wrapper.find(ManageServersRow);

    expect(wrapper.find('th')).toHaveLength(expectedCols);
    expect(row.prop('hasAutoConnect')).toEqual(server.autoConnect);
  });

  it.each([
    [{}, 1],
    [{ foo: createServerMock('foo') }, 2],
  ])('shows export button if the list of servers is not empty', (servers, expectedButtons) => {
    const wrapper = createWrapper(servers);
    const exportBtn = wrapper.find(Button);

    expect(exportBtn).toHaveLength(expectedButtons);
  });

  it('allows exporting servers when clicking on button', () => {
    const wrapper = createWrapper({ foo: createServerMock('foo') });
    const exportBtn = wrapper.find(Button).first();

    expect(exportServers).not.toHaveBeenCalled();
    exportBtn.simulate('click');
    expect(exportServers).toHaveBeenCalled();
  });

  it('shows an error message if an error occurs while importing servers', () => {
    useStateFlagTimeout.mockReturnValue([true, jest.fn()]);

    const wrapper = createWrapper({ foo: createServerMock('foo') });
    const result = wrapper.find(Result);

    expect(result).toHaveLength(1);
    expect(result.prop('type')).toEqual('error');
  });
});
