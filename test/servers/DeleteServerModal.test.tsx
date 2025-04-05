import { screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { DeleteServerModal } from '../../src/servers/DeleteServerModal';
import { checkAccessibility } from '../__helpers__/accessibility';
import { renderWithEvents } from '../__helpers__/setUpTest';
import { TestModalWrapper } from '../__helpers__/TestModalWrapper';

describe('<DeleteServerModal />', () => {
  const deleteServerMock = vi.fn();
  const serverName = 'the_server_name';
  const setUp = () => renderWithEvents(
    <TestModalWrapper
      renderModal={(args) => (
        <DeleteServerModal
          {...args}
          server={fromPartial({ name: serverName })}
          deleteServer={deleteServerMock}
        />
      )}
    />,
  );

  it('passes a11y checks', () => checkAccessibility(setUp()));

  it('renders a modal window', () => {
    setUp();

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading')).toHaveTextContent('Remove server');
  });

  it('displays the name of the server as part of the content', () => {
    setUp();

    expect(screen.getByText(/^Are you sure you want to remove/)).toBeInTheDocument();
    expect(screen.getByText(serverName)).toBeInTheDocument();
  });

  it.only.each([
    [() => screen.getByRole('button', { name: 'Cancel' })],
    [() => screen.getByLabelText('Close dialog')],
  ])('closes dialog when clicking cancel button', async (getButton) => {
    const { user } = setUp();

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.click(getButton());
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(deleteServerMock).not.toHaveBeenCalled();
  });

  it('deletes server when clicking accept button', async () => {
    const { user } = setUp();

    expect(deleteServerMock).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(deleteServerMock).toHaveBeenCalledOnce();
  });
});
