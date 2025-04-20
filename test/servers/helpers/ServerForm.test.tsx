import { fireEvent, screen } from '@testing-library/react';
import { ServerForm } from '../../../src/servers/helpers/ServerForm';
import { checkAccessibility } from '../../__helpers__/accessibility';
import { renderWithEvents } from '../../__helpers__/setUpTest';

describe('<ServerForm />', () => {
  const onSubmit = vi.fn();
  const setUp = () => renderWithEvents(<ServerForm onSubmit={onSubmit}>Something</ServerForm>);

  it('passes a11y checks', () => checkAccessibility(setUp()));

  it('renders inputs', () => {
    setUp();

    expect(screen.getByLabelText(/^Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^URL/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^API key/)).toBeInTheDocument();
    expect(screen.getByText('Something')).toBeInTheDocument();
    expect(screen.getByText('Advanced options')).toBeInTheDocument();
  });

  it('invokes submit callback when submit event is triggered', async () => {
    setUp();

    expect(onSubmit).not.toHaveBeenCalled();
    fireEvent.submit(screen.getByRole('form'), { preventDefault: vi.fn() });
    expect(onSubmit).toHaveBeenCalled();
  });

  it('shows advanced options', async () => {
    const { user } = setUp();
    const forwardCredentialsLabel = 'Forward credentials to this server on every request.';

    expect(screen.queryByLabelText(forwardCredentialsLabel)).not.toBeInTheDocument();
    await user.click(screen.getByText('Advanced options'));
    expect(screen.getByLabelText(forwardCredentialsLabel)).toBeInTheDocument();
  });
});
