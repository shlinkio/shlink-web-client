import { fromPartial } from '@total-typescript/shoehorn';
import { MemoryRouter } from 'react-router';
import type { RenderResult } from 'vitest-browser-react';
import type { UserEvent } from 'vitest/browser';
import type { ServerWithId } from '../../src/servers/data';
import { ManageServersRowDropdown } from '../../src/servers/ManageServersRowDropdown';
import { checkAccessibility } from '../__helpers__/accessibility';
import { renderWithStore } from '../__helpers__/setUpTest';

describe('<ManageServersRowDropdown />', () => {
  const setUp = (autoConnect = false) => {
    const server = fromPartial<ServerWithId>({ id: 'abc123', autoConnect });
    return renderWithStore(
      <MemoryRouter>
        <ManageServersRowDropdown server={server} />
      </MemoryRouter>,
      {
        initialState: {
          servers: { [server.id]: server },
        },
      },
    );
  };
  const toggleDropdown = (user: UserEvent, screen: RenderResult) => user.click(screen.getByRole('button'));

  it('passes a11y checks', async () => {
    const { user, ...screen } = await setUp();
    // Open menu
    await toggleDropdown(user, screen);

    return checkAccessibility(screen);
  });

  it('renders expected amount of dropdown items', async () => {
    const { user, ...screen } = await setUp();

    await expect.element(screen.getByRole('menu')).not.toBeInTheDocument();
    await toggleDropdown(user, screen);
    await expect.element(screen.getByRole('menu')).toBeInTheDocument();

    expect(screen.getByRole('menuitem').elements()).toHaveLength(4);
    await expect
      .element(screen.getByRole('menuitem', { name: 'Connect', exact: true }))
      .toHaveAttribute('href', '/server/abc123');
    await expect
      .element(screen.getByRole('menuitem', { name: 'Edit server' }))
      .toHaveAttribute('href', '/server/abc123/edit');
  });

  it.each([true, false])('allows toggling auto-connect', async (autoConnect) => {
    const { user, store, ...screen } = await setUp(autoConnect);

    await toggleDropdown(user, screen);
    await user.click(screen.getByRole('menuitem', { name: autoConnect ? 'Do not auto-connect' : 'Auto-connect' }));

    expect(Object.values(store.getState().servers)[0].autoConnect).toEqual(!autoConnect);
  });

  it('renders deletion modal', async () => {
    const { user, ...screen } = await setUp();

    expect(screen.getByRole('dialog')).not.toBeInTheDocument();

    await toggleDropdown(user, screen);
    await user.click(screen.getByRole('menuitem', { name: 'Remove server' }));

    await expect.element(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it.each([[true], [false]])('renders expected size and icon', async (autoConnect) => {
    const { container } = await setUp(autoConnect);
    expect(container).toMatchSnapshot();
  });
});
