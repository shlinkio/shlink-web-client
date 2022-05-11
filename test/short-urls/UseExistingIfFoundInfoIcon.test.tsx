import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UseExistingIfFoundInfoIcon } from '../../src/short-urls/UseExistingIfFoundInfoIcon';

describe('<UseExistingIfFoundInfoIcon />', () => {
  it('shows modal when icon is clicked', async () => {
    const user = userEvent.setup();
    render(<UseExistingIfFoundInfoIcon />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByTitle('What does this mean?').firstElementChild as Element);
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });
});
