import { fireEvent, render, screen } from '@testing-library/react';
import { ServerForm } from '../../../src/servers/helpers/ServerForm';
import { checkAccessibility } from '../../__helpers__/accessibility';

describe('<ServerForm />', () => {
  const onSubmit = vi.fn();
  const setUp = () => render(<ServerForm onSubmit={onSubmit}>Something</ServerForm>);

  it('passes a11y checks', () => checkAccessibility(setUp()));

  it('renders inputs', () => {
    setUp();

    expect(screen.getByLabelText(/^Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^URL/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^API key/)).toBeInTheDocument();
    expect(screen.getByText('Something')).toBeInTheDocument();
  });

  it('invokes submit callback when submit event is triggered', async () => {
    setUp();

    expect(onSubmit).not.toHaveBeenCalled();
    fireEvent.submit(screen.getByRole('form'), { preventDefault: vi.fn() });
    expect(onSubmit).toHaveBeenCalled();
  });
});
