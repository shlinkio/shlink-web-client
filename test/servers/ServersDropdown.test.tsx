import { fromPartial } from '@total-typescript/shoehorn';
import { MemoryRouter } from 'react-router';
import type { ServersMap } from '../../src/servers/data';
import { ServersDropdown } from '../../src/servers/ServersDropdown';
import { checkAccessibility } from '../__helpers__/accessibility';
import { renderWithStore } from '../__helpers__/setUpTest';

describe('<ServersDropdown />', () => {
  const fallbackServers: ServersMap = {
    '1a': fromPartial({ name: 'foo', id: '1a' }),
    '2b': fromPartial({ name: 'bar', id: '2b' }),
    '3c': fromPartial({ name: 'baz', id: '3c' }),
  };
  const setUp = (servers: ServersMap = fallbackServers) =>
    renderWithStore(
      <MemoryRouter>
        <ul role="menu">
          <ServersDropdown />
        </ul>
      </MemoryRouter>,
      {
        initialState: { selectedServer: null, servers },
      },
    );

  it('passes a11y checks', async () => {
    const { user, container, ...screen } = await setUp();
    // Open menu
    await user.click(screen.getByText('Servers'));

    return checkAccessibility({ container });
  });

  it('contains the list of servers and the "mange servers" button', async () => {
    const { user, ...screen } = await setUp();

    await user.click(screen.getByText('Servers'));
    const items = screen.getByRole('menuitem').elements();

    // We have to add two for the "Manage servers" and the "Settings" menu items
    expect(items).toHaveLength(Object.values(fallbackServers).length + 2);
    await expect.element(items[1]).toHaveTextContent('foo');
    await expect.element(items[2]).toHaveTextContent('bar');
    await expect.element(items[3]).toHaveTextContent('baz');
    await expect.element(items[4]).toHaveTextContent('Manage servers');
  });

  it('contains a toggle with proper text', async () => {
    const screen = await setUp();
    await expect.element(screen.getByRole('button')).toHaveTextContent('Servers');
  });

  it('contains a button to manage servers', async () => {
    const { user, ...screen } = await setUp();

    await user.click(screen.getByText('Servers'));
    await expect
      .element(screen.getByRole('menuitem', { name: 'Manage servers' }))
      .toHaveAttribute('href', '/manage-servers');
  });

  it('shows only create link when no servers exist yet', async () => {
    const { user, ...screen } = await setUp({});

    await user.click(screen.getByText('Servers'));
    await expect.element(screen.getByRole('menuitem', { name: 'Add a server' })).toBeInTheDocument();
  });
});
