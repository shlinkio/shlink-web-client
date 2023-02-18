import { render, screen } from '@testing-library/react';
import { Mock } from 'ts-mockery';
import { MemoryRouter } from 'react-router-dom';
import type { ShortUrlsList as ShortUrlsListState } from '../../src/short-urls/reducers/shortUrlsList';
import { Overview as overviewCreator } from '../../src/servers/Overview';
import type { TagsList } from '../../src/tags/reducers/tagsList';
import type { VisitsOverview } from '../../src/visits/reducers/visitsOverview';
import type { MercureInfo } from '../../src/mercure/reducers/mercureInfo';
import type { ReachableServer } from '../../src/servers/data';
import { prettify } from '../../src/utils/helpers/numbers';

describe('<Overview />', () => {
  const ShortUrlsTable = () => <>ShortUrlsTable</>;
  const CreateShortUrl = () => <>CreateShortUrl</>;
  const listShortUrls = jest.fn();
  const listTags = jest.fn();
  const loadVisitsOverview = jest.fn();
  const Overview = overviewCreator(ShortUrlsTable, CreateShortUrl);
  const shortUrls = {
    pagination: { totalItems: 83710 },
  };
  const serverId = '123';
  const setUp = (loading = false) => render(
    <MemoryRouter>
      <Overview
        listShortUrls={listShortUrls}
        listTags={listTags}
        loadVisitsOverview={loadVisitsOverview}
        shortUrlsList={Mock.of<ShortUrlsListState>({ loading, shortUrls })}
        tagsList={Mock.of<TagsList>({ loading, tags: ['foo', 'bar', 'baz'] })}
        visitsOverview={Mock.of<VisitsOverview>({ loading, visitsCount: 3456, orphanVisitsCount: 28 })}
        selectedServer={Mock.of<ReachableServer>({ id: serverId })}
        createNewVisits={jest.fn()}
        loadMercureInfo={jest.fn()}
        mercureInfo={Mock.all<MercureInfo>()}
      />
    </MemoryRouter>,
  );

  it('displays loading messages when still loading', () => {
    setUp(true);
    expect(screen.getAllByText('Loading...')).toHaveLength(4);
  });

  it('displays amounts in cards after finishing loading', () => {
    setUp();

    const headingElements = screen.getAllByRole('heading');

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(headingElements[0]).toHaveTextContent('Visits');
    expect(headingElements[1]).toHaveTextContent(prettify(3456));
    expect(headingElements[2]).toHaveTextContent('Orphan visits');
    expect(headingElements[3]).toHaveTextContent(prettify(28));
    expect(headingElements[4]).toHaveTextContent('Short URLs');
    expect(headingElements[5]).toHaveTextContent(prettify(83710));
    expect(headingElements[6]).toHaveTextContent('Tags');
    expect(headingElements[7]).toHaveTextContent(prettify(3));
  });

  it('nests injected components', () => {
    setUp();

    expect(screen.queryByText('ShortUrlsTable')).toBeInTheDocument();
    expect(screen.queryByText('CreateShortUrl')).toBeInTheDocument();
  });

  it('displays links to other sections', () => {
    setUp();

    const links = screen.getAllByRole('link');

    expect(links).toHaveLength(5);
    expect(links[0]).toHaveAttribute('href', `/server/${serverId}/orphan-visits`);
    expect(links[1]).toHaveAttribute('href', `/server/${serverId}/list-short-urls/1`);
    expect(links[2]).toHaveAttribute('href', `/server/${serverId}/manage-tags`);
    expect(links[3]).toHaveAttribute('href', `/server/${serverId}/create-short-url`);
    expect(links[4]).toHaveAttribute('href', `/server/${serverId}/list-short-urls/1`);
  });
});
