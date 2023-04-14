import { render, screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { ErrorHandler as createErrorHandler } from '../../src/common/ErrorHandler';
import { renderWithEvents } from '../__helpers__/setUpTest';

const ComponentWithError = () => {
  throw new Error('Error!!');
};

describe('<ErrorHandler />', () => {
  const reload = jest.fn();
  const window = fromPartial<Window>({
    location: { reload },
  });
  const cons = fromPartial<Console>({ error: jest.fn() });
  const ErrorHandler = createErrorHandler(window, cons);

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {}); // Silence react errors
  });
  afterEach(jest.resetAllMocks);

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
