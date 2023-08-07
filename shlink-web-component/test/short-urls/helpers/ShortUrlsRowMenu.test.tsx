import { screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { MemoryRouter } from 'react-router-dom';
import type { ShlinkShortUrl } from '../../../src/api-contract';
import { ShortUrlsRowMenu as createShortUrlsRowMenu } from '../../../src/short-urls/helpers/ShortUrlsRowMenu';
import { renderWithEvents } from '../../__helpers__/setUpTest';

describe('<ShortUrlsRowMenu />', () => {
  const ShortUrlsRowMenu = createShortUrlsRowMenu(() => <i>DeleteShortUrlModal</i>, () => <i>QrCodeModal</i>);
  const shortUrl = fromPartial<ShlinkShortUrl>({
    shortCode: 'abc123',
    shortUrl: 'https://s.test/abc123',
  });
  const setUp = () => renderWithEvents(
    <MemoryRouter>
      <ShortUrlsRowMenu shortUrl={shortUrl} />
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
