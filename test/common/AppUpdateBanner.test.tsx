import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppUpdateBanner } from '../../src/common/AppUpdateBanner';

describe('<AppUpdateBanner />', () => {
  const toggle = jest.fn();
  const forceUpdate = jest.fn();
  const setUp = () => ({
    user: userEvent.setup(),
    ...render(<AppUpdateBanner isOpen toggle={toggle} forceUpdate={forceUpdate} />),
  });

  afterEach(jest.clearAllMocks);

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
