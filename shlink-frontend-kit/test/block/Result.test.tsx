import { render, screen } from '@testing-library/react';
import type { ResultProps, ResultType } from '../../src';
import { Result } from '../../src';

describe('<Result />', () => {
  const setUp = (props: ResultProps) => render(<Result {...props} />);

  it.each([
    ['success' as ResultType, 'bg-main text-white'],
    ['error' as ResultType, 'bg-danger text-white'],
    ['warning' as ResultType, 'bg-warning'],
  ])('renders expected classes based on type', (type, expectedClasses) => {
    setUp({ type });
    expect(screen.getByRole('document')).toHaveClass(expectedClasses);
  });

  it.each([
    ['foo'],
    ['bar'],
  ])('renders provided classes in root element', (className) => {
    const { container } = setUp({ type: 'success', className });
    expect(container.firstChild).toHaveClass(className);
  });

  it.each([{ small: true }, { small: false }])('renders small results properly', ({ small }) => {
    const { container } = setUp({ type: 'success', small });
    const bigElement = container.querySelectorAll('.col-md-10');
    const smallElement = container.querySelectorAll('.col-12');

    expect(bigElement).toHaveLength(small ? 0 : 1);
    expect(smallElement).toHaveLength(small ? 1 : 0);
  });
});
