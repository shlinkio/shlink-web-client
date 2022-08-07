import { render, screen } from '@testing-library/react';
import { Mock } from 'ts-mockery';
import { CreateShortUrl as createShortUrlsCreator } from '../../src/short-urls/CreateShortUrl';
import { ShortUrlCreation } from '../../src/short-urls/reducers/shortUrlCreation';
import { Settings } from '../../src/settings/reducers/settings';

describe('<CreateShortUrl />', () => {
  const ShortUrlForm = () => <span>ShortUrlForm</span>;
  const CreateShortUrlResult = () => <span>CreateShortUrlResult</span>;
  const shortUrlCreation = { validateUrls: true };
  const shortUrlCreationResult = Mock.all<ShortUrlCreation>();
  const createShortUrl = jest.fn(async () => Promise.resolve());
  const CreateShortUrl = createShortUrlsCreator(ShortUrlForm, CreateShortUrlResult);
  const setUp = () => render(
    <CreateShortUrl
      shortUrlCreationResult={shortUrlCreationResult}
      createShortUrl={createShortUrl}
      selectedServer={null}
      resetCreateShortUrl={() => {}}
      settings={Mock.of<Settings>({ shortUrlCreation })}
    />,
  );

  it('renders computed initial state', () => {
    setUp();

    expect(screen.getByText('ShortUrlForm')).toBeInTheDocument();
    expect(screen.getByText('CreateShortUrlResult')).toBeInTheDocument();
  });
});
