import { render, screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { useParams } from 'react-router-dom';
import { ShlinkWebComponentContainer as createContainer } from '../../src/common/ShlinkWebComponentContainer';
import type { NonReachableServer, NotFoundServer, SelectedServer } from '../../src/servers/data';

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useParams: vi.fn(),
}));

describe('<ShlinkWebComponentContainer />', () => {
  const ShlinkWebComponentContainer = createContainer(
    vi.fn().mockReturnValue(fromPartial({})),
    () => <>ShlinkWebComponent</>,
    () => <>ServerError</>,
  );
  const setUp = (selectedServer: SelectedServer) => render(
    <ShlinkWebComponentContainer
      sidebarNotPresent={vi.fn()}
      sidebarPresent={vi.fn()}
      selectServer={vi.fn()}
      selectedServer={selectedServer}
      settings={{}}
    />,
  );

  beforeEach(() => {
    (useParams as any).mockReturnValue({ serverId: 'abc123' });
  });

  it('shows loading indicator while loading server', () => {
    setUp(null);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('ServerError')).not.toBeInTheDocument();
    expect(screen.queryByText('ShlinkWebComponent')).not.toBeInTheDocument();
  });

  it.each([
    [fromPartial<NotFoundServer>({ serverNotFound: true })],
    [fromPartial<NonReachableServer>({ serverNotReachable: true })],
  ])('shows error for non reachable servers', (selectedServer) => {
    setUp(selectedServer);

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.getByText('ServerError')).toBeInTheDocument();
    expect(screen.queryByText('ShlinkWebComponent')).not.toBeInTheDocument();
  });

  it('renders ShlinkWebComponent for reachable servers', () => {
    setUp(fromPartial({ version: '3.0.0' }));

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.queryByText('ServerError')).not.toBeInTheDocument();
    expect(screen.getByText('ShlinkWebComponent')).toBeInTheDocument();
  });
});
