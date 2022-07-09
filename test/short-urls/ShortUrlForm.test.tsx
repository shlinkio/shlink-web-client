import { screen } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import { formatISO } from 'date-fns';
import { Mock } from 'ts-mockery';
import { ShortUrlForm as createShortUrlForm, Mode } from '../../src/short-urls/ShortUrlForm';
import { ReachableServer, SelectedServer } from '../../src/servers/data';
import { parseDate } from '../../src/utils/helpers/date';
import { OptionalString } from '../../src/utils/utils';
import { renderWithEvents } from '../__mocks__/setUpTest';

describe('<ShortUrlForm />', () => {
  const createShortUrl = jest.fn(async () => Promise.resolve());
  const ShortUrlForm = createShortUrlForm(() => <span>TagsSelector</span>, () => <span>DomainSelector</span>);
  const setUp = (selectedServer: SelectedServer = null, mode: Mode = 'create', title?: OptionalString) =>
    renderWithEvents(
      <ShortUrlForm
        selectedServer={selectedServer}
        mode={mode}
        saving={false}
        initialState={{ validateUrl: true, findIfExists: false, title, longUrl: '' }}
        onSave={createShortUrl}
      />,
    );

  afterEach(jest.clearAllMocks);

  it.each([
    [
      async (user: UserEvent) => {
        await user.type(screen.getByPlaceholderText('Custom slug'), 'my-slug');
      },
      { customSlug: 'my-slug' },
    ],
    [
      async (user: UserEvent) => {
        await user.type(screen.getByPlaceholderText('Short code length'), '15');
      },
      { shortCodeLength: '15' },
    ],
  ])('saves short URL with data set in form controls', async (extraFields, extraExpectedValues) => {
    const { user } = setUp();
    const validSince = parseDate('2017-01-01', 'yyyy-MM-dd');
    const validUntil = parseDate('2017-01-06', 'yyyy-MM-dd');

    await user.type(screen.getByPlaceholderText('URL to be shortened'), 'https://long-domain.com/foo/bar');
    await user.type(screen.getByPlaceholderText('Title'), 'the title');
    await user.type(screen.getByPlaceholderText('Maximum number of visits allowed'), '20');
    await user.type(screen.getByPlaceholderText('Enabled since...'), '2017-01-01');
    await user.type(screen.getByPlaceholderText('Enabled until...'), '2017-01-06');
    await extraFields(user);

    expect(createShortUrl).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(createShortUrl).toHaveBeenCalledWith({
      longUrl: 'https://long-domain.com/foo/bar',
      title: 'the title',
      validSince: formatISO(validSince),
      validUntil: formatISO(validUntil),
      maxVisits: 20,
      findIfExists: false,
      validateUrl: true,
      ...extraExpectedValues,
    });
  });

  it.each([
    ['create' as Mode, 4],
    ['create-basic' as Mode, 0],
  ])(
    'renders expected amount of cards based on server capabilities and mode',
    (mode, expectedAmountOfCards) => {
      setUp(null, mode);
      const cards = screen.queryAllByRole('heading');

      expect(cards).toHaveLength(expectedAmountOfCards);
    },
  );

  it.each([
    [null, true, 'new title'],
    [undefined, true, 'new title'],
    ['', true, 'new title'],
    [null, false, undefined],
    ['', false, undefined],
    ['old title', false, null],
  ])('sends expected title based on original and new values', async (originalTitle, withNewTitle, expectedSentTitle) => {
    const { user } = setUp(Mock.of<ReachableServer>({ version: '2.6.0' }), 'create', originalTitle);

    await user.type(screen.getByPlaceholderText('URL to be shortened'), 'https://long-domain.com/foo/bar');
    if (withNewTitle) {
      await user.type(screen.getByPlaceholderText('Title'), 'new title');
    } else {
      await user.clear(screen.getByPlaceholderText('Title'));
    }
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(createShortUrl).toHaveBeenCalledWith(expect.objectContaining({
      title: expectedSentTitle,
    }));
  });
});
