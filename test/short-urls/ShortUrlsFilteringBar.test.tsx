import { screen, waitFor } from '@testing-library/react';
import { Mock } from 'ts-mockery';
import { endOfDay, formatISO, startOfDay } from 'date-fns';
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';
import { ShortUrlsFilteringBar as filteringBarCreator } from '../../src/short-urls/ShortUrlsFilteringBar';
import { ReachableServer, SelectedServer } from '../../src/servers/data';
import { DateRange } from '../../src/utils/helpers/dateIntervals';
import { formatDate } from '../../src/utils/helpers/date';
import { renderWithEvents } from '../__helpers__/setUpTest';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn().mockReturnValue({ serverId: '1' }),
  useNavigate: jest.fn(),
  useLocation: jest.fn().mockReturnValue({}),
}));

describe('<ShortUrlsFilteringBar />', () => {
  const ShortUrlsFilteringBar = filteringBarCreator(() => <>ExportShortUrlsBtn</>, () => <>TagsSelector</>);
  const navigate = jest.fn();
  const handleOrderBy = jest.fn();
  const now = new Date();
  const setUp = (search = '', selectedServer?: SelectedServer) => {
    (useLocation as any).mockReturnValue({ search });
    (useNavigate as any).mockReturnValue(navigate);

    return renderWithEvents(
      <MemoryRouter>
        <ShortUrlsFilteringBar
          selectedServer={selectedServer ?? Mock.all<SelectedServer>()}
          order={{}}
          handleOrderBy={handleOrderBy}
        />
      </MemoryRouter>,
    );
  };

  afterEach(jest.clearAllMocks);

  it('renders expected children components', () => {
    setUp();

    expect(screen.getByText('ExportShortUrlsBtn')).toBeInTheDocument();
    expect(screen.getByText('TagsSelector')).toBeInTheDocument();
  });

  it('redirects to first page when search field changes', async () => {
    const { user } = setUp();

    expect(navigate).not.toHaveBeenCalled();
    await user.type(screen.getByPlaceholderText('Search...'), 'search-term');
    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/server/1/list-short-urls/1?search=search-term'));
  });

  it.each([
    [{ startDate: now } as DateRange, `startDate=${encodeURIComponent(formatISO(startOfDay(now)))}`],
    [{ endDate: now } as DateRange, `endDate=${encodeURIComponent(formatISO(endOfDay(now)))}`],
    [
      { startDate: now, endDate: now } as DateRange,
      `startDate=${encodeURIComponent(formatISO(startOfDay(now)))}&endDate=${encodeURIComponent(formatISO(endOfDay(now)))}`,
    ],
  ])('redirects to first page when date range changes', async (dates, expectedQuery) => {
    const { user } = setUp();

    await user.click(screen.getByRole('button', { name: 'All short URLs' }));
    expect(await screen.findByRole('menu')).toBeInTheDocument();

    expect(navigate).not.toHaveBeenCalled();
    dates.startDate && await user.type(screen.getByPlaceholderText('Since...'), formatDate()(dates.startDate) ?? '');
    dates.endDate && await user.type(screen.getByPlaceholderText('Until...'), formatDate()(dates.endDate) ?? '');
    expect(navigate).toHaveBeenLastCalledWith(`/server/1/list-short-urls/1?${expectedQuery}`);
  });

  it.each([
    ['tags=foo,bar,baz', Mock.of<ReachableServer>({ version: '3.0.0' }), true],
    ['tags=foo,bar', Mock.of<ReachableServer>({ version: '3.1.0' }), true],
    ['tags=foo', Mock.of<ReachableServer>({ version: '3.0.0' }), false],
    ['', Mock.of<ReachableServer>({ version: '3.0.0' }), false],
    ['tags=foo,bar,baz', Mock.of<ReachableServer>({ version: '2.10.0' }), false],
    ['', Mock.of<ReachableServer>({ version: '2.10.0' }), false],
  ])(
    'renders tags mode toggle if the server supports it and there is more than one tag selected',
    (search, selectedServer, shouldHaveComponent) => {
      setUp(search, selectedServer);

      if (shouldHaveComponent) {
        expect(screen.getByLabelText('Change tags mode')).toBeInTheDocument();
      } else {
        expect(screen.queryByLabelText('Change tags mode')).not.toBeInTheDocument();
      }
    },
  );

  it.each([
    ['', 'With any of the tags.'],
    ['&tagsMode=all', 'With all the tags.'],
    ['&tagsMode=any', 'With any of the tags.'],
  ])('expected tags mode tooltip title', async (initialTagsMode, expectedToggleText) => {
    const { user } = setUp(`tags=foo,bar${initialTagsMode}`, Mock.of<ReachableServer>({ version: '3.0.0' }));

    await user.hover(screen.getByLabelText('Change tags mode'));
    expect(await screen.findByRole('tooltip')).toHaveTextContent(expectedToggleText);
  });

  it.each([
    ['', 'tagsMode=all'],
    ['&tagsMode=all', 'tagsMode=any'],
    ['&tagsMode=any', 'tagsMode=all'],
  ])('redirects to first page when tags mode changes', async (initialTagsMode, expectedRedirectTagsMode) => {
    const { user } = setUp(`tags=foo,bar${initialTagsMode}`, Mock.of<ReachableServer>({ version: '3.0.0' }));

    expect(navigate).not.toHaveBeenCalled();
    await user.click(screen.getByLabelText('Change tags mode'));
    expect(navigate).toHaveBeenCalledWith(expect.stringContaining(expectedRedirectTagsMode));
  });

  it('handles order through dropdown', async () => {
    const { user } = setUp();
    const clickMenuItem = async (name: string | RegExp) => {
      await user.click(screen.getByRole('button', { name: 'Order by...' }));
      await user.click(await screen.findByRole('menuitem', { name }));
    };

    await clickMenuItem(/^Short URL/);
    expect(handleOrderBy).toHaveBeenCalledWith('shortCode', 'ASC');

    await clickMenuItem(/^Title/);
    expect(handleOrderBy).toHaveBeenCalledWith('title', 'ASC');

    await clickMenuItem(/^Long URL/);
    expect(handleOrderBy).toHaveBeenCalledWith('longUrl', 'ASC');
  });
});
