import { render, screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { ShlinkWebComponentContainerFactory } from '../../src/common/ShlinkWebComponentContainer';
import type { NonReachableServer, NotFoundServer, SelectedServer } from '../../src/servers/data';
import { checkAccessibility } from '../__helpers__/accessibility';
import { MemoryRouterWithParams } from '../__helpers__/MemoryRouterWithParams';

vi.mock('@shlinkio/shlink-web-component', () => ({
  ShlinkSidebarVisibilityProvider: ({ children }: any) => children,
  ShlinkSidebarToggleButton: ({ children }: any) => children,
  ShlinkWebComponent: () => <>ShlinkWebComponent</>,
}));

describe('<ShlinkWebComponentContainer />', () => {
  const ShlinkWebComponentContainer = ShlinkWebComponentContainerFactory(fromPartial({
    buildShlinkApiClient: vi.fn().mockReturnValue(fromPartial({})),
    TagColorsStorage: fromPartial({}),
    ServerError: () => <>ServerError</>,
  }));
  const setUp = (selectedServer: SelectedServer) => render(
    <MemoryRouterWithParams params={{ serverId: 'abc123' }}>
      <ShlinkWebComponentContainer selectServer={vi.fn()} selectedServer={selectedServer} settings={{}} />
    </MemoryRouterWithParams>,
  );

  it('passes a11y checks', () => checkAccessibility(setUp(fromPartial({ version: '3.0.0' }))));

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
