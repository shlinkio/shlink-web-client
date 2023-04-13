import { screen, waitFor } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import type { ReactNode } from 'react';
import { DeleteServerButton as createDeleteServerButton } from '../../src/servers/DeleteServerButton';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<DeleteServerButton />', () => {
  const DeleteServerButton = createDeleteServerButton(
    ({ isOpen }) => <>DeleteServerModal {isOpen ? '[Open]' : '[Closed]'}</>,
  );
  const setUp = (children?: ReactNode) => renderWithEvents(
    <DeleteServerButton server={fromPartial({})} textClassName="button">{children}</DeleteServerButton>,
  );

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
