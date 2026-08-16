import { fireEvent, waitFor } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';
import { page } from 'vitest/browser';
import { CreateServer } from '../../src/servers/CreateServer';
import type { ServersMap } from '../../src/servers/data';
import { checkAccessibility } from '../__helpers__/accessibility';
import { renderWithStore } from '../__helpers__/setUpTest';

type SetUpOptions = {
  serversImported?: boolean;
  importFailed?: boolean;
  servers?: ServersMap;
};

describe('<CreateServer />', () => {
  const defaultServers: ServersMap = {
    foo: fromPartial({ url: 'https://existing_url.com', apiKey: 'existing_api_key', id: 'foo' }),
  };
  const setUp = ({ serversImported = false, importFailed = false, servers = defaultServers }: SetUpOptions = {}) => {
    let callCount = 0;
    const useTimeoutToggle = vi.fn().mockImplementation(() => {
      const result = [callCount % 2 === 0 ? serversImported : importFailed, () => null];
      callCount += 1;
      return result;
    });
    const history = createMemoryHistory({ initialEntries: ['/foo', '/bar'] });

    return {
      history,
      ...renderWithStore(
        <Router location={history.location} navigator={history}>
          <CreateServer useTimeoutToggle={useTimeoutToggle} />
        </Router>,
        {
          initialState: { servers },
        },
      ),
    };
  };

  it('passes a11y checks', () => checkAccessibility(setUp()));

  it('shows success message when imported is true', async () => {
    setUp({ serversImported: true });

    await expect
      .element(page.getByText('Servers properly imported. You can now select one from the list :)'))
      .toBeInTheDocument();
    await expect
      .element(page.getByText('The servers could not be imported. Make sure the format is correct.'))
      .not.toBeInTheDocument();
    await expect.element(page.getByText('ImportServersBtn')).not.toBeInTheDocument();
  });

  it('shows error message when import failed', async () => {
    setUp({ importFailed: true });

    await expect
      .element(page.getByText('Servers properly imported. You can now select one from the list :)'))
      .not.toBeInTheDocument();
    await expect
      .element(page.getByText('The servers could not be imported. Make sure the format is correct.'))
      .toBeInTheDocument();
  });

  it('creates server data when form is submitted', async () => {
    const { user, history, store } = setUp();
    const expectedServerId = 'the_name-the_url.com';

    await user.type(page.getByLabelText(/^Name/), 'the_name');
    await user.type(page.getByLabelText(/^URL/), 'https://the_url.com');
    await user.type(page.getByLabelText(/^API key/), 'the_api_key');

    expect(store.getState().servers[expectedServerId]).not.toBeDefined();
    fireEvent.submit(page.getByTestId('server-form').element());
    expect(store.getState().servers[expectedServerId]).toEqual(
      expect.objectContaining({
        id: expectedServerId,
        name: 'the_name',
        url: 'https://the_url.com',
        apiKey: 'the_api_key',
      }),
    );

    expect(history.location.pathname).toEqual(`/server/${expectedServerId}`);
    await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();
  });

  it('displays dialog when trying to create a duplicated server', async () => {
    const { user, history } = setUp();

    await user.type(page.getByLabelText(/^Name/), 'the_name');
    await user.type(page.getByLabelText(/^URL/), 'https://existing_url.com');
    await user.type(page.getByLabelText(/^API key/), 'existing_api_key');

    fireEvent.submit(page.getByTestId('server-form').element());

    await waitFor(() => expect(page.getByRole('dialog')).toBeInTheDocument());
    await user.click(page.getByRole('button', { name: 'Discard' }));

    expect(history.location.pathname).toEqual('/foo'); // Goes back to first route from history's initialEntries
  });
});
