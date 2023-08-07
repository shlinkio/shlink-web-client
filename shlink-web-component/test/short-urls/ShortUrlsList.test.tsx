import { screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import type { Settings } from '../../src';
import type { MercureBoundProps } from '../../src/mercure/helpers/boundToMercureHub';
import type { ShortUrlsOrder } from '../../src/short-urls/data';
import type { ShortUrlsList as ShortUrlsListModel } from '../../src/short-urls/reducers/shortUrlsList';
import { ShortUrlsList as createShortUrlsList } from '../../src/short-urls/ShortUrlsList';
import type { ShortUrlsTableType } from '../../src/short-urls/ShortUrlsTable';
import { FeaturesProvider } from '../../src/utils/features';
import { SettingsProvider } from '../../src/utils/settings';
import { renderWithEvents } from '../__helpers__/setUpTest';

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useNavigate: vi.fn().mockReturnValue(vi.fn()),
  useLocation: vi.fn().mockReturnValue({ search: '?tags=test%20tag&search=example.com' }),
}));

describe('<ShortUrlsList />', () => {
  const ShortUrlsTable: ShortUrlsTableType = ({ onTagClick }) => <span onClick={() => onTagClick?.('foo')}>ShortUrlsTable</span>;
  const ShortUrlsFilteringBar = () => <span>ShortUrlsFilteringBar</span>;
  const listShortUrlsMock = vi.fn();
  const navigate = vi.fn();
  const shortUrlsList = fromPartial<ShortUrlsListModel>({
    shortUrls: {
      data: [
        {
          shortCode: 'testShortCode',
          shortUrl: 'https://www.example.com/testShortUrl',
          longUrl: 'https://www.example.com/testLongUrl',
          tags: ['test tag'],
        },
      ],
      pagination: { pagesCount: 3 },
    },
  });
  const ShortUrlsList = createShortUrlsList(ShortUrlsTable, ShortUrlsFilteringBar);
  const setUp = (settings: Partial<Settings> = {}, excludeBotsOnShortUrls = true) => renderWithEvents(
    <MemoryRouter>
      <SettingsProvider value={fromPartial(settings)}>
        <FeaturesProvider value={fromPartial({ excludeBotsOnShortUrls })}>
          <ShortUrlsList
            {...fromPartial<MercureBoundProps>({ mercureInfo: { loading: true } })}
            listShortUrls={listShortUrlsMock}
            shortUrlsList={shortUrlsList}
          />
        </FeaturesProvider>
      </SettingsProvider>
    </MemoryRouter>,
  );

  beforeEach(() => {
    (useNavigate as any).mockReturnValue(navigate);
  });

  it('wraps expected components', () => {
    setUp();

    expect(screen.getByText('ShortUrlsTable')).toBeInTheDocument();
    expect(screen.getByText('ShortUrlsFilteringBar')).toBeInTheDocument();
  });

  it('passes current query to paginator', () => {
    setUp();

    const links = screen.getAllByRole('link');

    expect(links.length > 0).toEqual(true);
    links.forEach(
      (link) => expect(link).toHaveAttribute('href', expect.stringContaining('?tags=test%20tag&search=example.com')),
    );
  });

  it('gets list refreshed every time a tag is clicked', async () => {
    const { user } = setUp();

    expect(navigate).not.toHaveBeenCalled();
    await user.click(screen.getByText('ShortUrlsTable'));
    expect(navigate).toHaveBeenCalledWith(expect.stringContaining(`tags=${encodeURIComponent('test tag,foo')}`));
  });

  it.each([
    [fromPartial<ShortUrlsOrder>({ field: 'visits', dir: 'ASC' }), 'visits', 'ASC'],
    [fromPartial<ShortUrlsOrder>({ field: 'title', dir: 'DESC' }), 'title', 'DESC'],
    [fromPartial<ShortUrlsOrder>({}), undefined, undefined],
  ])('has expected initial ordering based on settings', (defaultOrdering, field, dir) => {
    setUp({ shortUrlsList: { defaultOrdering } });
    expect(listShortUrlsMock).toHaveBeenCalledWith(expect.objectContaining({
      orderBy: { field, dir },
    }));
  });

  it.each([
    [fromPartial<Settings>({
      shortUrlsList: {
        defaultOrdering: { field: 'visits', dir: 'ASC' },
      },
    }), false, { field: 'visits', dir: 'ASC' }],
    [fromPartial<Settings>({
      shortUrlsList: {
        defaultOrdering: { field: 'visits', dir: 'ASC' },
      },
      visits: { excludeBots: true },
    }), false, { field: 'visits', dir: 'ASC' }],
    [fromPartial<Settings>({
      shortUrlsList: {
        defaultOrdering: { field: 'visits', dir: 'ASC' },
      },
    }), true, { field: 'visits', dir: 'ASC' }],
    [fromPartial<Settings>({
      shortUrlsList: {
        defaultOrdering: { field: 'visits', dir: 'ASC' },
      },
      visits: { excludeBots: true },
    }), true, { field: 'nonBotVisits', dir: 'ASC' }],
  ])('parses order by based on supported features version and config', (settings, excludeBotsOnShortUrls, expectedOrderBy) => {
    setUp(settings, excludeBotsOnShortUrls);
    expect(listShortUrlsMock).toHaveBeenCalledWith(expect.objectContaining({ orderBy: expectedOrderBy }));
  });
});
