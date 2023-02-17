import { screen } from '@testing-library/react';
import { Mock } from 'ts-mockery';
import { MemoryRouter } from 'react-router-dom';
import { ShortUrlsRowMenu as createShortUrlsRowMenu } from '../../../src/short-urls/helpers/ShortUrlsRowMenu';
import { ReachableServer } from '../../../src/servers/data';
import { ShortUrl } from '../../../src/short-urls/data';
import { renderWithEvents } from '../../__helpers__/setUpTest';

describe('<ShortUrlsRowMenu />', () => {
  const ShortUrlsRowMenu = createShortUrlsRowMenu(() => <i>DeleteShortUrlModal</i>, () => <i>QrCodeModal</i>);
  const selectedServer = Mock.of<ReachableServer>({ id: 'abc123' });
  const shortUrl = Mock.of<ShortUrl>({
    shortCode: 'abc123',
    shortUrl: 'https://s.test/abc123',
  });
  const setUp = () => renderWithEvents(
    <MemoryRouter>
      <ShortUrlsRowMenu selectedServer={selectedServer} shortUrl={shortUrl} />
    </MemoryRouter>,
  );

  it('renders modal windows', () => {
    setUp();

    expect(screen.getByText('DeleteShortUrlModal')).toBeInTheDocument();
    expect(screen.getByText('QrCodeModal')).toBeInTheDocument();
  });

  it('renders correct amount of menu items', async () => {
    const { user } = setUp();

    await user.click(screen.getByRole('button'));
    expect(screen.getAllByRole('menuitem')).toHaveLength(4);
  });
});
