import { screen, waitFor } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { DeleteServerModal } from '../../src/servers/DeleteServerModal';
import { checkAccessibility } from '../__helpers__/accessibility';
import { renderWithEvents } from '../__helpers__/setUpTest';
import { TestModalWrapper } from '../__helpers__/TestModalWrapper';

describe('<DeleteServerModal />', () => {
  const deleteServerMock = vi.fn();
  const serverName = 'the_server_name';
  const setUp = () => {
    const history = createMemoryHistory({ initialEntries: ['/foo'] });
    return {
      history,
      ...renderWithEvents(
        <Router location={history.location} navigator={history}>
          <TestModalWrapper
            renderModal={(args) => (
              <DeleteServerModal
                {...args}
                server={fromPartial({ name: serverName })}
                deleteServer={deleteServerMock}
              />
            )}
          />
        </Router>,
      ),
    };
  };

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

  it.each([
    [() => screen.getByRole('button', { name: 'Cancel' })],
    [() => screen.getByLabelText('Close')],
  ])('toggles when clicking cancel button', async (getButton) => {
    const { user, history } = setUp();

    expect(history.location.pathname).toEqual('/foo');
    await user.click(getButton());

    expect(deleteServerMock).not.toHaveBeenCalled();
    expect(history.location.pathname).toEqual('/foo'); // No navigation happens, keeping initial pathname
  });

  it('deletes server when clicking accept button', async () => {
    const { user, history } = setUp();

    expect(deleteServerMock).not.toHaveBeenCalled();
    expect(history.location.pathname).toEqual('/foo');
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => expect(deleteServerMock).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(history.location.pathname).toEqual('/'));
  });
});
