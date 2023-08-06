import { render, screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { MemoryRouter } from 'react-router-dom';
import type { ShlinkShortUrl } from '../../../src/short-urls/data';
import type { LinkSuffix } from '../../../src/short-urls/helpers/ShortUrlDetailLink';
import { ShortUrlDetailLink } from '../../../src/short-urls/helpers/ShortUrlDetailLink';
import { RoutesPrefixProvider } from '../../../src/utils/routesPrefix';

describe('<ShortUrlDetailLink />', () => {
  it.each([
    [false, undefined],
    [false, null],
    [true, null],
    [true, undefined],
    [false, fromPartial<ShlinkShortUrl>({})],
    [false, fromPartial<ShlinkShortUrl>({})],
  ])('only renders a plain span when either server or short URL are not set', (asLink, shortUrl) => {
    render(
      <ShortUrlDetailLink shortUrl={shortUrl} asLink={asLink} suffix="visits">
        Something
      </ShortUrlDetailLink>,
    );

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('Something')).toBeInTheDocument();
  });

  it.each([
    [
      '/server/1',
      fromPartial<ShlinkShortUrl>({ shortCode: 'abc123' }),
      'visits' as LinkSuffix,
      '/server/1/short-code/abc123/visits',
    ],
    [
      '/foobar',
      fromPartial<ShlinkShortUrl>({ shortCode: 'def456', domain: 'example.com' }),
      'visits' as LinkSuffix,
      '/foobar/short-code/def456/visits?domain=example.com',
    ],
    [
      '/server/1',
      fromPartial<ShlinkShortUrl>({ shortCode: 'abc123' }),
      'edit' as LinkSuffix,
      '/server/1/short-code/abc123/edit',
    ],
    [
      '/server/3',
      fromPartial<ShlinkShortUrl>({ shortCode: 'def456', domain: 'example.com' }),
      'edit' as LinkSuffix,
      '/server/3/short-code/def456/edit?domain=example.com',
    ],
  ])('renders link with expected query when', (routesPrefix, shortUrl, suffix, expectedLink) => {
    render(
      <MemoryRouter>
        <RoutesPrefixProvider value={routesPrefix}>
          <ShortUrlDetailLink shortUrl={shortUrl} suffix={suffix} asLink>
            Something
          </ShortUrlDetailLink>
        </RoutesPrefixProvider>
      </MemoryRouter>,
    );
    expect(screen.getByRole('link')).toHaveProperty('href', expect.stringContaining(expectedLink));
  });
});
