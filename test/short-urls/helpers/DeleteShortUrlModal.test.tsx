import { screen } from '@testing-library/react';
import { Mock } from 'ts-mockery';
import { DeleteShortUrlModal } from '../../../src/short-urls/helpers/DeleteShortUrlModal';
import { ShortUrl } from '../../../src/short-urls/data';
import { ShortUrlDeletion } from '../../../src/short-urls/reducers/shortUrlDeletion';
import { renderWithEvents } from '../../__helpers__/setUpTest';
import { ErrorTypeV2, ErrorTypeV3, InvalidShortUrlDeletion, ProblemDetailsError } from '../../../src/api/types/errors';

describe('<DeleteShortUrlModal />', () => {
  const shortUrl = Mock.of<ShortUrl>({
    tags: [],
    shortCode: 'abc123',
    longUrl: 'https://long-domain.com/foo/bar',
  });
  const deleteShortUrl = jest.fn();
  const setUp = (shortUrlDeletion: Partial<ShortUrlDeletion>) => renderWithEvents(
    <DeleteShortUrlModal
      isOpen
      shortUrl={shortUrl}
      shortUrlDeletion={Mock.of<ShortUrlDeletion>(shortUrlDeletion)}
      deleteShortUrl={deleteShortUrl}
      toggle={() => {}}
      resetDeleteShortUrl={() => {}}
    />,
  );

  afterEach(jest.clearAllMocks);

  it('shows generic error when non-threshold error occurs', () => {
    setUp({
      loading: false,
      error: true,
      shortCode: 'abc123',
      errorData: Mock.of<ProblemDetailsError>({ type: 'OTHER_ERROR' }),
    });
    expect(screen.getByText('Something went wrong while deleting the URL :(').parentElement).not.toHaveClass(
      'bg-warning',
    );
  });

  it.each([
    [Mock.of<InvalidShortUrlDeletion>({ type: ErrorTypeV3.INVALID_SHORT_URL_DELETION })],
    [Mock.of<InvalidShortUrlDeletion>({ type: ErrorTypeV2.INVALID_SHORT_URL_DELETION })],
  ])('shows specific error when threshold error occurs', (errorData) => {
    setUp({ loading: false, error: true, shortCode: 'abc123', errorData });
    expect(screen.getByText('Something went wrong while deleting the URL :(').parentElement).toHaveClass('bg-warning');
  });

  it('disables submit button when loading', () => {
    setUp({
      loading: true,
      error: false,
      shortCode: 'abc123',
    });
    expect(screen.getByRole('button', { name: 'Deleting...' })).toHaveAttribute('disabled');
  });

  it('enables submit button when proper short code is provided', async () => {
    const shortCode = 'abc123';
    const { user } = setUp({
      loading: false,
      error: false,
      shortCode,
    });
    const getDeleteBtn = () => screen.getByRole('button', { name: 'Delete' });

    expect(getDeleteBtn()).toHaveAttribute('disabled');
    await user.type(screen.getByPlaceholderText(/^Insert the short code/), shortCode);
    expect(getDeleteBtn()).not.toHaveAttribute('disabled');
  });

  it('tries to delete short URL when form is submit', async () => {
    const shortCode = 'abc123';
    const { user } = setUp({
      loading: false,
      error: false,
      shortCode,
    });

    expect(deleteShortUrl).not.toHaveBeenCalled();
    await user.type(screen.getByPlaceholderText(/^Insert the short code/), shortCode);
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(deleteShortUrl).toHaveBeenCalledTimes(1);
  });
});
