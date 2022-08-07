import { screen } from '@testing-library/react';
import { DateRangeRow } from '../../../src/utils/dates/DateRangeRow';
import { renderWithEvents } from '../../__helpers__/setUpTest';

describe('<DateRangeRow />', () => {
  const onEndDateChange = jest.fn();
  const onStartDateChange = jest.fn();
  const setUp = () => renderWithEvents(
    <DateRangeRow onEndDateChange={onEndDateChange} onStartDateChange={onStartDateChange} />,
  );

  afterEach(jest.clearAllMocks);

  it('renders two date inputs', () => {
    setUp();
    expect(screen.getAllByRole('textbox')).toHaveLength(2);
  });

  it('invokes start date callback when change event is triggered on first input', async () => {
    const { user } = setUp();

    expect(onStartDateChange).not.toHaveBeenCalled();
    await user.type(screen.getByPlaceholderText('Since...'), '2020-05-05');
    expect(onStartDateChange).toHaveBeenCalled();
  });

  it('invokes end date callback when change event is triggered on second input', async () => {
    const { user } = setUp();

    expect(onEndDateChange).not.toHaveBeenCalled();
    await user.type(screen.getByPlaceholderText('Until...'), '2022-05-05');
    expect(onEndDateChange).toHaveBeenCalled();
  });
});
