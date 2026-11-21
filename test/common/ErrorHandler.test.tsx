import { fromPartial } from '@total-typescript/shoehorn';
import type { ReactNode } from 'react';
import { ErrorHandler } from '../../src/common/ErrorHandler';
import { checkAccessibility } from '../__helpers__/accessibility';
import { renderWithEvents } from '../__helpers__/setUpTest';

const ComponentWithError = () => {
  throw new Error('Error!!');
};

describe('<ErrorHandler />', () => {
  const reload = vi.fn();
  const location = fromPartial<Window['location']>({ reload });
  const cons = fromPartial<Console>({ error: vi.fn() });
  const setUp = (children: ReactNode = 'Error') =>
    renderWithEvents(
      <ErrorHandler console={cons} location={location}>
        {children}
      </ErrorHandler>,
    );

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {}); // Silence react errors
  });

  it('passes a11y checks', () => checkAccessibility(setUp()));

  it('renders children when no error has occurred', async () => {
    const screen = await setUp(<span>Foo</span>);

    await expect.element(screen.getByText('Foo')).toBeInTheDocument();
    await expect.element(screen.getByText('Oops! This is awkward :S')).not.toBeInTheDocument();
    await expect.element(screen.getByRole('button')).not.toBeInTheDocument();
  });

  it('renders error page when error has occurred', async () => {
    const screen = await setUp(<ComponentWithError />);

    await expect.element(screen.getByText('Oops! This is awkward :S')).toBeInTheDocument();
    await expect.element(screen.getByRole('button')).toBeInTheDocument();
  });

  it('reloads page on button click', async () => {
    const { user, ...screen } = await setUp(<ComponentWithError />);

    expect(reload).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button'));
    expect(reload).toHaveBeenCalled();
  });
});
