import { render, screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import type { MainProps } from '../src/Main';
import { Main as createMain } from '../src/Main';
import { FeaturesProvider } from '../src/utils/features';

type SetUpOptions = {
  currentPath: string
  createNotFound?: MainProps['createNotFound'];
  domainVisitsSupported?: boolean;
};

describe('<Main />', () => {
  const Main = createMain(
    () => <>TagsList</>,
    () => <>ShortUrlsList</>,
    () => <>CreateShortUrl</>,
    () => <>ShortUrlVisits</>,
    () => <>TagVisits</>,
    () => <>DomainVisits</>,
    () => <>OrphanVisits</>,
    () => <>NonOrphanVisits</>,
    () => <>OverviewRoute</>,
    () => <>EditShortUrl</>,
    () => <>ManageDomains</>,
  );
  const setUp = ({ createNotFound, currentPath, domainVisitsSupported = true }: SetUpOptions) => {
    const history = createMemoryHistory();
    history.push(currentPath);

    return render(
      <Router location={history.location} navigator={history}>
        <FeaturesProvider value={fromPartial({ domainVisits: domainVisitsSupported })}>
          <Main createNotFound={createNotFound} />
        </FeaturesProvider>
      </Router>,
    );
  };

  it.each([
    ['/overview', 'OverviewRoute'],
    ['/list-short-urls/1', 'ShortUrlsList'],
    ['/create-short-url', 'CreateShortUrl'],
    ['/short-code/abc123/visits/foo', 'ShortUrlVisits'],
    ['/short-code/abc123/edit', 'EditShortUrl'],
    ['/tag/foo/visits/foo', 'TagVisits'],
    ['/orphan-visits/foo', 'OrphanVisits'],
    ['/manage-tags', 'TagsList'],
    ['/domain/domain.com/visits/foo', 'DomainVisits'],
    ['/non-orphan-visits/foo', 'NonOrphanVisits'],
    ['/manage-domains', 'ManageDomains'],
  ])(
    'renders expected component based on location and server version',
    (currentPath, expectedContent) => {
      setUp({ currentPath });
      expect(screen.getByText(expectedContent)).toBeInTheDocument();
    },
  );

  it.each([
    ['/domain/domain.com/visits/foo', false],
    ['/foo/bar/baz', true],
  ])('renders not-found when trying to navigate to invalid route', (currentPath, domainVisitsSupported) => {
    const createNotFound = () => <>Oops! Route not found.</>;

    setUp({ currentPath, domainVisitsSupported, createNotFound });

    expect(screen.getByText('Oops! Route not found.')).toBeInTheDocument();
  });
});
