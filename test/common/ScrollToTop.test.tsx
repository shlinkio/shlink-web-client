import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ScrollToTop } from '../../src/common/ScrollToTop';

describe('<ScrollToTop />', () => {
  it.each([
    ['Foobar'],
    ['Barfoo'],
    ['Something'],
  ])('just renders children', (children) => {
    render(<MemoryRouter><ScrollToTop>{children}</ScrollToTop></MemoryRouter>);
    expect(screen.getByText(children)).toBeInTheDocument();
  });
});
