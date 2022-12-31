import { render, screen } from '@testing-library/react';
import { Router, useParams } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { Mock } from 'ts-mockery';
import { MenuLayout as createMenuLayout } from '../../src/common/MenuLayout';
import { NonReachableServer, NotFoundServer, ReachableServer, SelectedServer } from '../../src/servers/data';
import { SemVer } from '../../src/utils/helpers/version';

jest.mock('react-router-dom', () => ({ ...jest.requireActual('react-router-dom'), useParams: jest.fn() }));

describe('<MenuLayout />', () => {
  const MenuLayout = createMenuLayout(
    () => <>TagsList</>,
    () => <>ShortUrlsList</>,
    () => <>AsideMenu</>,
    () => <>CreateShortUrl</>,
    () => <>ShortUrlVisits</>,
    () => <>TagVisits</>,
    () => <>DomainVisits</>,
    () => <>OrphanVisits</>,
    () => <>NonOrphanVisits</>,
    () => <>ServerError</>,
    () => <>Overview</>,
    () => <>EditShortUrl</>,
    () => <>ManageDomains</>,
  );
  const setUp = (selectedServer: SelectedServer, currentPath = '/') => {
    const history = createMemoryHistory();
    history.push(currentPath);

    return render(
      <Router location={history.location} navigator={history}>
        <MenuLayout
          sidebarNotPresent={jest.fn()}
          sidebarPresent={jest.fn()}
          selectServer={jest.fn()}
          selectedServer={selectedServer}
        />
      </Router>,
    );
  };

  beforeEach(() => {
    (useParams as any).mockReturnValue({ serverId: 'abc123' });
  });

  afterEach(jest.clearAllMocks);

  it('shows loading indicator while loading server', () => {
    setUp(null);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('ServerError')).not.toBeInTheDocument();
  });

  it.each([
    [Mock.of<NotFoundServer>({ serverNotFound: true })],
    [Mock.of<NonReachableServer>({ serverNotReachable: true })],
  ])('shows error for non reachable servers', (selectedServer) => {
    setUp(selectedServer);

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.getByText('ServerError')).toBeInTheDocument();
  });

  it.each([
    ['3.0.0' as SemVer, '/overview', 'Overview'],
    ['3.0.0' as SemVer, '/list-short-urls/1', 'ShortUrlsList'],
    ['3.0.0' as SemVer, '/create-short-url', 'CreateShortUrl'],
    ['3.0.0' as SemVer, '/short-code/abc123/visits/foo', 'ShortUrlVisits'],
    ['3.0.0' as SemVer, '/short-code/abc123/edit', 'EditShortUrl'],
    ['3.0.0' as SemVer, '/tag/foo/visits/foo', 'TagVisits'],
    ['3.0.0' as SemVer, '/orphan-visits/foo', 'OrphanVisits'],
    ['3.0.0' as SemVer, '/manage-tags', 'TagsList'],
    ['3.0.0' as SemVer, '/not-found', 'Oops! We could not find requested route.'],
    ['3.0.0' as SemVer, '/domain/domain.com/visits/foo', 'Oops! We could not find requested route.'],
    ['3.1.0' as SemVer, '/domain/domain.com/visits/foo', 'DomainVisits'],
    ['2.10.0' as SemVer, '/non-orphan-visits/foo', 'Oops! We could not find requested route.'],
    ['3.0.0' as SemVer, '/non-orphan-visits/foo', 'NonOrphanVisits'],
    ['2.8.0' as SemVer, '/manage-domains', 'ManageDomains'],
  ])(
    'renders expected component based on location and server version',
    (version, currentPath, expectedContent) => {
      setUp(Mock.of<ReachableServer>({ version }), currentPath);
      expect(screen.getByText(expectedContent)).toBeInTheDocument();
    },
  );
});
