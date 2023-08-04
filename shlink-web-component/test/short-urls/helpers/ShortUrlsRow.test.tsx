import { screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { addDays, formatISO, subDays } from 'date-fns';
import { last } from 'ramda';
import { MemoryRouter, useLocation } from 'react-router-dom';
import type { Settings } from '../../../src';
import type { ShortUrl, ShortUrlMeta } from '../../../src/short-urls/data';
import { ShortUrlsRow as createShortUrlsRow } from '../../../src/short-urls/helpers/ShortUrlsRow';
import { now, parseDate } from '../../../src/utils/dates/helpers/date';
import type { TimeoutToggle } from '../../../src/utils/helpers/hooks';
import { SettingsProvider } from '../../../src/utils/settings';
import { renderWithEvents } from '../../__helpers__/setUpTest';
import { colorGeneratorMock } from '../../utils/services/__mocks__/ColorGenerator.mock';

interface SetUpOptions {
  title?: string | null;
  tags?: string[];
  meta?: ShortUrlMeta;
  settings?: Partial<Settings>;
}

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useLocation: vi.fn().mockReturnValue({}),
}));

describe('<ShortUrlsRow />', () => {
  const timeoutToggle = vi.fn(() => true);
  const useTimeoutToggle = vi.fn(() => [false, timeoutToggle]) as TimeoutToggle;
  const shortUrl: ShortUrl = {
    shortCode: 'abc123',
    shortUrl: 'https://s.test/abc123',
    longUrl: 'https://foo.com/bar',
    dateCreated: formatISO(parseDate('2018-05-23 18:30:41', 'yyyy-MM-dd HH:mm:ss')),
    tags: [],
    visitsCount: 45,
    visitsSummary: {
      total: 45,
      nonBots: 40,
      bots: 5,
    },
    domain: null,
    meta: {
      validSince: null,
      validUntil: null,
      maxVisits: null,
    },
  };
  const ShortUrlsRow = createShortUrlsRow(() => <span>ShortUrlsRowMenu</span>, colorGeneratorMock, useTimeoutToggle);

  const setUp = ({ title, tags = [], meta = {}, settings = {} }: SetUpOptions = {}, search = '') => {
    (useLocation as any).mockReturnValue({ search });
    return renderWithEvents(
      <MemoryRouter>
        <SettingsProvider value={fromPartial(settings)}>
          <table>
            <tbody>
              <ShortUrlsRow
                shortUrl={{ ...shortUrl, title, tags, meta: { ...shortUrl.meta, ...meta } }}
                onTagClick={() => null}
              />
            </tbody>
          </table>
        </SettingsProvider>
      </MemoryRouter>,
    );
  };

  it.each([
    [null, 7],
    [undefined, 7],
    ['The title', 8],
  ])('renders expected amount of columns', (title, expectedAmount) => {
    setUp({ title });
    expect(screen.getAllByRole('cell')).toHaveLength(expectedAmount);
  });

  it('renders date in first column', () => {
    setUp();
    expect(screen.getAllByRole('cell')[0]).toHaveTextContent('2018-05-23 18:30');
  });

  it.each([
    [1, shortUrl.shortUrl],
    [2, shortUrl.longUrl],
  ])('renders expected links on corresponding columns', (colIndex, expectedLink) => {
    setUp();

    const col = screen.getAllByRole('cell')[colIndex];
    const link = col.querySelector('a');

    expect(link).toHaveAttribute('href', expectedLink);
  });

  it.each([
    ['My super cool title', 'My super cool title'],
    [undefined, shortUrl.longUrl],
  ])('renders title when short URL has it', (title, expectedContent) => {
    setUp({ title });

    const titleSharedCol = screen.getAllByRole('cell')[2];

    expect(titleSharedCol.querySelector('a')).toHaveAttribute('href', shortUrl.longUrl);
    expect(titleSharedCol).toHaveTextContent(expectedContent);
  });

  it.each([
    [[], ['No tags']],
    [['nodejs', 'reactjs'], ['nodejs', 'reactjs']],
  ])('renders list of tags in fourth row', (tags, expectedContents) => {
    setUp({ tags });
    const cell = screen.getAllByRole('cell')[3];

    expectedContents.forEach((content) => expect(cell).toHaveTextContent(content));
  });

  it.each([
    [{}, '', shortUrl.visitsSummary?.total],
    [fromPartial<Settings>({ visits: { excludeBots: false } }), '', shortUrl.visitsSummary?.total],
    [fromPartial<Settings>({ visits: { excludeBots: true } }), '', shortUrl.visitsSummary?.nonBots],
    [fromPartial<Settings>({ visits: { excludeBots: false } }), 'excludeBots=true', shortUrl.visitsSummary?.nonBots],
    [fromPartial<Settings>({ visits: { excludeBots: true } }), 'excludeBots=true', shortUrl.visitsSummary?.nonBots],
    [{}, 'excludeBots=true', shortUrl.visitsSummary?.nonBots],
    [fromPartial<Settings>({ visits: { excludeBots: true } }), 'excludeBots=false', shortUrl.visitsSummary?.total],
    [fromPartial<Settings>({ visits: { excludeBots: false } }), 'excludeBots=false', shortUrl.visitsSummary?.total],
    [{}, 'excludeBots=false', shortUrl.visitsSummary?.total],
  ])('renders visits count in fifth row', (settings, search, expectedAmount) => {
    setUp({ settings }, search);
    expect(screen.getAllByRole('cell')[4]).toHaveTextContent(`${expectedAmount}`);
  });

  it('updates state when copied to clipboard', async () => {
    const { user } = setUp();

    expect(timeoutToggle).not.toHaveBeenCalled();
    await user.click(screen.getAllByRole('img', { hidden: true })[0]);
    expect(timeoutToggle).toHaveBeenCalledTimes(1);
  });

  it.each([
    [{ validUntil: formatISO(subDays(now(), 1)) }, ['fa-calendar-xmark', 'text-danger']],
    [{ validSince: formatISO(addDays(now(), 1)) }, ['fa-calendar-xmark', 'text-warning']],
    [{ maxVisits: 45 }, ['fa-link-slash', 'text-danger']],
    [{ maxVisits: 45, validSince: formatISO(addDays(now(), 1)) }, ['fa-link-slash', 'text-danger']],
    [
      { validSince: formatISO(addDays(now(), 1)), validUntil: formatISO(subDays(now(), 1)) },
      ['fa-calendar-xmark', 'text-danger'],
    ],
    [
      { validSince: formatISO(subDays(now(), 1)), validUntil: formatISO(addDays(now(), 1)) },
      ['fa-check', 'text-primary'],
    ],
    [{ maxVisits: 500 }, ['fa-check', 'text-primary']],
    [{}, ['fa-check', 'text-primary']],
  ])('displays expected status icon', (meta, expectedIconClasses) => {
    setUp({ meta });
    const statusIcon = last(screen.getAllByRole('img', { hidden: true }));

    expect(statusIcon).toBeInTheDocument();
    expectedIconClasses.forEach((expectedClass) => expect(statusIcon).toHaveClass(expectedClass));
    expect(statusIcon).toMatchSnapshot();
  });
});
