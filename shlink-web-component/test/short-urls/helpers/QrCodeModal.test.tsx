import { fireEvent, screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { QrCodeModal as createQrCodeModal } from '../../../src/short-urls/helpers/QrCodeModal';
import { renderWithEvents } from '../../__helpers__/setUpTest';

describe('<QrCodeModal />', () => {
  const saveImage = vi.fn().mockReturnValue(Promise.resolve());
  const QrCodeModal = createQrCodeModal(fromPartial({ saveImage }));
  const shortUrl = 'https://s.test/abc123';
  const setUp = () => renderWithEvents(
    <QrCodeModal
      isOpen
      shortUrl={fromPartial({ shortUrl })}
      toggle={() => {}}
    />,
  );

  it('shows an external link to the URL in the header', () => {
    setUp();
    const externalLink = screen.getByRole('heading').querySelector('a');

    expect(externalLink).toBeInTheDocument();
    expect(externalLink).toHaveAttribute('href', shortUrl);
    expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it.each([
    [10, '/qr-code?size=300&format=png&errorCorrection=L&margin=10'],
    [0, '/qr-code?size=300&format=png&errorCorrection=L'],
  ])('displays an image with the QR code of the URL', async (margin, expectedUrl) => {
    const { container } = setUp();
    const marginControl = container.parentNode?.querySelectorAll('.form-control-range').item(1);

    if (marginControl) {
      fireEvent.change(marginControl, { target: { value: `${margin}` } });
    }

    expect(screen.getByRole('img')).toHaveAttribute('src', `${shortUrl}${expectedUrl}`);
    expect(screen.getByText(`${shortUrl}${expectedUrl}`)).toHaveAttribute('href', `${shortUrl}${expectedUrl}`);
  });

  it.each([
    [530, 0, 'lg'],
    [200, 0, undefined],
    [830, 0, 'xl'],
    [430, 80, 'lg'],
    [200, 50, undefined],
    [720, 100, 'xl'],
  ])('renders expected size', (size, margin, modalSize) => {
    const { container } = setUp();
    const formControls = container.parentNode?.querySelectorAll('.form-control-range');
    const sizeInput = formControls?.[0];
    const marginInput = formControls?.[1];

    sizeInput && fireEvent.change(sizeInput, { target: { value: `${size}` } });
    marginInput && fireEvent.change(marginInput, { target: { value: `${margin}` } });

    expect(screen.getByText(`Size: ${size}px`)).toBeInTheDocument();
    expect(screen.getByText(`Margin: ${margin}px`)).toBeInTheDocument();
    modalSize && expect(screen.getByRole('document')).toHaveClass(`modal-${modalSize}`);
  });

  it('shows expected components based on server version', () => {
    setUp();
    const dropdowns = screen.getAllByRole('button');

    expect(dropdowns).toHaveLength(2 + 2); // Add two because of the close and download buttons
  });

  it('saves the QR code image when clicking the Download button', async () => {
    const { user } = setUp();

    expect(saveImage).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: /^Download/ }));
    expect(saveImage).toHaveBeenCalledTimes(1);
  });
});
