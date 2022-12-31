import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import { Mock } from 'ts-mockery';
import { ShortUrlStatus } from '../../../src/short-urls/helpers/ShortUrlStatus';
import { ShortUrl, ShortUrlMeta, ShortUrlVisitsSummary } from '../../../src/short-urls/data';

describe('<ShortUrlStatus />', () => {
  const setUp = (shortUrl: ShortUrl) => ({
    user: userEvent.setup(),
    ...render(<ShortUrlStatus shortUrl={shortUrl} />),
  });

  it.each([
    [
      Mock.of<ShortUrlMeta>({ validSince: '2099-01-01T10:30:15' }),
      {},
      'This short URL will start working on 2099-01-01 10:30.',
    ],
    [
      Mock.of<ShortUrlMeta>({ validUntil: '2020-01-01T10:30:15' }),
      {},
      'This short URL cannot be visited since 2020-01-01 10:30.',
    ],
    [
      Mock.of<ShortUrlMeta>({ maxVisits: 10 }),
      Mock.of<ShortUrlVisitsSummary>({ total: 10 }),
      'This short URL cannot be currently visited because it has reached the maximum amount of 10 visits.',
    ],
    [
      Mock.of<ShortUrlMeta>({ maxVisits: 1 }),
      Mock.of<ShortUrlVisitsSummary>({ total: 1 }),
      'This short URL cannot be currently visited because it has reached the maximum amount of 1 visit.',
    ],
    [{}, {}, 'This short URL can be visited normally.'],
    [Mock.of<ShortUrlMeta>({ validUntil: '2099-01-01T10:30:15' }), {}, 'This short URL can be visited normally.'],
    [Mock.of<ShortUrlMeta>({ validSince: '2020-01-01T10:30:15' }), {}, 'This short URL can be visited normally.'],
    [
      Mock.of<ShortUrlMeta>({ maxVisits: 10 }),
      Mock.of<ShortUrlVisitsSummary>({ total: 1 }),
      'This short URL can be visited normally.',
    ],
  ])('shows expected tooltip', async (meta, visitsSummary, expectedTooltip) => {
    const { user } = setUp(Mock.of<ShortUrl>({ meta, visitsSummary }));

    await user.hover(screen.getByRole('img', { hidden: true }));
    await waitFor(() => expect(screen.getByRole('tooltip')).toHaveTextContent(expectedTooltip));
  });
});
