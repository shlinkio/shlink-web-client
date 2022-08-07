import { Mock } from 'ts-mockery';
import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ServersExporter from '../../src/servers/services/ServersExporter';
import { ManageServers as createManageServers } from '../../src/servers/ManageServers';
import { ServersMap, ServerWithId } from '../../src/servers/data';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<ManageServers />', () => {
  const exportServers = jest.fn();
  const serversExporter = Mock.of<ServersExporter>({ exportServers });
  const useTimeoutToggle = jest.fn().mockReturnValue([false, jest.fn()]);
  const ManageServers = createManageServers(
    serversExporter,
    () => <span>ImportServersBtn</span>,
    useTimeoutToggle,
    ({ hasAutoConnect }) => <tr><td>ManageServersRow {hasAutoConnect ? '[YES]' : '[NO]'}</td></tr>,
  );
  const createServerMock = (value: string, autoConnect = false) => Mock.of<ServerWithId>(
    { id: value, name: value, url: value, autoConnect },
  );
  const setUp = (servers: ServersMap = {}) => renderWithEvents(
    <MemoryRouter><ManageServers servers={servers} /></MemoryRouter>,
  );

  afterEach(jest.clearAllMocks);

  it('shows search field which allows searching servers, affecting te amount of rendered rows', async () => {
    const { user } = setUp({
      foo: createServerMock('foo'),
      bar: createServerMock('bar'),
      baz: createServerMock('baz'),
    });
    const search = async (searchTerm: string) => {
      await user.clear(screen.getByPlaceholderText('Search...'));
      await user.type(screen.getByPlaceholderText('Search...'), searchTerm);
    };

    expect(screen.getAllByText(/^ManageServersRow/)).toHaveLength(3);
    expect(screen.queryByText('No servers found.')).not.toBeInTheDocument();

    await search('foo');
    await waitFor(() => expect(screen.getAllByText(/^ManageServersRow/)).toHaveLength(1));
    expect(screen.queryByText('No servers found.')).not.toBeInTheDocument();

    await search('Ba');
    await waitFor(() => expect(screen.getAllByText(/^ManageServersRow/)).toHaveLength(2));
    expect(screen.queryByText('No servers found.')).not.toBeInTheDocument();

    await search('invalid');
    await waitFor(() => expect(screen.queryByText(/^ManageServersRow/)).not.toBeInTheDocument());
    expect(screen.getByText('No servers found.')).toBeInTheDocument();
  });

  it.each([
    [createServerMock('foo'), 3],
    [createServerMock('foo', true), 4],
  ])('shows different amount of columns if there are at least one auto-connect server', (server, expectedCols) => {
    setUp({ server });

    expect(screen.getAllByRole('columnheader')).toHaveLength(expectedCols);
    if (server.autoConnect) {
      expect(screen.getByText(/\[YES\]/)).toBeInTheDocument();
      expect(screen.queryByText(/\[NO\]/)).not.toBeInTheDocument();
    } else {
      expect(screen.queryByText(/\[YES\]/)).not.toBeInTheDocument();
      expect(screen.getByText(/\[NO\]/)).toBeInTheDocument();
    }
  });

  it.each([
    [{}, 0],
    [{ foo: createServerMock('foo') }, 1],
  ])('shows export button if the list of servers is not empty', (servers, expectedButtons) => {
    setUp(servers);
    expect(screen.queryAllByRole('button', { name: 'Export servers' })).toHaveLength(expectedButtons);
  });

  it('allows exporting servers when clicking on button', async () => {
    const { user } = setUp({ foo: createServerMock('foo') });

    expect(exportServers).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Export servers' }));
    expect(exportServers).toHaveBeenCalled();
  });

  it.each([[true], [false]])('shows an error message if an error occurs while importing servers', (hasError) => {
    useTimeoutToggle.mockReturnValue([hasError, jest.fn()]);

    setUp({ foo: createServerMock('foo') });

    if (hasError) {
      expect(
        screen.getByText('The servers could not be imported. Make sure the format is correct.'),
      ).toBeInTheDocument();
    } else {
      expect(
        screen.queryByText('The servers could not be imported. Make sure the format is correct.'),
      ).not.toBeInTheDocument();
    }
  });
});
