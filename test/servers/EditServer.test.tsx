import { fireEvent, screen, waitFor } from '@testing-library/react';
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
    url: 'the_url',
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

  it('renders nothing if selected server is not reachable', () => {
    setUp(fromPartial<SelectedServer>({}));

    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    expect(screen.queryByText('Save')).not.toBeInTheDocument();
  });

  it('renders server title', () => {
    setUp();
    expect(screen.getByText(`Edit "${defaultSelectedServer.name}"`)).toBeInTheDocument();
  });

  it('display the server info in the form components', () => {
    setUp();

    expect(screen.getByLabelText(/^Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^URL/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^API key/)).toBeInTheDocument();
  });

  it('edits server and redirects to it when form is submitted', async () => {
    const { user, history, store } = setUp();

    await user.type(screen.getByLabelText(/^Name/), ' edited');
    await user.type(screen.getByLabelText(/^URL/), ' edited');
    // TODO Using fire event because userEvent.click on the Submit button does not submit the form
    // await user.click(screen.getByRole('button', { name: 'Save' }));
    fireEvent.submit(screen.getByRole('form'));

    expect(store.getState().servers[defaultSelectedServer.id]).toEqual(expect.objectContaining({
      name: 'the_name edited',
      url: 'the_url edited',
    }));

    // After saving we go back, to the first route from history's initialEntries
    expect(history.location.pathname).toEqual('/foo');
  });

  it.each([
    { forwardCredentials: true },
    { forwardCredentials: false },
  ])('edits advanced options - forward credentials', async ({ forwardCredentials }) => {
    const { user, store } = setUp({ ...defaultSelectedServer, forwardCredentials });

    await user.click(screen.getByText('Advanced options'));
    await user.click(screen.getByLabelText('Forward credentials to this server on every request.'));
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => expect(store.getState().servers[defaultSelectedServer.id]).toEqual(expect.objectContaining({
      forwardCredentials: !forwardCredentials,
    })));
  });
});
