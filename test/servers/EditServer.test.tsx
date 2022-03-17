import { mount, ReactWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import { useNavigate } from 'react-router-dom';
import { EditServer as editServerConstruct } from '../../src/servers/EditServer';
import { ServerForm } from '../../src/servers/helpers/ServerForm';
import { ReachableServer } from '../../src/servers/data';

jest.mock('react-router-dom', () => ({ ...jest.requireActual('react-router-dom'), useNavigate: jest.fn() }));

describe('<EditServer />', () => {
  let wrapper: ReactWrapper;
  const ServerError = jest.fn();
  const editServerMock = jest.fn();
  const navigate = jest.fn();
  const selectedServer = Mock.of<ReachableServer>({
    id: 'abc123',
    name: 'name',
    url: 'url',
    apiKey: 'apiKey',
  });
  const EditServer = editServerConstruct(ServerError);

  beforeEach(() => {
    (useNavigate as any).mockReturnValue(navigate);

    wrapper = mount(
      <EditServer editServer={editServerMock} selectedServer={selectedServer} selectServer={jest.fn()} />,
    );
  });

  afterEach(jest.clearAllMocks);
  afterEach(() => wrapper?.unmount());

  it('renders components', () => {
    expect(wrapper.find(ServerForm)).toHaveLength(1);
  });

  it('edits server and redirects to it when form is submitted', () => {
    const form = wrapper.find(ServerForm);

    form.simulate('submit', {});

    expect(editServerMock).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith(-1);
  });
});
