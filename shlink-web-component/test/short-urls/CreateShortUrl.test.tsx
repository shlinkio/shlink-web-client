import { render, screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { CreateShortUrl as createShortUrlsCreator } from '../../src/short-urls/CreateShortUrl';
import type { ShortUrlCreation } from '../../src/short-urls/reducers/shortUrlCreation';
import { SettingsProvider } from '../../src/utils/settings';

describe('<CreateShortUrl />', () => {
  const ShortUrlForm = () => <span>ShortUrlForm</span>;
  const CreateShortUrlResult = () => <span>CreateShortUrlResult</span>;
  const shortUrlCreation = { validateUrls: true };
  const shortUrlCreationResult = fromPartial<ShortUrlCreation>({});
  const createShortUrl = vi.fn(async () => Promise.resolve());
  const CreateShortUrl = createShortUrlsCreator(ShortUrlForm, CreateShortUrlResult);
  const setUp = () => render(
    <SettingsProvider value={fromPartial({ shortUrlCreation })}>
      <CreateShortUrl
        shortUrlCreation={shortUrlCreationResult}
        createShortUrl={createShortUrl}
        resetCreateShortUrl={() => {}}
      />
    </SettingsProvider>,
  );

  it('renders computed initial state', () => {
    setUp();

    expect(screen.getByText('ShortUrlForm')).toBeInTheDocument();
    expect(screen.getByText('CreateShortUrlResult')).toBeInTheDocument();
  });
});
