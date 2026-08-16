import { AppUpdateBanner } from '../../src/common/AppUpdateBanner';
import { checkAccessibility } from '../__helpers__/accessibility';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<AppUpdateBanner />', () => {
  const onClose = vi.fn();
  const forceUpdate = vi.fn();
  const setUp = () => renderWithEvents(<AppUpdateBanner isOpen onClose={onClose} forceUpdate={forceUpdate} />);

  it('passes a11y checks', () => checkAccessibility(setUp()));

  it('renders initial state', async () => {
    const screen = await setUp();

    await expect.element(screen.getByRole('heading')).toHaveTextContent('This app has just been updated!');
    await expect.element(screen.getByText('Restarting...')).not.toBeInTheDocument();
    await expect.element(screen.getByText('Restart now')).not.toHaveAttribute('disabled');
  });

  it('invokes toggle when alert is closed', async () => {
    const { user, ...screen } = await setUp();

    expect(onClose).not.toHaveBeenCalled();
    await user.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalled();
  });

  it('triggers the update when clicking the button', async () => {
    const { user, ...screen } = await setUp();

    expect(forceUpdate).not.toHaveBeenCalled();
    await user.click(screen.getByText(/^Restart now/));
    expect(forceUpdate).toHaveBeenCalled();
    await expect.element(screen.getByText('Restarting...')).toBeInTheDocument();
    await expect.element(screen.getByText(/^Restart now/)).not.toBeInTheDocument();
  });
});
