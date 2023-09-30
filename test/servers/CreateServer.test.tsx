import { fireEvent, screen, waitFor } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { useNavigate } from 'react-router-dom';
import { CreateServerFactory } from '../../src/servers/CreateServer';
import type { ServersMap } from '../../src/servers/data';
import { checkAccessibility } from '../__helpers__/accessibility';
import { renderWithEvents } from '../__helpers__/setUpTest';

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useNavigate: vi.fn(),
}));

type SetUpOptions = {
  serversImported?: boolean;
  importFailed?: boolean;
  servers?: ServersMap;
};

describe('<CreateServer />', () => {
  const createServersMock = vi.fn();
  const navigate = vi.fn();
  const defaultServers: ServersMap = {
    foo: fromPartial({ url: 'https://existing_url.com', apiKey: 'existing_api_key' }),
  };
  const setUp = ({ serversImported = false, importFailed = false, servers = defaultServers }: SetUpOptions = {}) => {
    (useNavigate as any).mockReturnValue(navigate);

    let callCount = 0;
    const useTimeoutToggle = vi.fn().mockImplementation(() => {
      const result = [callCount % 2 === 0 ? serversImported : importFailed, () => null];
      callCount += 1;
      return result;
    });
    const CreateServer = CreateServerFactory(fromPartial({
      ImportServersBtn: () => <>ImportServersBtn</>,
      useTimeoutToggle,
    }));

    return renderWithEvents(<CreateServer createServers={createServersMock} servers={servers} />);
  };

  it('passes a11y checks', () => checkAccessibility(setUp()));

  it('shows success message when imported is true', () => {
    setUp({ serversImported: true });

    expect(screen.getByText('Servers properly imported. You can now select one from the list :)')).toBeInTheDocument();
    expect(
      screen.queryByText('The servers could not be imported. Make sure the format is correct.'),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('ImportServersBtn')).not.toBeInTheDocument();
  });

  it('shows error message when import failed', () => {
    setUp({ importFailed: true });

    expect(
      screen.queryByText('Servers properly imported. You can now select one from the list :)'),
    ).not.toBeInTheDocument();
    expect(screen.getByText('The servers could not be imported. Make sure the format is correct.')).toBeInTheDocument();
  });

  it('shows import button when no servers exist yet', () => {
    setUp({ servers: {} });
    expect(screen.queryByText('ImportServersBtn')).toBeInTheDocument();
  });

  it('creates server data when form is submitted', async () => {
    const { user } = setUp();

    expect(createServersMock).not.toHaveBeenCalled();

    await user.type(screen.getByLabelText(/^Name/), 'the_name');
    await user.type(screen.getByLabelText(/^URL/), 'https://the_url.com');
    await user.type(screen.getByLabelText(/^API key/), 'the_api_key');
    fireEvent.submit(screen.getByRole('form'));

    expect(createServersMock).toHaveBeenCalledWith([expect.objectContaining({
      name: 'the_name',
      url: 'https://the_url.com',
      apiKey: 'the_api_key',
    })]);
    expect(navigate).toHaveBeenCalledWith(expect.stringMatching(/^\/server\//));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('displays dialog when trying to create a duplicated server', async () => {
    const { user } = setUp();

    await user.type(screen.getByLabelText(/^Name/), 'the_name');
    await user.type(screen.getByLabelText(/^URL/), 'https://existing_url.com');
    await user.type(screen.getByLabelText(/^API key/), 'existing_api_key');
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: 'Discard' }));

    expect(createServersMock).not.toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(-1);
  });
});
