import { screen } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event/setup/setup';
import { fromPartial } from '@total-typescript/shoehorn';
import { formatISO } from 'date-fns';
import type { Mode } from '../../src/short-urls/ShortUrlForm';
import { ShortUrlForm as createShortUrlForm } from '../../src/short-urls/ShortUrlForm';
import { parseDate } from '../../src/utils/dates/helpers/date';
import { FeaturesProvider } from '../../src/utils/features';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<ShortUrlForm />', () => {
  const createShortUrl = vi.fn(async () => Promise.resolve());
  const ShortUrlForm = createShortUrlForm(() => <span>TagsSelector</span>, () => <span>DomainSelector</span>);
  const setUp = (withDeviceLongUrls = false, mode: Mode = 'create', title?: string | null) =>
    renderWithEvents(
      <FeaturesProvider value={fromPartial({ deviceLongUrls: withDeviceLongUrls })}>
        <ShortUrlForm
          mode={mode}
          saving={false}
          initialState={{ validateUrl: true, findIfExists: false, title, longUrl: '' }}
          onSave={createShortUrl}
        />
      </FeaturesProvider>,
    );

  it.each([
    [
      async (user: UserEvent) => {
        await user.type(screen.getByPlaceholderText('Custom slug'), 'my-slug');
      },
      { customSlug: 'my-slug' },
      false,
    ],
    [
      async (user: UserEvent) => {
        await user.type(screen.getByPlaceholderText('Short code length'), '15');
      },
      { shortCodeLength: '15' },
      false,
    ],
    [
      async (user: UserEvent) => {
        await user.type(screen.getByPlaceholderText('Android-specific redirection'), 'https://android.com');
        await user.type(screen.getByPlaceholderText('iOS-specific redirection'), 'https://ios.com');
      },
      {
        deviceLongUrls: {
          android: 'https://android.com',
          ios: 'https://ios.com',
        },
      },
      true,
    ],
  ])('saves short URL with data set in form controls', async (extraFields, extraExpectedValues, withDeviceLongUrls) => {
    const { user } = setUp(withDeviceLongUrls);
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
    ['create' as Mode, 5],
    ['create-basic' as Mode, 0],
  ])(
    'renders expected amount of cards based on server capabilities and mode',
    (mode, expectedAmountOfCards) => {
      setUp(false, mode);
      const cards = screen.queryAllByRole('heading');

      expect(cards).toHaveLength(expectedAmountOfCards);
    },
  );

  it.each([
    [null, true, 'new title'],
    [undefined, true, 'new title'],
    ['', true, 'new title'],
    ['old title', true, 'new title'],
    [null, false, null],
    ['', false, ''],
    [undefined, false, undefined],
    ['old title', false, null],
  ])('sends expected title based on original and new values', async (originalTitle, withNewTitle, expectedSentTitle) => {
    const { user } = setUp(false, 'create', originalTitle);

    await user.type(screen.getByPlaceholderText('URL to be shortened'), 'https://long-domain.com/foo/bar');
    await user.clear(screen.getByPlaceholderText('Title'));
    if (withNewTitle) {
      await user.type(screen.getByPlaceholderText('Title'), 'new title');
    }
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(createShortUrl).toHaveBeenCalledWith(expect.objectContaining({
      title: expectedSentTitle,
    }));
  });

  it('shows device-specific long URLs only when supported', () => {
    setUp(true);

    const placeholders = ['Android-specific redirection', 'iOS-specific redirection', 'Desktop-specific redirection'];
    placeholders.forEach((placeholder) => expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument());
  });
});
