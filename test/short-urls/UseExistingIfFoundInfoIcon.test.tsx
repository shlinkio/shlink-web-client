import { fireEvent, render, screen } from '@testing-library/react';
import { UseExistingIfFoundInfoIcon } from '../../src/short-urls/UseExistingIfFoundInfoIcon';

describe('<UseExistingIfFoundInfoIcon />', () => {
  it('shows modal when icon is clicked', async () => {
    render(<UseExistingIfFoundInfoIcon />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    fireEvent.click(screen.getByTitle('What does this mean?').firstChild as Node);
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });
});
