import { render, screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import type { PropsWithChildren } from 'react';
import { ErrorHandler as BaseErrorHandler } from '../../src/common/ErrorHandler';
import { renderWithEvents } from '../__helpers__/setUpTest';

const ComponentWithError = () => {
  throw new Error('Error!!');
};

describe('<ErrorHandler />', () => {
  const reload = vi.fn();
  const location = fromPartial<Window['location']>({ reload });
  const cons = fromPartial<Console>({ error: vi.fn() });
  const ErrorHandler = (props: PropsWithChildren) => <BaseErrorHandler console={cons} location={location} {...props} />;

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {}); // Silence react errors
  });

  it('renders children when no error has occurred', () => {
    render(<ErrorHandler><span>Foo</span></ErrorHandler>);

    expect(screen.getByText('Foo')).toBeInTheDocument();
    expect(screen.queryByText('Oops! This is awkward :S')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders error page when error has occurred', () => {
    render(<ErrorHandler><ComponentWithError /></ErrorHandler>);

    expect(screen.getByText('Oops! This is awkward :S')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('reloads page on button click', async () => {
    const { user } = renderWithEvents(<ErrorHandler><ComponentWithError /></ErrorHandler>);

    expect(reload).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button'));
    expect(reload).toHaveBeenCalled();
  });
});
