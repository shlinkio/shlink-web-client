import { render } from '@testing-library/react';
import { Mock } from 'ts-mockery';
import { ShortUrlVisitsCount } from '../../../src/short-urls/helpers/ShortUrlVisitsCount';
import { ShortUrl } from '../../../src/short-urls/data';

describe('<ShortUrlVisitsCount />', () => {
  const setUp = (visitsCount: number, shortUrl: ShortUrl) => render(
    <ShortUrlVisitsCount visitsCount={visitsCount} shortUrl={shortUrl} />,
  );

  it.each([undefined, {}])('just returns visits when no maxVisits is provided', (meta) => {
    const visitsCount = 45;
    const { container } = setUp(visitsCount, Mock.of<ShortUrl>({ meta }));

    expect(container.firstChild).toHaveTextContent(`${visitsCount}`);
    expect(container.querySelector('.short-urls-visits-count__max-visits-control')).not.toBeInTheDocument();
  });

  it('displays the maximum amount of visits when present', () => {
    const visitsCount = 45;
    const maxVisits = 500;
    const meta = { maxVisits };
    const { container } = setUp(visitsCount, Mock.of<ShortUrl>({ meta }));

    expect(container.firstChild).toHaveTextContent(`/ ${maxVisits}`);
    expect(container.querySelector('.short-urls-visits-count__max-visits-control')).toBeInTheDocument();
  });
});
