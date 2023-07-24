import { render, screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { CreateShortUrl as createShortUrlsCreator } from '../../shlink-web-component/short-urls/CreateShortUrl';
import type { ShortUrlCreation } from '../../shlink-web-component/short-urls/reducers/shortUrlCreation';

describe('<CreateShortUrl />', () => {
  const ShortUrlForm = () => <span>ShortUrlForm</span>;
  const CreateShortUrlResult = () => <span>CreateShortUrlResult</span>;
  const shortUrlCreation = { validateUrls: true };
  const shortUrlCreationResult = fromPartial<ShortUrlCreation>({});
  const createShortUrl = vi.fn(async () => Promise.resolve());
  const CreateShortUrl = createShortUrlsCreator(ShortUrlForm, CreateShortUrlResult);
  const setUp = () => render(
    <CreateShortUrl
      shortUrlCreation={shortUrlCreationResult}
      createShortUrl={createShortUrl}
      selectedServer={null}
      resetCreateShortUrl={() => {}}
      settings={fromPartial({ shortUrlCreation })}
    />,
  );

  it('renders computed initial state', () => {
    setUp();

    expect(screen.getByText('ShortUrlForm')).toBeInTheDocument();
    expect(screen.getByText('CreateShortUrlResult')).toBeInTheDocument();
  });
});
