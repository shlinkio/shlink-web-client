import { fromPartial } from '@total-typescript/shoehorn';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';
import { page } from 'vitest/browser';
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
  const setUp = (selectedServer: SelectedServer = defaultSelectedServer) => {
    const history = createMemoryHistory({ initialEntries: ['/foo', '/bar'] });
    return {
      history,
      ...renderWithStore(
        <Router location={history.location} navigator={history}>
          <EditServer />
        </Router>,
        {
          initialState: {
            selectedServer,
            servers: isServerWithId(selectedServer) ? { [selectedServer.id]: selectedServer } : {},
          },
        },
      ),
    };
  };

  it('passes a11y checks', () => checkAccessibility(setUp()));

  it('renders nothing if selected server is not reachable', async () => {
    setUp(fromPartial<SelectedServer>({}));

    await expect.element(page.getByText('Edit')).not.toBeInTheDocument();
    await expect.element(page.getByText('Cancel')).not.toBeInTheDocument();
    await expect.element(page.getByText('Save')).not.toBeInTheDocument();
  });

  it('renders server title', () => {
    setUp();
    expect(page.getByText(`Edit "${defaultSelectedServer.name}"`)).toBeInTheDocument();
  });

  it('display the server info in the form components', async () => {
    setUp();

    await expect.element(page.getByLabelText(/^Name/)).toBeInTheDocument();
    await expect.element(page.getByLabelText(/^URL/)).toBeInTheDocument();
    await expect.element(page.getByLabelText(/^API key/)).toBeInTheDocument();
  });

  it('edits server and redirects to it when form is submitted', async () => {
    const { user, history, store } = setUp();

    await user.type(page.getByLabelText(/^Name/), ' edited');
    await user.click(page.getByRole('button', { name: 'Save' }));

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
      const { user, store } = setUp({ ...defaultSelectedServer, forwardCredentials });

      await user.click(page.getByText('Advanced options'));
      await user.click(page.getByLabelText('Forward credentials to this server on every request.'));
      await user.click(page.getByRole('button', { name: 'Save' }));

      expect(store.getState().servers[defaultSelectedServer.id]).toEqual(
        expect.objectContaining({
          forwardCredentials: !forwardCredentials,
        }),
      );
    },
  );
});
