import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateInterval, rangeOrIntervalToString } from '../../../src/utils/dates/types';
import { DateIntervalSelector } from '../../../src/utils/dates/DateIntervalSelector';

describe('<DateIntervalSelector />', () => {
  const activeInterval: DateInterval = 'last7Days';
  const onChange = jest.fn();
  const setUp = () => ({
    user: userEvent.setup(),
    ...render(<DateIntervalSelector allText="All text" active={activeInterval} onChange={onChange} />),
  });

  it('passes props down to nested DateIntervalDropdownItems', async () => {
    const { user } = setUp();
    const btn = screen.getByRole('button');

    await user.click(btn);
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());

    const items = screen.getAllByRole('menuitem');

    expect(btn).toHaveTextContent(rangeOrIntervalToString(activeInterval) ?? '');
    expect(items).toHaveLength(8);
  });
});
