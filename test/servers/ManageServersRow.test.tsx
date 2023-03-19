import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { ServerWithId } from '../../src/servers/data';
import { ManageServersRow as createManageServersRow } from '../../src/servers/ManageServersRow';

describe('<ManageServersRow />', () => {
  const ManageServersRow = createManageServersRow(() => <span>ManageServersRowDropdown</span>);
  const server: ServerWithId = {
    name: 'My server',
    url: 'https://example.com',
    apiKey: '123',
    id: 'abc',
  };
  const setUp = (hasAutoConnect = false, autoConnect = false) => render(
    <MemoryRouter>
      <table>
        <tbody>
          <ManageServersRow server={{ ...server, autoConnect }} hasAutoConnect={hasAutoConnect} />
        </tbody>
      </table>
    </MemoryRouter>,
  );

  it.each([
    [true, 4],
    [false, 3],
  ])('renders expected amount of columns', (hasAutoConnect, expectedCols) => {
    setUp(hasAutoConnect);

    const td = screen.getAllByRole('cell');
    const th = screen.getAllByRole('columnheader');

    expect(td.length + th.length).toEqual(expectedCols);
  });

  it('renders a dropdown', () => {
    setUp();
    expect(screen.getByText('ManageServersRowDropdown')).toBeInTheDocument();
  });

  it.each([
    [true],
    [false],
  ])('renders auto-connect icon only if server is autoConnect', (autoConnect) => {
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
