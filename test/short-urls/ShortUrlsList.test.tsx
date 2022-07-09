import { screen } from '@testing-library/react';
import { FC } from 'react';
import { Mock } from 'ts-mockery';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { ShortUrlsList as createShortUrlsList } from '../../src/short-urls/ShortUrlsList';
import { ShortUrl, ShortUrlsOrder } from '../../src/short-urls/data';
import { MercureBoundProps } from '../../src/mercure/helpers/boundToMercureHub';
import { ShortUrlsList as ShortUrlsListModel } from '../../src/short-urls/reducers/shortUrlsList';
import { ReachableServer } from '../../src/servers/data';
import { Settings } from '../../src/settings/reducers/settings';
import { ShortUrlsTableProps } from '../../src/short-urls/ShortUrlsTable';
import { renderWithEvents } from '../__mocks__/setUpTest';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn().mockReturnValue(jest.fn()),
  useLocation: jest.fn().mockReturnValue({ search: '?tags=test%20tag&search=example.com' }),
}));

describe('<ShortUrlsList />', () => {
  const ShortUrlsTable: FC<ShortUrlsTableProps> = ({ onTagClick }) => <span onClick={() => onTagClick?.('foo')}>ShortUrlsTable</span>;
  const ShortUrlsFilteringBar = () => <span>ShortUrlsFilteringBar</span>;
  const listShortUrlsMock = jest.fn();
  const navigate = jest.fn();
  const shortUrlsList = Mock.of<ShortUrlsListModel>({
    shortUrls: {
      data: [
        Mock.of<ShortUrl>({
          shortCode: 'testShortCode',
          shortUrl: 'https://www.example.com/testShortUrl',
          longUrl: 'https://www.example.com/testLongUrl',
          tags: ['test tag'],
        }),
      ],
      pagination: { pagesCount: 3 },
    },
  });
  const ShortUrlsList = createShortUrlsList(ShortUrlsTable, ShortUrlsFilteringBar);
  const setUp = (defaultOrdering: ShortUrlsOrder = {}) => renderWithEvents(
    <MemoryRouter>
      <ShortUrlsList
        {...Mock.of<MercureBoundProps>({ mercureInfo: { loading: true } })}
        listShortUrls={listShortUrlsMock}
        shortUrlsList={shortUrlsList}
        selectedServer={Mock.of<ReachableServer>({ id: '1' })}
        settings={Mock.of<Settings>({ shortUrlsList: { defaultOrdering } })}
      />
    </MemoryRouter>,
  );

  beforeEach(() => {
    (useNavigate as any).mockReturnValue(navigate);
  });

  afterEach(jest.clearAllMocks);

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
    [Mock.of<ShortUrlsOrder>({ field: 'visits', dir: 'ASC' }), 'visits', 'ASC'],
    [Mock.of<ShortUrlsOrder>({ field: 'title', dir: 'DESC' }), 'title', 'DESC'],
    [Mock.of<ShortUrlsOrder>(), undefined, undefined],
  ])('has expected initial ordering based on settings', (initialOrderBy, field, dir) => {
    setUp(initialOrderBy);
    expect(listShortUrlsMock).toHaveBeenCalledWith(expect.objectContaining({
      orderBy: { field, dir },
    }));
  });
});
