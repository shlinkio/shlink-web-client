import { mount, ReactWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import { History, Location } from 'history';
import { match } from 'react-router'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { EditServer as editServerConstruct } from '../../src/servers/EditServer';
import { ServerForm } from '../../src/servers/helpers/ServerForm';
import { ReachableServer } from '../../src/servers/data';

describe('<EditServer />', () => {
  let wrapper: ReactWrapper;
  const ServerError = jest.fn();
  const editServerMock = jest.fn();
  const push = jest.fn();
  const historyMock = Mock.of<History>({ push });
  const match = Mock.of<match<{ serverId: string }>>({
    params: { serverId: 'abc123' },
  });
  const selectedServer = Mock.of<ReachableServer>({
    id: 'abc123',
    name: 'name',
    url: 'url',
    apiKey: 'apiKey',
  });

  beforeEach(() => {
    const EditServer = editServerConstruct(ServerError);

    wrapper = mount(
      <EditServer
        editServer={editServerMock}
        history={historyMock}
        match={match}
        location={Mock.all<Location>()}
        selectedServer={selectedServer}
        selectServer={jest.fn()}
      />,
    );
  });

  afterEach(jest.resetAllMocks);
  afterEach(() => wrapper?.unmount());

  it('renders components', () => {
    expect(wrapper.find(ServerForm)).toHaveLength(1);
  });

  it('edits server and redirects to it when form is submitted', () => {
    const form = wrapper.find(ServerForm);

    form.simulate('submit', {});

    expect(editServerMock).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledTimes(1);
  });
});
