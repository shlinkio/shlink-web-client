import { FC } from 'react';
import { screen, waitFor } from '@testing-library/react';
import { Mock } from 'ts-mockery';
import { useNavigate } from 'react-router-dom';
import { DeleteServerModal } from '../../src/servers/DeleteServerModal';
import { ServerWithId } from '../../src/servers/data';
import { renderWithEvents } from '../__helpers__/setUpTest';
import { useToggle } from '../../src/utils/helpers/hooks';

jest.mock('react-router-dom', () => ({ ...jest.requireActual('react-router-dom'), useNavigate: jest.fn() }));

const DeleteServerModalWrapper: FC<{ name: string; deleteServer: () => void }> = ({ name, deleteServer }) => {
  const [isOpen, toggle] = useToggle(true);

  return (
    <DeleteServerModal
      server={Mock.of<ServerWithId>({ name })}
      toggle={toggle}
      isOpen={isOpen}
      deleteServer={deleteServer}
    />
  );
};

describe('<DeleteServerModal />', () => {
  const deleteServerMock = jest.fn();
  const navigate = jest.fn();
  const serverName = 'the_server_name';
  const setUp = () => {
    (useNavigate as any).mockReturnValue(navigate);

    return renderWithEvents(
      <DeleteServerModalWrapper
        name={serverName}
        deleteServer={deleteServerMock}
      />,
    );
  };

  afterEach(jest.clearAllMocks);

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

  it.each([
    [() => screen.getByRole('button', { name: 'Cancel' })],
    [() => screen.getByLabelText('Close')],
  ])('toggles when clicking cancel button', async (getButton) => {
    const { user } = setUp();

    await user.click(getButton());

    expect(deleteServerMock).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('deletes server when clicking accept button', async () => {
    const { user } = setUp();

    expect(deleteServerMock).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => expect(deleteServerMock).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(navigate).toHaveBeenCalledTimes(1));
  });
});
