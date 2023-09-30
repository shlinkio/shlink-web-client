import { screen } from '@testing-library/react';
import { AppUpdateBanner } from '../../src/common/AppUpdateBanner';
import { checkAccessibility } from '../__helpers__/accessibility';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<AppUpdateBanner />', () => {
  const toggle = vi.fn();
  const forceUpdate = vi.fn();
  const setUp = () => renderWithEvents(<AppUpdateBanner isOpen toggle={toggle} forceUpdate={forceUpdate} />);

  it('passes a11y checks', () => checkAccessibility(setUp()));

  it('renders initial state', () => {
    setUp();

    expect(screen.getByRole('heading')).toHaveTextContent('This app has just been updated!');
    expect(screen.queryByText('Restarting...')).not.toBeInTheDocument();
    expect(screen.getByText('Restart now')).not.toHaveAttribute('disabled');
  });

  it('invokes toggle when alert is closed', async () => {
    const { user } = setUp();

    expect(toggle).not.toHaveBeenCalled();
    await user.click(screen.getByLabelText('Close'));
    expect(toggle).toHaveBeenCalled();
  });

  it('triggers the update when clicking the button', async () => {
    const { user } = setUp();

    expect(forceUpdate).not.toHaveBeenCalled();
    await user.click(screen.getByText(/^Restart now/));
    expect(forceUpdate).toHaveBeenCalled();
    expect(await screen.findByText('Restarting...')).toBeInTheDocument();
    expect(screen.queryByText(/^Restart now/)).not.toBeInTheDocument();
  });
});
