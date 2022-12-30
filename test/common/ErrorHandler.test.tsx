import { render, screen } from '@testing-library/react';
import { Mock } from 'ts-mockery';
import { ErrorHandler as createErrorHandler } from '../../src/common/ErrorHandler';
import { renderWithEvents } from '../__helpers__/setUpTest';

const ComponentWithError = () => {
  throw new Error('Error!!');
};

describe('<ErrorHandler />', () => {
  const reload = vi.fn();
  const window = Mock.of<Window>({
    location: { reload },
  });
  const cons = Mock.of<Console>({ error: vi.fn() });
  const ErrorHandler = createErrorHandler(window, cons);

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {}); // Silence react errors
  });
  afterEach(vi.resetAllMocks);

  it('renders children when no error has occurred', () => {
    render(<ErrorHandler children={<span>Foo</span>} />);

    expect(screen.getByText('Foo')).toBeInTheDocument();
    expect(screen.queryByText('Oops! This is awkward :S')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders error page when error has occurred', () => {
    render(<ErrorHandler children={<ComponentWithError />} />);

    expect(screen.getByText('Oops! This is awkward :S')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('reloads page on button click', async () => {
    const { user } = renderWithEvents(<ErrorHandler children={<ComponentWithError />} />);

    expect(reload).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button'));
    expect(reload).toHaveBeenCalled();
  });
});
