import { fireEvent, screen } from '@testing-library/react';
import { Mock } from 'ts-mockery';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { EditServer as editServerConstruct } from '../../src/servers/EditServer';
import { ReachableServer, SelectedServer } from '../../src/servers/data';
import { renderWithEvents } from '../__helpers__/setUpTest';

vi.mock('react-router-dom', () => ({ ...jest.requireActual('react-router-dom'), useNavigate: vi.fn() }));

describe('<EditServer />', () => {
  const ServerError = vi.fn();
  const editServerMock = vi.fn();
  const navigate = vi.fn();
  const defaultSelectedServer = Mock.of<ReachableServer>({
    id: 'abc123',
    name: 'the_name',
    url: 'the_url',
    apiKey: 'the_api_key',
  });
  const EditServer = editServerConstruct(ServerError);
  const setUp = (selectedServer: SelectedServer = defaultSelectedServer) => renderWithEvents(
    <MemoryRouter>
      <EditServer editServer={editServerMock} selectedServer={selectedServer} selectServer={vi.fn()} />
    </MemoryRouter>,
  );

  beforeEach(() => {
    (useNavigate as any).mockReturnValue(navigate);
  });

  afterEach(vi.clearAllMocks);

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

  it('edits server and redirects to it when form is submitted', async () => {
    const { user } = setUp();

    await user.type(screen.getByDisplayValue('the_name'), ' edited');
    await user.type(screen.getByDisplayValue('the_url'), ' edited');
    // TODO Using fire event because userEvent.click on the Submit button does not submit the form
    // await user.click(screen.getByRole('button', { name: 'Save' }));
    fireEvent.submit(screen.getByRole('form'));

    expect(editServerMock).toHaveBeenCalledWith('abc123', {
      name: 'the_name edited',
      url: 'the_url edited',
      apiKey: 'the_api_key',
    });
    expect(navigate).toHaveBeenCalledWith(-1);
  });
});
