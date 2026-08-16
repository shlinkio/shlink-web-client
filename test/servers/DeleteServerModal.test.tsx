import { fromPartial } from '@total-typescript/shoehorn';
import type { RenderResult } from 'vitest-browser-react';
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

  it('renders a modal window', async () => {
    const page = await setUp();

    await expect.element(page.getByRole('dialog')).toBeInTheDocument();
    await expect.element(page.getByRole('heading')).toHaveTextContent('Remove server');
  });

  it('displays the name of the server as part of the content', async () => {
    const page = await setUp();

    await expect.element(page.getByText(/^Are you sure you want to remove/)).toBeInTheDocument();
    await expect.element(page.getByText(serverName)).toBeInTheDocument();
  });

  it.each([
    [(page: RenderResult) => page.getByRole('button', { name: 'Cancel' })],
    [(page: RenderResult) => page.getByLabelText('Close dialog')],
  ])('closes dialog when clicking cancel button', async (getButton) => {
    const { user, store, ...page } = await setUp();

    await expect.element(page.getByRole('dialog')).toBeInTheDocument();
    await user.click(getButton(page));
    await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();

    // No server has been deleted
    expect(Object.keys(store.getState().servers)).toHaveLength(1);
  });

  it('deletes server when clicking accept button', async () => {
    const { user, store, ...page } = await setUp();

    expect(Object.keys(store.getState().servers)).toHaveLength(1);
    await user.click(page.getByRole('button', { name: 'Delete' }));
    expect(Object.keys(store.getState().servers)).toHaveLength(0);
  });
});
