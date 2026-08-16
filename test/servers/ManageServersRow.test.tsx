import { Table } from '@shlinkio/shlink-frontend-kit';
import { MemoryRouter } from 'react-router';
import { page } from 'vitest/browser';
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
    expect(page.getByRole('cell').elements()).toHaveLength(expectedCols);
  });

  it('renders an options dropdown', async () => {
    setUp();
    await expect.element(page.getByRole('button', { name: 'Options' })).toBeInTheDocument();
  });

  it.each([[true], [false]])('renders auto-connect icon only if server is autoConnect', (autoConnect) => {
    const { container } = setUp(true, autoConnect);
    expect(container).toMatchSnapshot();
  });

  it('renders server props where appropriate', async () => {
    setUp();

    const link = page.getByRole('link');

    await expect.element(link).toHaveAttribute('href', `/server/${server.id}`);
    await expect.element(link).toHaveTextContent(server.name);
    await expect.element(page.getByText(server.url)).toBeInTheDocument();
  });
});
