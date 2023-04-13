import { render, screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { MemoryRouter } from 'react-router-dom';
import type { NotFoundServer, ReachableServer } from '../../../src/servers/data';
import type { ShortUrl } from '../../../src/short-urls/data';
import type { LinkSuffix } from '../../../src/short-urls/helpers/ShortUrlDetailLink';
import { ShortUrlDetailLink } from '../../../src/short-urls/helpers/ShortUrlDetailLink';

describe('<ShortUrlDetailLink />', () => {
  it.each([
    [undefined, undefined],
    [null, null],
    [fromPartial<ReachableServer>({ id: '1' }), null],
    [fromPartial<ReachableServer>({ id: '1' }), undefined],
    [fromPartial<NotFoundServer>({}), fromPartial<ShortUrl>({})],
    [null, fromPartial<ShortUrl>({})],
    [undefined, fromPartial<ShortUrl>({})],
  ])('only renders a plain span when either server or short URL are not set', (selectedServer, shortUrl) => {
    render(
      <ShortUrlDetailLink selectedServer={selectedServer} shortUrl={shortUrl} suffix="visits">
        Something
      </ShortUrlDetailLink>,
    );

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('Something')).toBeInTheDocument();
  });

  it.each([
    [
      fromPartial<ReachableServer>({ id: '1' }),
      fromPartial<ShortUrl>({ shortCode: 'abc123' }),
      'visits' as LinkSuffix,
      '/server/1/short-code/abc123/visits',
    ],
    [
      fromPartial<ReachableServer>({ id: '3' }),
      fromPartial<ShortUrl>({ shortCode: 'def456', domain: 'example.com' }),
      'visits' as LinkSuffix,
      '/server/3/short-code/def456/visits?domain=example.com',
    ],
    [
      fromPartial<ReachableServer>({ id: '1' }),
      fromPartial<ShortUrl>({ shortCode: 'abc123' }),
      'edit' as LinkSuffix,
      '/server/1/short-code/abc123/edit',
    ],
    [
      fromPartial<ReachableServer>({ id: '3' }),
      fromPartial<ShortUrl>({ shortCode: 'def456', domain: 'example.com' }),
      'edit' as LinkSuffix,
      '/server/3/short-code/def456/edit?domain=example.com',
    ],
  ])('renders link with expected query when', (selectedServer, shortUrl, suffix, expectedLink) => {
    render(
      <MemoryRouter>
        <ShortUrlDetailLink selectedServer={selectedServer} shortUrl={shortUrl} suffix={suffix}>
          Something
        </ShortUrlDetailLink>
      </MemoryRouter>,
    );
    expect(screen.getByRole('link')).toHaveProperty('href', expect.stringContaining(expectedLink));
  });
});
