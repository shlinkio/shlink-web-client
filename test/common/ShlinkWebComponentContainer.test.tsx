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
  const setUp = (selectedServer: SelectedServer) =>
    renderWithStore(
      <MemoryRouter>
        <ShlinkWebComponentContainer TagColorsStorage={fromPartial({})} />
      </MemoryRouter>,
      {
        initialState: { selectedServer, servers: {}, settings: {} },
      },
    );

  it('passes a11y checks', () => checkAccessibility(setUp(fromPartial({ version: '3.0.0' }))));

  it('shows loading indicator while loading server', async () => {
    const screen = await setUp(null);

    await expect.element(screen.getByText('Loading...')).toBeInTheDocument();
    await expect.element(screen.getByText('ShlinkWebComponent')).not.toBeInTheDocument();
  });

  it.each([
    [fromPartial<NotFoundServer>({ serverNotFound: true }), 'Could not find this Shlink server.'],
    [
      fromPartial<NonReachableServer>({ id: 'foo', serverNotReachable: true }),
      /Could not connect to this Shlink server/,
    ],
  ])('shows error for non reachable servers', async (selectedServer, expectedError) => {
    const screen = await setUp(selectedServer);

    await expect.element(screen.getByText('Loading...')).not.toBeInTheDocument();
    await expect.element(screen.getByText(expectedError)).toBeInTheDocument();
    await expect.element(screen.getByText('ShlinkWebComponent')).not.toBeInTheDocument();
  });

  it('renders ShlinkWebComponent for reachable servers', async () => {
    const screen = await setUp(fromPartial({ version: '3.0.0' }));

    await expect.element(screen.getByText('Loading...')).not.toBeInTheDocument();
    await expect.element(screen.getByText('ShlinkWebComponent')).toBeInTheDocument();
  });
});
