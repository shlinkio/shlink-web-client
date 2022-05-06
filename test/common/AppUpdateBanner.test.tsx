import { fireEvent, render, screen } from '@testing-library/react';
import { AppUpdateBanner } from '../../src/common/AppUpdateBanner';

describe('<AppUpdateBanner />', () => {
  const toggle = jest.fn();
  const forceUpdate = jest.fn();

  beforeEach(() => render(<AppUpdateBanner isOpen toggle={toggle} forceUpdate={forceUpdate} />));

  afterEach(jest.clearAllMocks);

  it('renders initial state', () => {
    expect(screen.getByRole('heading')).toHaveTextContent('This app has just been updated!');
    expect(screen.queryByText('Restarting...')).not.toBeInTheDocument();
    expect(screen.getByText('Restart now')).not.toHaveAttribute('disabled');
  });

  it('invokes toggle when alert is closed', () => {
    expect(toggle).not.toHaveBeenCalled();
    fireEvent.click(screen.getByLabelText('Close'));
    expect(toggle).toHaveBeenCalled();
  });

  it('triggers the update when clicking the button', async () => {
    expect(forceUpdate).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText(/^Restart now/));
    expect(forceUpdate).toHaveBeenCalled();
    expect(await screen.findByText('Restarting...')).toBeInTheDocument();
    expect(screen.queryByText(/^Restart now/)).not.toBeInTheDocument();
  });
});
