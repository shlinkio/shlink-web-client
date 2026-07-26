import { screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import type { ServerWithId } from '../../src/servers/data';
import { DeleteServerModal } from '../../src/servers/DeleteServerModal';
import { checkAccessibility } from '../__helpers__/accessibility';
import { renderWithStore } from '../__helpers__/setUpTest';
import { TestModalWrapper } from '../__helpers__/TestModalWrapper';

describe('<DeleteServerModal />', () => {
  const serverName = 'the_server_name';
  const server = fromPartial<ServerWithId>({ id: 'foo', name: serverName });
  const setUp = () =>
    renderWithStore(<TestModalWrapper renderModal={(args) => <DeleteServerModal {...args} server={server} />} />, {
      initialState: {
        servers: { foo: server },
      },
    });

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

  it.each([[() => screen.getByRole('button', { name: 'Cancel' })], [() => screen.getByLabelText('Close dialog')]])(
    'closes dialog when clicking cancel button',
    async (getButton) => {
      const { user, store } = setUp();

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      await user.click(getButton());
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      // No server has been deleted
      expect(Object.keys(store.getState().servers)).toHaveLength(1);
    },
  );

  it('deletes server when clicking accept button', async () => {
    const { user, store } = setUp();

    expect(Object.keys(store.getState().servers)).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(Object.keys(store.getState().servers)).toHaveLength(0);
  });
});
