import { ReactNode } from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import { Mock } from 'ts-mockery';
import deleteServerButtonConstruct from '../../src/servers/DeleteServerButton';
import { ServerWithId } from '../../src/servers/data';

describe('<DeleteServerButton />', () => {
  const DeleteServerButton = deleteServerButtonConstruct(
    ({ isOpen }) => <>DeleteServerModal {isOpen ? '[Open]' : '[Closed]'}</>,
  );
  const setUp = (children?: ReactNode) => ({
    user: userEvent.setup(),
    ...render(
      <DeleteServerButton server={Mock.all<ServerWithId>()} textClassName="button">{children}</DeleteServerButton>,
    ),
  });

  it.each([
    ['Foo bar'],
    ['baz'],
    ['something'],
    [undefined],
  ])('renders expected content', (children) => {
    const { container } = setUp(children);
    expect(container.firstChild).toBeTruthy();
    expect(container.firstChild).toMatchSnapshot();
  });

  it('displays modal when button is clicked', async () => {
    const { user, container } = setUp();

    expect(screen.getByText(/DeleteServerModal/)).toHaveTextContent(/Closed/);
    expect(screen.getByText(/DeleteServerModal/)).not.toHaveTextContent(/Open/);
    container.firstElementChild && await user.click(container.firstElementChild);

    await waitFor(() => expect(screen.getByText(/DeleteServerModal/)).toHaveTextContent(/Open/));
  });
});
