import { screen, waitFor } from '@testing-library/react';
import { Mock } from 'ts-mockery';
import { formatDistance, parseISO } from 'date-fns';
import { ShortUrlVisitsHeader } from '../../src/visits/ShortUrlVisitsHeader';
import { ShortUrlDetail } from '../../src/short-urls/reducers/shortUrlDetail';
import { ShortUrlVisits } from '../../src/visits/reducers/shortUrlVisits';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<ShortUrlVisitsHeader />', () => {
  const dateCreated = '2018-01-01T10:00:00+00:00';
  const longUrl = 'https://foo.bar/bar/foo';
  const shortUrlVisits = Mock.of<ShortUrlVisits>({
    visits: [{}, {}, {}],
  });
  const goBack = jest.fn();
  const setUp = (title?: string | null) => {
    const shortUrlDetail = Mock.of<ShortUrlDetail>({
      shortUrl: {
        shortUrl: 'https://s.test/abc123',
        longUrl,
        dateCreated,
        title,
      },
      loading: false,
    });
    return renderWithEvents(
      <ShortUrlVisitsHeader shortUrlDetail={shortUrlDetail} shortUrlVisits={shortUrlVisits} goBack={goBack} />,
    );
  };

  it('shows when the URL was created', async () => {
    const { user } = setUp();
    const dateElement = screen.getByText(`${formatDistance(new Date(), parseISO(dateCreated))} ago`);

    expect(dateElement).toBeInTheDocument();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    await user.hover(dateElement);
    await waitFor(() => expect(screen.getByRole('tooltip')).toHaveTextContent('2018-01-01 10:00'));
  });

  it.each([
    [null, `Long URL: ${longUrl}`],
    [undefined, `Long URL: ${longUrl}`],
    ['My cool title', 'Title: My cool title'],
  ])('shows the long URL and title', (title, expectedContent) => {
    const { container } = setUp(title);

    expect(container.querySelector('.long-url-container')).toHaveTextContent(expectedContent);
    expect(screen.getByRole('link', { name: title ?? longUrl })).toHaveAttribute('href', longUrl);
  });
});
