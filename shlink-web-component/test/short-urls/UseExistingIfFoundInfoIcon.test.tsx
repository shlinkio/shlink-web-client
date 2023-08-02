import { screen } from '@testing-library/react';
import { UseExistingIfFoundInfoIcon } from '../../src/short-urls/UseExistingIfFoundInfoIcon';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<UseExistingIfFoundInfoIcon />', () => {
  it('shows modal when icon is clicked', async () => {
    const { user } = renderWithEvents(<UseExistingIfFoundInfoIcon />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByTitle('What does this mean?').firstElementChild as Element);
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });
});
