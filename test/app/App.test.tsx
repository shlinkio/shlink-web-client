import type { HttpClient } from '@shlinkio/shlink-js-sdk';
import { act, screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { MemoryRouter } from 'react-router';
import { App } from '../../src/app/App';
import { ContainerProvider } from '../../src/container/context';
import type { ServerWithId } from '../../src/servers/data';
import { checkAccessibility } from '../__helpers__/accessibility';
import { renderWithStore } from '../__helpers__/setUpTest';

vi.mock(import('../../src/common/ShlinkWebComponentContainer'), () => ({
  ShlinkWebComponentContainer: () => <span>ShlinkWebComponentContainer</span>,
}));

describe('<App />', () => {
  const setUp = async (activeRoute = '/') =>
    act(() =>
      renderWithStore(
        <MemoryRouter initialEntries={[{ pathname: activeRoute }]}>
          <ContainerProvider
            value={fromPartial({
              HttpClient: fromPartial<HttpClient>({}),
              buildShlinkApiClient: vi.fn(),
              useTimeoutToggle: vi.fn().mockReturnValue([false, vi.fn()]),
            })}
          >
            <App />
          </ContainerProvider>
        </MemoryRouter>,
        {
          initialState: {
            servers: {
              abc123: fromPartial<ServerWithId>({ id: 'abc123', name: 'abc123 server' }),
              def456: fromPartial<ServerWithId>({ id: 'def456', name: 'def456 server' }),
            },
            settings: fromPartial({}),
            appUpdated: false,
          },
        },
      ),
    );

  it('passes a11y checks', () => checkAccessibility(setUp()));

  it.each([
    ['/settings/general', 'User interface'],
    ['/settings/short-urls', 'Short URLs form'],
    ['/manage-servers', 'Add a server'],
    ['/server/create', 'Add new server'],
    ['/server/abc123/edit', 'Edit "abc123 server"'],
    ['/server/def456/edit', 'Edit "def456 server"'],
    ['/server/abc123/foo', 'ShlinkWebComponentContainer'],
    ['/server/def456/bar', 'ShlinkWebComponentContainer'],
    ['/other', 'Oops! We could not find requested route.'],
  ])('renders expected route', async (activeRoute, expectedComponent) => {
    await setUp(activeRoute);
    expect(screen.getByText(expectedComponent)).toBeInTheDocument();
  });

  it.each([
    ['/foo', false],
    ['/bar', false],
    ['/', true],
  ])('renders expected classes on shlink-wrapper based on current pathname', async (pathname, isFlex) => {
    await setUp(pathname);
    const shlinkWrapper = screen.getByTestId('shlink-wrapper');

    if (isFlex) {
      expect(shlinkWrapper).toHaveClass('flex');
    } else {
      expect(shlinkWrapper).not.toHaveClass('flex');
    }
  });
});
