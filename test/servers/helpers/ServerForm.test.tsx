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
    const page = await setUp();

    await expect.element(page.getByLabelText(/^Name/)).toBeInTheDocument();
    await expect.element(page.getByLabelText(/^URL/)).toBeInTheDocument();
    await expect.element(page.getByLabelText(/^API key/)).toBeInTheDocument();
    await expect.element(page.getByText('Something')).toBeInTheDocument();
    await expect.element(page.getByText('Advanced options')).toBeInTheDocument();
  });

  it('invokes submit callback when submit event is triggered', async () => {
    const { user, ...page } = await setUp();

    expect(onSubmit).not.toHaveBeenCalled();

    // Fill required elements so the form can be submitted
    await user.type(page.getByLabelText(/^Name/), 'The server');
    await user.type(page.getByLabelText(/^URL/), 'https://example.com');
    await user.type(page.getByLabelText(/^API key/), '123456');

    await user.click(page.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).toHaveBeenCalled();
  });

  it('shows advanced options', async () => {
    const { user, ...page } = await setUp();
    const forwardCredentialsLabel = 'Forward credentials to this server on every request.';

    await expect.element(page.getByLabelText(forwardCredentialsLabel)).not.toBeInTheDocument();
    await user.click(page.getByText('Advanced options'));
    await expect.element(page.getByLabelText(forwardCredentialsLabel)).toBeInTheDocument();
  });
});
