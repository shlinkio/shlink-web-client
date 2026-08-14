import { screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { MemoryRouter } from 'react-router';
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
  const toggleDropdown = (user: UserEvent) => user.click(screen.getByRole('button'));

  it('passes a11y checks', async () => {
    const { user, container } = setUp();
    // Open menu
    await toggleDropdown(user);

    return checkAccessibility({ container });
  });

  it('renders expected amount of dropdown items', async () => {
    const { user } = setUp();

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    await toggleDropdown(user);
    expect(screen.getByRole('menu')).toBeInTheDocument();

    expect(screen.getAllByRole('menuitem')).toHaveLength(4);
    expect(screen.getByRole('menuitem', { name: 'Connect' })).toHaveAttribute('href', '/server/abc123');
    expect(screen.getByRole('menuitem', { name: 'Edit server' })).toHaveAttribute('href', '/server/abc123/edit');
  });

  it.each([true, false])('allows toggling auto-connect', async (autoConnect) => {
    const { user, store } = setUp(autoConnect);

    await toggleDropdown(user);
    await user.click(screen.getByRole('menuitem', { name: autoConnect ? 'Do not auto-connect' : 'Auto-connect' }));

    expect(Object.values(store.getState().servers)[0].autoConnect).toEqual(!autoConnect);
  });

  it('renders deletion modal', async () => {
    const { user } = setUp();

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await toggleDropdown(user);
    await user.click(screen.getByRole('menuitem', { name: 'Remove server' }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it.each([[true], [false]])('renders expected size and icon', (autoConnect) => {
    const { container } = setUp(autoConnect);
    expect(container).toMatchSnapshot();
  });
});
