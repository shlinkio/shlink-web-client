import { ServerForm } from '../../../src/servers/helpers/ServerForm';
import { checkAccessibility } from '../../__helpers__/accessibility';
import { renderWithEvents } from '../../__helpers__/setUpTest';

describe('<ServerForm />', () => {
  const onSubmit = vi.fn();
  const setUp = () =>
    renderWithEvents(
      <ServerForm onSubmit={onSubmit}>
        <span>Something</span>
        <button type="submit">Submit</button>
      </ServerForm>,
    );

  it('passes a11y checks', () => checkAccessibility(setUp()));

  it('renders inputs', async () => {
    const screen = await setUp();

    await expect.element(screen.getByLabelText(/^Name/)).toBeInTheDocument();
    await expect.element(screen.getByLabelText(/^URL/)).toBeInTheDocument();
    await expect.element(screen.getByLabelText(/^API key/)).toBeInTheDocument();
    await expect.element(screen.getByText('Something')).toBeInTheDocument();
    await expect.element(screen.getByText('Advanced options')).toBeInTheDocument();
  });

  it('invokes submit callback when submit event is triggered', async () => {
    const { user, ...screen } = await setUp();

    expect(onSubmit).not.toHaveBeenCalled();

    // Fill required elements so the form can be submitted
    await user.type(screen.getByLabelText(/^Name/), 'The server');
    await user.type(screen.getByLabelText(/^URL/), 'https://example.com');
    await user.type(screen.getByLabelText(/^API key/), '123456');

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).toHaveBeenCalled();
  });

  it('shows advanced options', async () => {
    const { user, ...screen } = await setUp();
    const forwardCredentialsLabel = 'Forward credentials to this server on every request.';

    await expect.element(screen.getByLabelText(forwardCredentialsLabel)).not.toBeInTheDocument();
    await user.click(screen.getByText('Advanced options'));
    await expect.element(screen.getByLabelText(forwardCredentialsLabel)).toBeInTheDocument();
  });
});
