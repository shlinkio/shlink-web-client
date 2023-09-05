import { screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { MemoryRouter } from 'react-router-dom';
import type { ServerWithId } from '../../src/servers/data';
import { ManageServersRowDropdownFactory } from '../../src/servers/ManageServersRowDropdown';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<ManageServersRowDropdown />', () => {
  const ManageServersRowDropdown = ManageServersRowDropdownFactory(fromPartial({
    DeleteServerModal: ({ isOpen }: { isOpen: boolean }) => (
      <span>DeleteServerModal {isOpen ? '[OPEN]' : '[CLOSED]'}</span>
    ),
  }));
  const setAutoConnect = vi.fn();
  const setUp = (autoConnect = false) => {
    const server = fromPartial<ServerWithId>({ id: 'abc123', autoConnect });
    return renderWithEvents(
      <MemoryRouter>
        <ManageServersRowDropdown setAutoConnect={setAutoConnect} server={server} />
      </MemoryRouter>,
    );
  };

  it('renders expected amount of dropdown items', async () => {
    const { user } = setUp();

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('menu')).toBeInTheDocument();

    expect(screen.getAllByRole('menuitem')).toHaveLength(4);
    expect(screen.getByRole('menuitem', { name: 'Connect' })).toHaveAttribute('href', '/server/abc123');
    expect(screen.getByRole('menuitem', { name: 'Edit server' })).toHaveAttribute('href', '/server/abc123/edit');
  });

  it('allows toggling auto-connect', async () => {
    const { user } = setUp();

    expect(setAutoConnect).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button'));
    await user.click(screen.getByRole('menuitem', { name: 'Auto-connect' }));
    expect(setAutoConnect).toHaveBeenCalledWith(expect.objectContaining({ id: 'abc123' }), true);
  });

  it('renders deletion modal', async () => {
    const { user } = setUp();

    expect(screen.queryByText('DeleteServerModal [OPEN]')).not.toBeInTheDocument();
    expect(screen.getByText('DeleteServerModal [CLOSED]')).toBeInTheDocument();

    await user.click(screen.getByRole('button'));
    await user.click(screen.getByRole('menuitem', { name: 'Remove server' }));

    expect(screen.getByText('DeleteServerModal [OPEN]')).toBeInTheDocument();
    expect(screen.queryByText('DeleteServerModal [CLOSED]')).not.toBeInTheDocument();
  });
});
