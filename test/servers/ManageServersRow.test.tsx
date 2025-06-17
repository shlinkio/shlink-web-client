import { Table } from '@shlinkio/shlink-frontend-kit';
import { render, screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { MemoryRouter } from 'react-router';
import type { ServerWithId } from '../../src/servers/data';
import { ManageServersRowFactory } from '../../src/servers/ManageServersRow';
import { checkAccessibility } from '../__helpers__/accessibility';

describe('<ManageServersRow />', () => {
  const ManageServersRow = ManageServersRowFactory(fromPartial({
    ManageServersRowDropdown: () => <span>ManageServersRowDropdown</span>,
  }));
  const server: ServerWithId = {
    name: 'My server',
    url: 'https://example.com',
    apiKey: '123',
    id: 'abc',
  };
  const setUp = (hasAutoConnect = false, autoConnect = false) => render(
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
