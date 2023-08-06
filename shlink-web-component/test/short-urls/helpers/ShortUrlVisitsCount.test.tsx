import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fromPartial } from '@total-typescript/shoehorn';
import type { ShlinkShortUrl } from '../../../src/short-urls/data';
import { ShortUrlVisitsCount } from '../../../src/short-urls/helpers/ShortUrlVisitsCount';

describe('<ShortUrlVisitsCount />', () => {
  const setUp = (visitsCount: number, shortUrl: ShlinkShortUrl) => ({
    user: userEvent.setup(),
    ...render(
      <ShortUrlVisitsCount visitsCount={visitsCount} shortUrl={shortUrl} />,
    ),
  });

  it.each([undefined, {}])('just returns visits when no limits are provided', (meta) => {
    const visitsCount = 45;
    const { container } = setUp(visitsCount, fromPartial({ meta }));

    expect(container.firstChild).toHaveTextContent(`${visitsCount}`);
    expect(container.querySelector('.short-urls-visits-count__max-visits-control')).not.toBeInTheDocument();
  });

  it('displays the maximum amount of visits when present', () => {
    const visitsCount = 45;
    const maxVisits = 500;
    const meta = { maxVisits };
    const { container } = setUp(visitsCount, fromPartial({ meta }));

    expect(container.firstChild).toHaveTextContent(`/ ${maxVisits}`);
  });

  it.each([
    [['This short URL will not accept more than 50 visits'], { maxVisits: 50 }],
    [['This short URL will not accept more than 1 visit'], { maxVisits: 1 }],
    [['This short URL will not accept visits before 2022-01-01 10:00'], { validSince: '2022-01-01T10:00:00' }],
    [['This short URL will not accept visits after 2022-05-05 15:30'], { validUntil: '2022-05-05T15:30:30' }],
    [[
      'This short URL will not accept more than 100 visits',
      'This short URL will not accept visits after 2022-05-05 15:30',
    ], { validUntil: '2022-05-05T15:30:30', maxVisits: 100 }],
    [[
      'This short URL will not accept more than 100 visits',
      'This short URL will not accept visits before 2023-01-01 10:00',
      'This short URL will not accept visits after 2023-05-05 15:30',
    ], { validSince: '2023-01-01T10:00:00', validUntil: '2023-05-05T15:30:30', maxVisits: 100 }],
  ])('displays proper amount of tooltip list items', async (expectedListItems, meta) => {
    const { user } = setUp(100, fromPartial({ meta }));

    await user.hover(screen.getByRole('img', { hidden: true }));
    await waitFor(() => expect(screen.getByRole('list')));

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(expectedListItems.length);
    expectedListItems.forEach((text, index) => expect(items[index]).toHaveTextContent(text));
  });
});
