import { fireEvent, screen } from '@testing-library/react';
import { Mock } from 'ts-mockery';
import { QrCodeModal as createQrCodeModal } from '../../../src/short-urls/helpers/QrCodeModal';
import { ShortUrl } from '../../../src/short-urls/data';
import { ReachableServer } from '../../../src/servers/data';
import { SemVer } from '../../../src/utils/helpers/version';
import { ImageDownloader } from '../../../src/common/services/ImageDownloader';
import { renderWithEvents } from '../../__helpers__/setUpTest';

describe('<QrCodeModal />', () => {
  const saveImage = vi.fn().mockReturnValue(Promise.resolve());
  const QrCodeModal = createQrCodeModal(Mock.of<ImageDownloader>({ saveImage }));
  const shortUrl = 'https://doma.in/abc123';
  const setUp = (version: SemVer = '2.8.0') => renderWithEvents(
    <QrCodeModal
      isOpen
      shortUrl={Mock.of<ShortUrl>({ shortUrl })}
      selectedServer={Mock.of<ReachableServer>({ version })}
      toggle={() => {}}
    />,
  );

  afterEach(vi.clearAllMocks);

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
    const { container } = setUp();
    const dropdowns = screen.getAllByRole('button');
    const firstCol = container.parentNode?.querySelectorAll('.d-grid').item(0);

    expect(dropdowns).toHaveLength(2 + 1); // Add one because of the close button
    expect(firstCol).toHaveClass('col-md-4');
  });

  it('saves the QR code image when clicking the Download button', async () => {
    const { user } = setUp('2.9.0');

    expect(saveImage).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: /^Download/ }));
    expect(saveImage).toHaveBeenCalledTimes(1);
  });
});
