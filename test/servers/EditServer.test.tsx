import { fromPartial } from '@total-typescript/shoehorn';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';
import type { ReachableServer, SelectedServer } from '../../src/servers/data';
import { isServerWithId } from '../../src/servers/data';
import { EditServer } from '../../src/servers/EditServer';
import { checkAccessibility } from '../__helpers__/accessibility';
import { renderWithStore } from '../__helpers__/setUpTest';

describe('<EditServer />', () => {
  const defaultSelectedServer = fromPartial<ReachableServer>({
    id: 'abc123',
    name: 'the_name',
    url: 'https://example.com',
    apiKey: 'the_api_key',
  });
  const setUp = async (selectedServer: SelectedServer = defaultSelectedServer) => {
    const history = createMemoryHistory({ initialEntries: ['/foo', '/bar'] });
    return {
      history,
      ...(await renderWithStore(
        <Router location={history.location} navigator={history}>
          <EditServer />
        </Router>,
        {
          initialState: {
            selectedServer,
            servers: isServerWithId(selectedServer) ? { [selectedServer.id]: selectedServer } : {},
          },
        },
      )),
    };
  };

  it('passes a11y checks', () => checkAccessibility(setUp()));

  it('renders nothing if selected server is not reachable', async () => {
    const screen = await setUp(fromPartial<SelectedServer>({}));

    await expect.element(screen.getByText('Edit')).not.toBeInTheDocument();
    await expect.element(screen.getByText('Cancel')).not.toBeInTheDocument();
    await expect.element(screen.getByText('Save')).not.toBeInTheDocument();
  });

  it('renders server title', async () => {
    const screen = await setUp();
    expect(screen.getByText(`Edit "${defaultSelectedServer.name}"`)).toBeInTheDocument();
  });

  it('display the server info in the form components', async () => {
    const screen = await setUp();

    await expect.element(screen.getByLabelText(/^Name/)).toBeInTheDocument();
    await expect.element(screen.getByLabelText(/^URL/)).toBeInTheDocument();
    await expect.element(screen.getByLabelText(/^API key/)).toBeInTheDocument();
  });

  it('edits server and redirects to it when form is submitted', async () => {
    const { user, history, store, ...screen } = await setUp();

    await user.type(screen.getByLabelText(/^Name/), ' edited');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(store.getState().servers[defaultSelectedServer.id]).toEqual(
      expect.objectContaining({
        name: 'the_name edited',
      }),
    );

    // After saving we go back, to the first route from history's initialEntries
    expect(history.location.pathname).toEqual('/foo');
  });

  it.each([{ forwardCredentials: true }, { forwardCredentials: false }])(
    'edits advanced options - forward credentials',
    async ({ forwardCredentials }) => {
      const { user, store, ...screen } = await setUp({ ...defaultSelectedServer, forwardCredentials });

      await user.click(screen.getByText('Advanced options'));
      await user.click(screen.getByLabelText('Forward credentials to this server on every request.'));
      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(store.getState().servers[defaultSelectedServer.id]).toEqual(
        expect.objectContaining({
          forwardCredentials: !forwardCredentials,
        }),
      );
    },
  );
});
