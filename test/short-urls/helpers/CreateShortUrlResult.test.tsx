import { screen } from '@testing-library/react';
import { Mock } from 'ts-mockery';
import { CreateShortUrlResult as createResult } from '../../../src/short-urls/helpers/CreateShortUrlResult';
import { ShortUrl } from '../../../src/short-urls/data';
import { TimeoutToggle } from '../../../src/utils/helpers/hooks';
import { renderWithEvents } from '../../__mocks__/setUpTest';

describe('<CreateShortUrlResult />', () => {
  const copyToClipboard = jest.fn();
  const useTimeoutToggle = jest.fn(() => [false, copyToClipboard]) as TimeoutToggle;
  const CreateShortUrlResult = createResult(useTimeoutToggle);
  const setUp = (result: ShortUrl | null = null, error = false) => renderWithEvents(
    <CreateShortUrlResult resetCreateShortUrl={() => {}} result={result} error={error} saving={false} />,
  );

  afterEach(jest.clearAllMocks);

  it('renders an error when error is true', () => {
    setUp(Mock.all<ShortUrl>(), true);
    expect(screen.getByText('An error occurred while creating the URL :(')).toBeInTheDocument();
  });

  it('renders nothing when no result is provided', () => {
    const { container } = setUp();
    expect(container.firstChild).toBeNull();
  });

  it('renders a result message when result is provided', () => {
    setUp(Mock.of<ShortUrl>({ shortUrl: 'https://doma.in/abc123' }));
    expect(screen.getByText(/The short URL is/)).toHaveTextContent('Great! The short URL is https://doma.in/abc123');
  });

  it('Invokes tooltip timeout when copy to clipboard button is clicked', async () => {
    const { user } = setUp(Mock.of<ShortUrl>({ shortUrl: 'https://doma.in/abc123' }));

    expect(copyToClipboard).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button'));
    expect(copyToClipboard).toHaveBeenCalledTimes(1);
  });
});
