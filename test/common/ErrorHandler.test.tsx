import { screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import type { PropsWithChildren, ReactNode } from 'react';
import { ErrorHandler as BaseErrorHandler } from '../../src/common/ErrorHandler';
import { checkAccessibility } from '../__helpers__/accessibility';
import { renderWithEvents } from '../__helpers__/setUpTest';

const ComponentWithError = () => {
  throw new Error('Error!!');
};

describe('<ErrorHandler />', () => {
  const reload = vi.fn();
  const location = fromPartial<Window['location']>({ reload });
  const cons = fromPartial<Console>({ error: vi.fn() });
  const ErrorHandler = (props: PropsWithChildren) => <BaseErrorHandler console={cons} location={location} {...props} />;
  const setUp = (children: ReactNode = 'Error') => renderWithEvents(<ErrorHandler>{children}</ErrorHandler>);

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {}); // Silence react errors
  });

  it('passes a11y checks', () => checkAccessibility(setUp()));

  it('renders children when no error has occurred', () => {
    setUp(<span>Foo</span>);

    expect(screen.getByText('Foo')).toBeInTheDocument();
    expect(screen.queryByText('Oops! This is awkward :S')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders error page when error has occurred', () => {
    setUp(<ComponentWithError />);

    expect(screen.getByText('Oops! This is awkward :S')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('reloads page on button click', async () => {
    const { user } = setUp(<ComponentWithError />);

    expect(reload).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button'));
    expect(reload).toHaveBeenCalled();
  });
});
