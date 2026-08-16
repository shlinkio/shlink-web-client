import type { HttpClient } from '@shlinkio/shlink-js-sdk';
import { fromPartial } from '@total-typescript/shoehorn';
import { MemoryRouter } from 'react-router';
import { App } from '../../src/app/App';
import { ContainerProvider } from '../../src/container/context';
import { checkAccessibility } from '../__helpers__/accessibility';
import { renderWithStore } from '../__helpers__/setUpTest';

vi.mock(import('../../src/common/ShlinkWebComponentContainer'), () => ({
  ShlinkWebComponentContainer: () => <span>ShlinkWebComponentContainer</span>,
}));

describe('<App />', () => {
  const setUp = (activeRoute = '/') =>
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
            abc123: fromPartial({ id: 'abc123', name: 'abc123 server' }),
            def456: fromPartial({ id: 'def456', name: 'def456 server' }),
          },
          settings: fromPartial({}),
          appUpdated: false,
        },
      },
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
    const page = await setUp(activeRoute);
    await expect.element(page.getByText(expectedComponent)).toBeInTheDocument();
  });

  it.each([
    ['/foo', false],
    ['/bar', false],
    ['/', true],
  ])('renders expected classes on shlink-wrapper based on current pathname', async (pathname, isFlex) => {
    const page = await setUp(pathname);
    const shlinkWrapper = page.getByTestId('shlink-wrapper');

    if (isFlex) {
      await expect.element(shlinkWrapper).toHaveClass('flex');
    } else {
      await expect.element(shlinkWrapper).not.toHaveClass('flex');
    }
  });
});
