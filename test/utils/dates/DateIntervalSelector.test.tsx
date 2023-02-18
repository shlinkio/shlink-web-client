import { screen, waitFor } from '@testing-library/react';
import type { DateInterval } from '../../../src/utils/helpers/dateIntervals';
import { rangeOrIntervalToString } from '../../../src/utils/helpers/dateIntervals';
import { DateIntervalSelector } from '../../../src/utils/dates/DateIntervalSelector';
import { renderWithEvents } from '../../__helpers__/setUpTest';

describe('<DateIntervalSelector />', () => {
  const activeInterval: DateInterval = 'last7Days';
  const onChange = jest.fn();
  const setUp = () => renderWithEvents(
    <DateIntervalSelector allText="All text" active={activeInterval} onChange={onChange} />,
  );

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
