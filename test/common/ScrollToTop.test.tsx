import { MemoryRouter } from 'react-router';
import { ScrollToTop } from '../../src/common/ScrollToTop';
import { checkAccessibility } from '../__helpers__/accessibility';
import { render } from '../__helpers__/setUpTest.tsx';

describe('<ScrollToTop />', () => {
  const setUp = (children = 'Foo') =>
    render(
      <MemoryRouter>
        <ScrollToTop>{children}</ScrollToTop>
      </MemoryRouter>,
    );

  it('passes a11y checks', () => checkAccessibility(setUp()));

  it.each([['Foobar'], ['Barfoo'], ['Something']])('just renders children', async (children) => {
    const screen = await setUp(children);
    await expect.element(screen.getByText(children)).toBeInTheDocument();
  });
});
