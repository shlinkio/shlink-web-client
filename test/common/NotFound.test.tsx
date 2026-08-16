import { MemoryRouter } from 'react-router';
import { NotFound } from '../../src/common/NotFound';
import { checkAccessibility } from '../__helpers__/accessibility';
import { render } from '../__helpers__/setUpTest';

describe('<NotFound />', () => {
  const setUp = (props = {}) =>
    render(
      <MemoryRouter>
        <NotFound {...props} />
      </MemoryRouter>,
    );

  it('passes a11y checks', () => checkAccessibility(setUp()));

  it('shows expected error title', async () => {
    const page = await setUp();
    await expect.element(page.getByText('Oops! We could not find requested route.')).toBeInTheDocument();
  });

  it('shows expected error message', async () => {
    const page = await setUp();
    await expect
      .element(
        page.getByText(
          "Use your browser's back button to navigate to the page you have previously come from, or just press this button.",
        ),
      )
      .toBeInTheDocument();
  });

  it.each([
    [{}, '/', 'Home'],
    [{ to: '/foo/bar', children: 'Hello' }, '/foo/bar', 'Hello'],
    [{ to: '/baz-bar', children: <>Foo</> }, '/baz-bar', 'Foo'],
  ])('shows expected link and text', async (props, expectedLink, expectedText) => {
    const page = await setUp(props);
    const link = page.getByRole('link');

    await expect.element(link).toHaveAttribute('href', expectedLink);
    await expect.element(link).toHaveTextContent(expectedText);
  });
});
