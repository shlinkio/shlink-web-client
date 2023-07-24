import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fromPartial } from '@total-typescript/shoehorn';
import type { ShortUrl, ShortUrlMeta } from '../../../shlink-web-component/short-urls/data';
import { ShortUrlStatus } from '../../../shlink-web-component/short-urls/helpers/ShortUrlStatus';
import type { ShlinkVisitsSummary } from '../../../src/api/types';

describe('<ShortUrlStatus />', () => {
  const setUp = (shortUrl: ShortUrl) => ({
    user: userEvent.setup(),
    ...render(<ShortUrlStatus shortUrl={shortUrl} />),
  });

  it.each([
    [
      fromPartial<ShortUrlMeta>({ validSince: '2099-01-01T10:30:15' }),
      {},
      'This short URL will start working on 2099-01-01 10:30.',
    ],
    [
      fromPartial<ShortUrlMeta>({ validUntil: '2020-01-01T10:30:15' }),
      {},
      'This short URL cannot be visited since 2020-01-01 10:30.',
    ],
    [
      fromPartial<ShortUrlMeta>({ maxVisits: 10 }),
      fromPartial<ShlinkVisitsSummary>({ total: 10 }),
      'This short URL cannot be currently visited because it has reached the maximum amount of 10 visits.',
    ],
    [
      fromPartial<ShortUrlMeta>({ maxVisits: 1 }),
      fromPartial<ShlinkVisitsSummary>({ total: 1 }),
      'This short URL cannot be currently visited because it has reached the maximum amount of 1 visit.',
    ],
    [{}, {}, 'This short URL can be visited normally.'],
    [fromPartial<ShortUrlMeta>({ validUntil: '2099-01-01T10:30:15' }), {}, 'This short URL can be visited normally.'],
    [fromPartial<ShortUrlMeta>({ validSince: '2020-01-01T10:30:15' }), {}, 'This short URL can be visited normally.'],
    [
      fromPartial<ShortUrlMeta>({ maxVisits: 10 }),
      fromPartial<ShlinkVisitsSummary>({ total: 1 }),
      'This short URL can be visited normally.',
    ],
  ])('shows expected tooltip', async (meta, visitsSummary, expectedTooltip) => {
    const { user } = setUp(fromPartial({ meta, visitsSummary }));

    await user.hover(screen.getByRole('img', { hidden: true }));
    await waitFor(() => expect(screen.getByRole('tooltip')).toHaveTextContent(expectedTooltip));
  });
});
