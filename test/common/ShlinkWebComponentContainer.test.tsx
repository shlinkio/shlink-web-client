import { screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { MemoryRouter } from 'react-router';
import { ShlinkWebComponentContainer } from '../../src/common/ShlinkWebComponentContainer';
import type { NonReachableServer, NotFoundServer, SelectedServer } from '../../src/servers/data';
import { checkAccessibility } from '../__helpers__/accessibility';
import { renderWithStore } from '../__helpers__/setUpTest';

vi.mock('@shlinkio/shlink-web-component', () => ({
  ShlinkSidebarVisibilityProvider: ({ children }: any) => children,
  ShlinkSidebarToggleButton: ({ children }: any) => children,
  ShlinkWebComponent: () => <>ShlinkWebComponent</>,
}));

describe('<ShlinkWebComponentContainer />', () => {
  const setUp = (selectedServer: SelectedServer) => renderWithStore(
    <MemoryRouter>
      <ShlinkWebComponentContainer TagColorsStorage={fromPartial({})} />
    </MemoryRouter>,
    {
      initialState: { selectedServer, servers: {}, settings: {} },
    },
  );

  it('passes a11y checks', () => checkAccessibility(setUp(fromPartial({ version: '3.0.0' }))));

  it('shows loading indicator while loading server', () => {
    setUp(null);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('ShlinkWebComponent')).not.toBeInTheDocument();
  });

  it.each([
    [fromPartial<NotFoundServer>({ serverNotFound: true }), 'Could not find this Shlink server.'],
    [
      fromPartial<NonReachableServer>({ id: 'foo', serverNotReachable: true }),
      /Could not connect to this Shlink server/,
    ],
  ])('shows error for non reachable servers', (selectedServer, expectedError) => {
    setUp(selectedServer);

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.getByText(expectedError)).toBeInTheDocument();
    expect(screen.queryByText('ShlinkWebComponent')).not.toBeInTheDocument();
  });

  it('renders ShlinkWebComponent for reachable servers', () => {
    setUp(fromPartial({ version: '3.0.0' }));

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.getByText('ShlinkWebComponent')).toBeInTheDocument();
  });
});
