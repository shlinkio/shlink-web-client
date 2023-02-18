import { render } from '@testing-library/react';
import type { TimeProps } from '../../../src/utils/dates/Time';
import { Time } from '../../../src/utils/dates/Time';
import { parseDate } from '../../../src/utils/helpers/date';

describe('<Time />', () => {
  const setUp = (props: TimeProps) => render(<Time {...props} />);

  it.each([
    [{ date: parseDate('2020-05-05', 'yyyy-MM-dd') }, '1588636800000', '2020-05-05 00:00'],
    [{ date: parseDate('2021-03-20', 'yyyy-MM-dd'), format: 'dd/MM/yyyy' }, '1616198400000', '20/03/2021'],
  ])('includes expected dateTime and format', (props, expectedDateTime, expectedFormatted) => {
    const { container } = setUp(props);

    expect(container.firstChild).toHaveAttribute('datetime', expectedDateTime);
    expect(container.firstChild).toHaveTextContent(expectedFormatted);
  });

  it('renders relative times when requested', () => {
    const { container } = setUp({ date: new Date(), relative: true });
    expect(container.firstChild).toHaveTextContent(' ago');
  });
});
