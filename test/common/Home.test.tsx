import { fromPartial } from '@total-typescript/shoehorn';
import { MemoryRouter } from 'react-router';
import { page } from 'vitest/browser';
import { Home } from '../../src/common/Home';
import type { ServersMap, ServerWithId } from '../../src/servers/data';
import { checkAccessibility } from '../__helpers__/accessibility';
import { renderWithStore } from '../__helpers__/setUpTest';

describe('<Home />', () => {
  const setUp = (servers: ServersMap = {}) =>
    renderWithStore(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
      {
        initialState: { servers },
      },
    );

  it('passes a11y checks', () =>
    checkAccessibility(setUp({ '1a': fromPartial<ServerWithId>({ name: 'foo', id: '1' }) })));

  it('renders title', async () => {
    setUp();
    await expect.element(page.getByRole('heading', { name: 'Welcome!' })).toBeInTheDocument();
  });

  it.each([
    [
      {
        '1a': fromPartial<ServerWithId>({ name: 'foo', id: '1' }),
        '2b': fromPartial<ServerWithId>({ name: 'bar', id: '2' }),
        '3c': fromPartial<ServerWithId>({ name: 'baz', id: '3' }),
      },
      3,
    ],
    [{}, 2],
  ])('shows link to create or set-up server only when no servers exist', async (servers, expectedServers) => {
    setUp(servers);
    const links = page.getByRole('link').elements();

    expect(links).toHaveLength(expectedServers);

    if (Object.keys(servers).length === 0) {
      await expect
        .element(page.getByText('This application will help you manage your Shlink servers.'))
        .toBeInTheDocument();
      await expect.element(page.getByText('Learn more about Shlink')).toBeInTheDocument();
    }
  });
});
