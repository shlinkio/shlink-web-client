import { fireEvent } from '@testing-library/react';
import { page } from 'vitest/browser';
import { ServerForm } from '../../../src/servers/helpers/ServerForm';
import { checkAccessibility } from '../../__helpers__/accessibility';
import { renderWithEvents } from '../../__helpers__/setUpTest';

describe('<ServerForm />', () => {
  const onSubmit = vi.fn();
  const setUp = () => renderWithEvents(<ServerForm onSubmit={onSubmit}>Something</ServerForm>);

  it('passes a11y checks', () => checkAccessibility(setUp()));

  it('renders inputs', async () => {
    setUp();

    await expect.element(page.getByLabelText(/^Name/)).toBeInTheDocument();
    await expect.element(page.getByLabelText(/^URL/)).toBeInTheDocument();
    await expect.element(page.getByLabelText(/^API key/)).toBeInTheDocument();
    await expect.element(page.getByText('Something')).toBeInTheDocument();
    await expect.element(page.getByText('Advanced options')).toBeInTheDocument();
  });

  it('invokes submit callback when submit event is triggered', async () => {
    setUp();

    expect(onSubmit).not.toHaveBeenCalled();
    fireEvent.submit(page.getByTestId('server-form').element(), { preventDefault: vi.fn() });
    expect(onSubmit).toHaveBeenCalled();
  });

  it('shows advanced options', async () => {
    const { user } = setUp();
    const forwardCredentialsLabel = 'Forward credentials to this server on every request.';

    await expect.element(page.getByLabelText(forwardCredentialsLabel)).not.toBeInTheDocument();
    await user.click(page.getByText('Advanced options'));
    await expect.element(page.getByLabelText(forwardCredentialsLabel)).toBeInTheDocument();
  });
});
