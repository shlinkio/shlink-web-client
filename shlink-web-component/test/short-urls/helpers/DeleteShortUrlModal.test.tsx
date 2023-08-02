import { screen, waitFor } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import type { InvalidShortUrlDeletion } from '../../../src/api-contract';
import { ErrorTypeV2, ErrorTypeV3 } from '../../../src/api-contract';
import type { ShortUrl } from '../../../src/short-urls/data';
import { DeleteShortUrlModal } from '../../../src/short-urls/helpers/DeleteShortUrlModal';
import type { ShortUrlDeletion } from '../../../src/short-urls/reducers/shortUrlDeletion';
import { renderWithEvents } from '../../__helpers__/setUpTest';
import { TestModalWrapper } from '../../__helpers__/TestModalWrapper';

describe('<DeleteShortUrlModal />', () => {
  const shortUrl = fromPartial<ShortUrl>({
    tags: [],
    shortCode: 'abc123',
    longUrl: 'https://long-domain.com/foo/bar',
  });
  const deleteShortUrl = vi.fn().mockResolvedValue(undefined);
  const shortUrlDeleted = vi.fn();
  const setUp = (shortUrlDeletion: Partial<ShortUrlDeletion>) => renderWithEvents(
    <TestModalWrapper
      renderModal={(args) => (
        <DeleteShortUrlModal
          {...args}
          shortUrl={shortUrl}
          shortUrlDeletion={fromPartial(shortUrlDeletion)}
          deleteShortUrl={deleteShortUrl}
          shortUrlDeleted={shortUrlDeleted}
          resetDeleteShortUrl={vi.fn()}
        />
      )}
    />,
  );

  it('shows generic error when non-threshold error occurs', () => {
    setUp({
      loading: false,
      error: true,
      shortCode: 'abc123',
      errorData: fromPartial({ type: 'OTHER_ERROR' }),
    });
    expect(screen.getByText('Something went wrong while deleting the URL :(').parentElement).not.toHaveClass(
      'bg-warning',
    );
  });

  it.each([
    [fromPartial<InvalidShortUrlDeletion>({ type: ErrorTypeV3.INVALID_SHORT_URL_DELETION })],
    [fromPartial<InvalidShortUrlDeletion>({ type: ErrorTypeV2.INVALID_SHORT_URL_DELETION })],
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
    const { user } = setUp({
      loading: false,
      error: false,
      shortCode: 'abc123',
    });
    const getDeleteBtn = () => screen.getByRole('button', { name: 'Delete' });

    expect(getDeleteBtn()).toHaveAttribute('disabled');
    await user.type(screen.getByPlaceholderText('Insert delete'), 'delete');
    expect(getDeleteBtn()).not.toHaveAttribute('disabled');
  });

  it('tries to delete short URL when form is submit', async () => {
    const { user } = setUp({
      loading: false,
      error: false,
      deleted: true,
      shortCode: 'abc123',
    });

    expect(deleteShortUrl).not.toHaveBeenCalled();
    await user.type(screen.getByPlaceholderText('Insert delete'), 'delete');
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(deleteShortUrl).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(shortUrlDeleted).toHaveBeenCalledTimes(1));
  });
});
