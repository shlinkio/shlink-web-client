import { Table } from '@shlinkio/shlink-frontend-kit';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import type { ServerWithId } from '../../src/servers/data';
import { ManageServersRow } from '../../src/servers/ManageServersRow';
import { checkAccessibility } from '../__helpers__/accessibility';
import { renderWithStore } from '../__helpers__/setUpTest';

describe('<ManageServersRow />', () => {
  const server: ServerWithId = {
    name: 'My server',
    url: 'https://example.com',
    apiKey: '123',
    id: 'abc',
  };
  const setUp = (hasAutoConnect = false, autoConnect = false) =>
    renderWithStore(
      <MemoryRouter>
        <Table header={<Table.Row />}>
          <ManageServersRow server={{ ...server, autoConnect }} hasAutoConnect={hasAutoConnect} />
        </Table>
      </MemoryRouter>,
    );

  it('passes a11y checks', () => checkAccessibility(setUp()));

  it.each([
    [true, 4],
    [false, 3],
  ])('renders expected amount of columns', (hasAutoConnect, expectedCols) => {
    setUp(hasAutoConnect);
    expect(screen.getAllByRole('cell')).toHaveLength(expectedCols);
  });

  it('renders an options dropdown', () => {
    setUp();
    expect(screen.getByRole('button', { name: 'Options' })).toBeInTheDocument();
  });

  it.each([[true], [false]])('renders auto-connect icon only if server is autoConnect', (autoConnect) => {
    const { container } = setUp(true, autoConnect);
    expect(container).toMatchSnapshot();
  });

  it('renders server props where appropriate', () => {
    setUp();

    const link = screen.getByRole('link');

    expect(link).toHaveAttribute('href', `/server/${server.id}`);
    expect(link).toHaveTextContent(server.name);
    expect(screen.getByText(server.url)).toBeInTheDocument();
  });
});
