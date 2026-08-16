import { fromPartial } from '@total-typescript/shoehorn';
import { MemoryRouter } from 'react-router';
import { page } from 'vitest/browser';
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
  const toggleDropdown = (user: UserEvent) => user.click(page.getByRole('button'));

  it('passes a11y checks', async () => {
    const { user, container } = setUp();
    // Open menu
    await toggleDropdown(user);

    return checkAccessibility({ container });
  });

  it('renders expected amount of dropdown items', async () => {
    const { user } = setUp();

    await expect.element(page.getByRole('menu')).not.toBeInTheDocument();
    await toggleDropdown(user);
    await expect.element(page.getByRole('menu')).toBeInTheDocument();

    expect(page.getByRole('menuitem').elements()).toHaveLength(4);
    await expect
      .element(page.getByRole('menuitem', { name: 'Connect', exact: true }))
      .toHaveAttribute('href', '/server/abc123');
    await expect
      .element(page.getByRole('menuitem', { name: 'Edit server' }))
      .toHaveAttribute('href', '/server/abc123/edit');
  });

  it.each([true, false])('allows toggling auto-connect', async (autoConnect) => {
    const { user, store } = setUp(autoConnect);

    await toggleDropdown(user);
    await user.click(page.getByRole('menuitem', { name: autoConnect ? 'Do not auto-connect' : 'Auto-connect' }));

    expect(Object.values(store.getState().servers)[0].autoConnect).toEqual(!autoConnect);
  });

  it('renders deletion modal', async () => {
    const { user } = setUp();

    expect(page.getByRole('dialog')).not.toBeInTheDocument();

    await toggleDropdown(user);
    await user.click(page.getByRole('menuitem', { name: 'Remove server' }));

    await expect.element(page.getByRole('dialog')).toBeInTheDocument();
  });

  it.each([[true], [false]])('renders expected size and icon', (autoConnect) => {
    const { container } = setUp(autoConnect);
    expect(container).toMatchSnapshot();
  });
});
