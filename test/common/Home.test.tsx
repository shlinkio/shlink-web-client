import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Mock } from 'ts-mockery';
import { Home } from '../../src/common/Home';
import type { ServersMap, ServerWithId } from '../../src/servers/data';

describe('<Home />', () => {
  const setUp = (servers: ServersMap = {}) => render(
    <MemoryRouter>
      <Home servers={servers} />
    </MemoryRouter>,
  );

  it('renders title', () => {
    setUp();
    expect(screen.getByRole('heading', { name: 'Welcome!' })).toBeInTheDocument();
  });

  it.each([
    [
      {
        '1a': Mock.of<ServerWithId>({ name: 'foo', id: '1' }),
        '2b': Mock.of<ServerWithId>({ name: 'bar', id: '2' }),
        '3c': Mock.of<ServerWithId>({ name: 'baz', id: '3' }),
      },
      3,
    ],
    [{}, 2],
  ])('shows link to create or set-up server only when no servers exist', (servers, expectedServers) => {
    setUp(servers);
    const links = screen.getAllByRole('link');

    expect(links).toHaveLength(expectedServers);

    if (Object.keys(servers).length === 0) {
      expect(screen.getByText('This application will help you manage your Shlink servers.')).toBeInTheDocument();
      expect(screen.getByText('Learn more about Shlink')).toBeInTheDocument();
    }
  });
});
