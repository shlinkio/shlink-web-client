import { render, screen } from '@testing-library/react';
import { Mock } from 'ts-mockery';
import { MemoryRouter } from 'react-router-dom';
import type { LinkSuffix } from '../../../src/short-urls/helpers/ShortUrlDetailLink';
import { ShortUrlDetailLink } from '../../../src/short-urls/helpers/ShortUrlDetailLink';
import type { NotFoundServer, ReachableServer } from '../../../src/servers/data';
import type { ShortUrl } from '../../../src/short-urls/data';

describe('<ShortUrlDetailLink />', () => {
  it.each([
    [undefined, undefined],
    [null, null],
    [Mock.of<ReachableServer>({ id: '1' }), null],
    [Mock.of<ReachableServer>({ id: '1' }), undefined],
    [Mock.of<NotFoundServer>(), Mock.all<ShortUrl>()],
    [null, Mock.all<ShortUrl>()],
    [undefined, Mock.all<ShortUrl>()],
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
      Mock.of<ReachableServer>({ id: '1' }),
      Mock.of<ShortUrl>({ shortCode: 'abc123' }),
      'visits' as LinkSuffix,
      '/server/1/short-code/abc123/visits',
    ],
    [
      Mock.of<ReachableServer>({ id: '3' }),
      Mock.of<ShortUrl>({ shortCode: 'def456', domain: 'example.com' }),
      'visits' as LinkSuffix,
      '/server/3/short-code/def456/visits?domain=example.com',
    ],
    [
      Mock.of<ReachableServer>({ id: '1' }),
      Mock.of<ShortUrl>({ shortCode: 'abc123' }),
      'edit' as LinkSuffix,
      '/server/1/short-code/abc123/edit',
    ],
    [
      Mock.of<ReachableServer>({ id: '3' }),
      Mock.of<ShortUrl>({ shortCode: 'def456', domain: 'example.com' }),
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
