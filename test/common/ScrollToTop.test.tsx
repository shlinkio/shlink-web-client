import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ScrollToTop } from '../../src/common/ScrollToTop';
import { checkAccessibility } from '../__helpers__/accessibility';

describe('<ScrollToTop />', () => {
  const setUp = (children = 'Foo') => render(<MemoryRouter><ScrollToTop>{children}</ScrollToTop></MemoryRouter>);

  it('passes a11y checks', () => checkAccessibility(setUp()));

  it.each([
    ['Foobar'],
    ['Barfoo'],
    ['Something'],
  ])('just renders children', (children) => {
    setUp(children);
    expect(screen.getByText(children)).toBeInTheDocument();
  });
});
