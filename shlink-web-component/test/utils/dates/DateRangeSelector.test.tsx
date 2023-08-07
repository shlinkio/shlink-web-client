import { screen, waitFor } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import type { DateRangeSelectorProps } from '../../../src/utils/dates/DateRangeSelector';
import { DateRangeSelector } from '../../../src/utils/dates/DateRangeSelector';
import type { DateInterval } from '../../../src/utils/dates/helpers/dateIntervals';
import { renderWithEvents } from '../../__helpers__/setUpTest';

describe('<DateRangeSelector />', () => {
  const onDatesChange = vi.fn();
  const setUp = async (props: Partial<DateRangeSelectorProps> = {}) => {
    const result = renderWithEvents(
      <DateRangeSelector
        {...fromPartial<DateRangeSelectorProps>(props)}
        defaultText="Default text"
        onDatesChange={onDatesChange}
      />,
    );

    await result.user.click(screen.getByRole('button'));
    await waitFor(() => screen.getByRole('menu'));

    return result;
  };

  it('renders proper amount of items', async () => {
    const { container } = await setUp();

    expect(screen.getAllByRole('menuitem')).toHaveLength(8);
    expect(screen.getByRole('heading')).toHaveTextContent('Custom:');
    expect(container.querySelector('.dropdown-divider')).toBeInTheDocument();
    expect(container.querySelector('.dropdown-item-text')).toBeInTheDocument();
  });

  it.each([
    [undefined, 0],
    ['all' as DateInterval, 1],
    ['today' as DateInterval, 1],
    ['yesterday' as DateInterval, 1],
    ['last7Days' as DateInterval, 1],
    ['last30Days' as DateInterval, 1],
    ['last90Days' as DateInterval, 1],
    ['last180Days' as DateInterval, 1],
    ['last365Days' as DateInterval, 1],
    [{ startDate: new Date() }, 0],
  ])('sets proper element as active based on provided date range', async (initialDateRange, expectedActiveItems) => {
    const { container } = await setUp({ initialDateRange });
    expect(container.querySelectorAll('.active')).toHaveLength(expectedActiveItems);
  });

  it('triggers onDatesChange callback when selecting an element', async () => {
    const { user } = await setUp();

    await user.click(screen.getByPlaceholderText('Since...'));
    await user.click(screen.getAllByRole('option')[0]);

    await user.click(screen.getByPlaceholderText('Until...'));
    await user.click(screen.getAllByRole('option')[0]);

    await user.click(screen.getAllByRole('menuitem')[0]);

    expect(onDatesChange).toHaveBeenCalledTimes(3);
  });

  it('propagates default text to DateIntervalDropdownItems', async () => {
    await setUp();
    expect(screen.getAllByText('Default text')).toHaveLength(2);
  });
});
