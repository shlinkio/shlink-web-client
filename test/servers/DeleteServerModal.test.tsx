import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Mock } from 'ts-mockery';
import { useNavigate } from 'react-router-dom';
import { DeleteServerModal } from '../../src/servers/DeleteServerModal';
import { ServerWithId } from '../../src/servers/data';

jest.mock('react-router-dom', () => ({ ...jest.requireActual('react-router-dom'), useNavigate: jest.fn() }));

describe('<DeleteServerModal />', () => {
  const deleteServerMock = jest.fn();
  const navigate = jest.fn();
  const toggleMock = jest.fn();
  const serverName = 'the_server_name';
  const setUp = () => {
    (useNavigate as any).mockReturnValue(navigate);

    return {
      user: userEvent.setup(),
      ...render(
        <DeleteServerModal
          server={Mock.of<ServerWithId>({ name: serverName })}
          toggle={toggleMock}
          isOpen
          deleteServer={deleteServerMock}
        />,
      ),
    };
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

    expect(toggleMock).not.toHaveBeenCalled();
    await user.click(getButton());

    expect(toggleMock).toHaveBeenCalledTimes(1);
    expect(deleteServerMock).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('deletes server when clicking accept button', async () => {
    const { user } = setUp();

    expect(toggleMock).not.toHaveBeenCalled();
    expect(deleteServerMock).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(toggleMock).toHaveBeenCalledTimes(1);
    expect(deleteServerMock).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledTimes(1);
  });
});
