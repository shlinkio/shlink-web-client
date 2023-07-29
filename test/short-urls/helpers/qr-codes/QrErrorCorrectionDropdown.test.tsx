import { screen } from '@testing-library/react';
import { QrErrorCorrectionDropdown } from '../../../../shlink-web-component/short-urls/helpers/qr-codes/QrErrorCorrectionDropdown';
import type { QrErrorCorrection } from '../../../../shlink-web-component/utils/helpers/qrCodes';
import { renderWithEvents } from '../../../__helpers__/setUpTest';

describe('<QrErrorCorrectionDropdown />', () => {
  const initialErrorCorrection: QrErrorCorrection = 'Q';
  const setErrorCorrection = vi.fn();
  const setUp = () => renderWithEvents(
    <QrErrorCorrectionDropdown errorCorrection={initialErrorCorrection} setErrorCorrection={setErrorCorrection} />,
  );

  it('renders initial state', async () => {
    const { user } = setUp();
    const btn = screen.getByRole('button');

    expect(btn).toHaveTextContent('Error correction (Q)');
    await user.click(btn);
    const items = screen.getAllByRole('menuitem');

    expect(items[0]).not.toHaveClass('active');
    expect(items[1]).not.toHaveClass('active');
    expect(items[2]).toHaveClass('active');
    expect(items[3]).not.toHaveClass('active');
  });

  it('invokes callback when items are clicked', async () => {
    const { user } = setUp();
    const clickItem = async (name: RegExp) => {
      await user.click(screen.getByRole('button'));
      await user.click(screen.getByRole('menuitem', { name }));
    };

    expect(setErrorCorrection).not.toHaveBeenCalled();

    await clickItem(/ow/);
    expect(setErrorCorrection).toHaveBeenCalledWith('L');

    await clickItem(/edium/);
    expect(setErrorCorrection).toHaveBeenCalledWith('M');

    await clickItem(/uartile/);
    expect(setErrorCorrection).toHaveBeenCalledWith('Q');

    await clickItem(/igh/);
    expect(setErrorCorrection).toHaveBeenCalledWith('H');
  });
});
