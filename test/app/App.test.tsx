import { act, render, screen, waitFor } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { MemoryRouter } from 'react-router-dom';
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
        appUpdated
        resetAppUpdate={() => {}}
      />
    </MemoryRouter>,
  ));

  it('passes a11y checks', () => checkAccessibility(setUp()));

  it('renders children components', async () => {
    await setUp();

    expect(screen.getByText('MainHeader')).toBeInTheDocument();
    expect(screen.getByText('ShlinkVersions')).toBeInTheDocument();

    await waitFor(() => screen.getByRole('alert'));
    expect(screen.getByText('This app has just been updated!')).toBeInTheDocument();
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
    ['/foo', 'shlink-wrapper'],
    ['/bar', 'shlink-wrapper'],
    ['/', 'shlink-wrapper d-flex d-md-block align-items-center'],
  ])('renders expected classes on shlink-wrapper based on current pathname', async (pathname, expectedClasses) => {
    const { container } = await setUp(pathname);
    const shlinkWrapper = container.querySelector('.shlink-wrapper');

    expect(shlinkWrapper).toHaveAttribute('class', expectedClasses);
  });
});
