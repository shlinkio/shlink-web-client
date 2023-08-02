import { screen, waitFor } from '@testing-library/react';
import type { DateInterval } from '../../../src/utils/dates/DateIntervalSelector';
import { DateIntervalSelector, INTERVAL_TO_STRING_MAP } from '../../../src/utils/dates/DateIntervalSelector';
import { renderWithEvents } from '../../__helpers__/setUpTest';

describe('<DateIntervalSelector />', () => {
  const activeInterval: DateInterval = 'last7Days';
  const onChange = vi.fn();
  const setUp = () => renderWithEvents(
    <DateIntervalSelector allText="All text" active={activeInterval} onChange={onChange} />,
  );

  it('passes props down to nested DateIntervalDropdownItems', async () => {
    const { user } = setUp();
    const btn = screen.getByRole('button');

    await user.click(btn);
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());

    const items = screen.getAllByRole('menuitem');

    expect(btn).toHaveTextContent(INTERVAL_TO_STRING_MAP[activeInterval] ?? '');
    expect(items).toHaveLength(8);
  });
});
