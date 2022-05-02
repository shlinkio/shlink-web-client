import { fireEvent, render, screen } from '@testing-library/react';
import { Mock } from 'ts-mockery';
import { useNavigate } from 'react-router-dom';
import { EditServer as editServerConstruct } from '../../src/servers/EditServer';
import { ReachableServer, SelectedServer } from '../../src/servers/data';

jest.mock('react-router-dom', () => ({ ...jest.requireActual('react-router-dom'), useNavigate: jest.fn() }));

describe('<EditServer />', () => {
  const ServerError = jest.fn();
  const editServerMock = jest.fn();
  const navigate = jest.fn();
  const defaultSelectedServer = Mock.of<ReachableServer>({
    id: 'abc123',
    name: 'the_name',
    url: 'the_url',
    apiKey: 'the_api_key',
  });
  const EditServer = editServerConstruct(ServerError);
  const setUp = (selectedServer: SelectedServer = defaultSelectedServer) => render(
    <EditServer editServer={editServerMock} selectedServer={selectedServer} selectServer={jest.fn()} />,
  );

  beforeEach(() => {
    (useNavigate as any).mockReturnValue(navigate);
  });

  afterEach(jest.clearAllMocks);

  it('renders nothing if selected server is not reachable', () => {
    setUp(Mock.all<SelectedServer>());

    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    expect(screen.queryByText('Save')).not.toBeInTheDocument();
  });

  it('renders server title', () => {
    setUp();
    expect(screen.getByText(`Edit "${defaultSelectedServer.name}"`)).toBeInTheDocument();
  });

  it('display the server info in the form components', () => {
    setUp();

    expect(screen.getByDisplayValue('the_name')).toBeInTheDocument();
    expect(screen.getByDisplayValue('the_url')).toBeInTheDocument();
    expect(screen.getByDisplayValue('the_api_key')).toBeInTheDocument();
  });

  it('edits server and redirects to it when form is submitted', () => {
    setUp();

    fireEvent.change(screen.getByDisplayValue('the_name'), { target: { value: 'the_new_name' } });
    fireEvent.change(screen.getByDisplayValue('the_url'), { target: { value: 'the_new_url' } });
    fireEvent.submit(screen.getByRole('form'));

    expect(editServerMock).toHaveBeenCalledWith('abc123', {
      name: 'the_new_name',
      url: 'the_new_url',
      apiKey: 'the_api_key',
    });
    expect(navigate).toHaveBeenCalledWith(-1);
  });
});
