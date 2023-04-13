import { screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { values } from 'ramda';
import { MemoryRouter } from 'react-router-dom';
import type { ServersMap } from '../../src/servers/data';
import { ServersDropdown } from '../../src/servers/ServersDropdown';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<ServersDropdown />', () => {
  const fallbackServers: ServersMap = {
    '1a': fromPartial({ name: 'foo', id: '1a' }),
    '2b': fromPartial({ name: 'bar', id: '2b' }),
    '3c': fromPartial({ name: 'baz', id: '3c' }),
  };
  const setUp = (servers: ServersMap = fallbackServers) => renderWithEvents(
    <MemoryRouter><ServersDropdown servers={servers} selectedServer={null} /></MemoryRouter>,
  );

  it('contains the list of servers and the "mange servers" button', async () => {
    const { user } = setUp();

    await user.click(screen.getByText('Servers'));
    const items = screen.getAllByRole('menuitem');
    expect(items).toHaveLength(values(fallbackServers).length + 1);
    expect(items[0]).toHaveTextContent('foo');
    expect(items[1]).toHaveTextContent('bar');
    expect(items[2]).toHaveTextContent('baz');
    expect(items[3]).toHaveTextContent('Manage servers');
  });

  it('contains a toggle with proper text', () => {
    setUp();
    expect(screen.getByRole('link')).toHaveTextContent('Servers');
  });

  it('contains a button to manage servers', async () => {
    const { user } = setUp();

    await user.click(screen.getByText('Servers'));
    expect(screen.getByRole('menuitem', { name: 'Manage servers' })).toHaveAttribute('href', '/manage-servers');
  });

  it('shows only create link when no servers exist yet', async () => {
    const { user } = setUp({});

    await user.click(screen.getByText('Servers'));
    expect(screen.getByRole('menuitem')).toHaveTextContent('Add a server');
  });
});
