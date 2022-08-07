import { screen } from '@testing-library/react';
import { Mock } from 'ts-mockery';
import { formatISO } from 'date-fns';
import { ShortUrlsRow as createShortUrlsRow } from '../../../src/short-urls/helpers/ShortUrlsRow';
import { TimeoutToggle } from '../../../src/utils/helpers/hooks';
import { ShortUrl } from '../../../src/short-urls/data';
import { ReachableServer } from '../../../src/servers/data';
import { parseDate } from '../../../src/utils/helpers/date';
import { renderWithEvents } from '../../__helpers__/setUpTest';
import { OptionalString } from '../../../src/utils/utils';
import { colorGeneratorMock } from '../../utils/services/__mocks__/ColorGenerator.mock';

describe('<ShortUrlsRow />', () => {
  const timeoutToggle = jest.fn(() => true);
  const useTimeoutToggle = jest.fn(() => [false, timeoutToggle]) as TimeoutToggle;
  const server = Mock.of<ReachableServer>({ url: 'https://doma.in' });
  const shortUrl: ShortUrl = {
    shortCode: 'abc123',
    shortUrl: 'https://doma.in/abc123',
    longUrl: 'https://foo.com/bar',
    dateCreated: formatISO(parseDate('2018-05-23 18:30:41', 'yyyy-MM-dd HH:mm:ss')),
    tags: [],
    visitsCount: 45,
    domain: null,
    meta: {
      validSince: null,
      validUntil: null,
      maxVisits: null,
    },
  };
  const ShortUrlsRow = createShortUrlsRow(() => <span>ShortUrlsRowMenu</span>, colorGeneratorMock, useTimeoutToggle);
  const setUp = (title?: OptionalString, tags: string[] = []) => renderWithEvents(
    <table>
      <tbody>
        <ShortUrlsRow selectedServer={server} shortUrl={{ ...shortUrl, title, tags }} onTagClick={() => null} />
      </tbody>
    </table>,
  );

  it.each([
    [null, 6],
    [undefined, 6],
    ['The title', 7],
  ])('renders expected amount of columns', (title, expectedAmount) => {
    setUp(title);
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
    setUp(title);

    const titleSharedCol = screen.getAllByRole('cell')[2];

    expect(titleSharedCol.querySelector('a')).toHaveAttribute('href', shortUrl.longUrl);
    expect(titleSharedCol).toHaveTextContent(expectedContent);
  });

  it.each([
    [[], ['No tags']],
    [['nodejs', 'reactjs'], ['nodejs', 'reactjs']],
  ])('renders list of tags in fourth row', (tags, expectedContents) => {
    setUp(undefined, tags);
    const cell = screen.getAllByRole('cell')[3];

    expectedContents.forEach((content) => expect(cell).toHaveTextContent(content));
  });

  it('renders visits count in fifth row', () => {
    setUp();
    expect(screen.getAllByRole('cell')[4]).toHaveTextContent(`${shortUrl.visitsCount}`);
  });

  it('updates state when copied to clipboard', async () => {
    const { user } = setUp();

    expect(timeoutToggle).not.toHaveBeenCalled();
    await user.click(screen.getByRole('img', { hidden: true }));
    expect(timeoutToggle).toHaveBeenCalledTimes(1);
  });
});
