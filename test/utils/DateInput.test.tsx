import { screen, waitFor } from '@testing-library/react';
import { Mock } from 'ts-mockery';
import { parseISO } from 'date-fns';
import { DateInput, DateInputProps } from '../../src/utils/DateInput';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<DateInput />', () => {
  const setUp = (props: Partial<DateInputProps> = {}) => renderWithEvents(
    <DateInput {...Mock.of<DateInputProps>(props)} />,
  );

  it('shows calendar icon when input is not clearable', () => {
    setUp({ isClearable: false });
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();
  });

  it('shows calendar icon when input is clearable but selected value is nil', () => {
    setUp({ isClearable: true, selected: null });
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();
  });

  it('does not show calendar icon when input is clearable', () => {
    setUp({ isClearable: true, selected: new Date() });
    expect(screen.queryByRole('img', { hidden: true })).not.toBeInTheDocument();
  });

  it('shows popper on element click', async () => {
    const { user, container } = setUp({ placeholderText: 'foo' });

    expect(container.querySelector('.react-datepicker')).not.toBeInTheDocument();
    await user.click(screen.getByPlaceholderText('foo'));
    await waitFor(() => expect(container.querySelector('.react-datepicker')).toBeInTheDocument());
  });

  it.each([
    [undefined, '2022-01-01'],
    ['yyyy-MM-dd', '2022-01-01'],
    ['yyyy-MM-dd HH:mm', '2022-01-01 15:18'],
    ['HH:mm:ss', '15:18:36'],
  ])('shows date in expected format', (dateFormat, expectedValue) => {
    setUp({ placeholderText: 'foo', selected: parseISO('2022-01-01T15:18:36'), dateFormat });
    expect(screen.getByPlaceholderText('foo')).toHaveValue(expectedValue);
  });
});
