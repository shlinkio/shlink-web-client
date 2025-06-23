import { act, render, screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { MemoryRouter } from 'react-router';
import { AppFactory } from '../../src/app/App';
import { checkAccessibility } from '../__helpers__/accessibility';

describe('<App />', () => {
  const App = AppFactory(
    fromPartial({
      MainHeader: () => <>MainHeader</>,
      Home: () => <>Home</>,
      ShlinkWebComponentContainer: () => <>ShlinkWebComponentContainer</>,
      CreateServer: () => <>CreateServer</>,
      EditServer: () => <>EditServer</>,
      Settings: () => <>SettingsComp</>,
      ManageServers: () => <>ManageServers</>,
      ShlinkVersionsContainer: () => <>ShlinkVersions</>,
    }),
  );
  const setUp = async (activeRoute = '/') => act(() => render(
    <MemoryRouter initialEntries={[{ pathname: activeRoute }]}>
      <App
        fetchServers={() => {}}
        servers={{}}
        settings={fromPartial({})}
        appUpdated={false}
        resetAppUpdate={() => {}}
      />
    </MemoryRouter>,
  ));

  it('passes a11y checks', () => checkAccessibility(setUp()));

  it('renders children components', async () => {
    await setUp();

    expect(screen.getByText('MainHeader')).toBeInTheDocument();
    expect(screen.getByText('ShlinkVersions')).toBeInTheDocument();
  });

  it.each([
    ['/settings/foo', 'SettingsComp'],
    ['/settings/bar', 'SettingsComp'],
    ['/manage-servers', 'ManageServers'],
    ['/server/create', 'CreateServer'],
    ['/server/abc123/edit', 'EditServer'],
    ['/server/def456/edit', 'EditServer'],
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
