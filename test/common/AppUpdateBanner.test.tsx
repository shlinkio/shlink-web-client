import { AppUpdateBanner } from '../../src/common/AppUpdateBanner';
import { checkAccessibility } from '../__helpers__/accessibility';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<AppUpdateBanner />', () => {
  const onClose = vi.fn();
  const forceUpdate = vi.fn();
  const setUp = () => renderWithEvents(<AppUpdateBanner isOpen onClose={onClose} forceUpdate={forceUpdate} />);

  it('passes a11y checks', () => checkAccessibility(setUp()));

  it('renders initial state', async () => {
    const page = await setUp();

    await expect.element(page.getByRole('heading')).toHaveTextContent('This app has just been updated!');
    await expect.element(page.getByText('Restarting...')).not.toBeInTheDocument();
    await expect.element(page.getByText('Restart now')).not.toHaveAttribute('disabled');
  });

  it('invokes toggle when alert is closed', async () => {
    const { user, ...page } = await setUp();

    expect(onClose).not.toHaveBeenCalled();
    await user.click(page.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalled();
  });

  it('triggers the update when clicking the button', async () => {
    const { user, ...page } = await setUp();

    expect(forceUpdate).not.toHaveBeenCalled();
    await user.click(page.getByText(/^Restart now/));
    expect(forceUpdate).toHaveBeenCalled();
    await expect.element(page.getByText('Restarting...')).toBeInTheDocument();
    await expect.element(page.getByText(/^Restart now/)).not.toBeInTheDocument();
  });
});
