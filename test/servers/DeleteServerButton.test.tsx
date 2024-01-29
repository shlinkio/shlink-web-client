import { screen, waitFor } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import type { ReactNode } from 'react';
import { DeleteServerButtonFactory } from '../../src/servers/DeleteServerButton';
import type { DeleteServerModalProps } from '../../src/servers/DeleteServerModal';
import { checkAccessibility } from '../__helpers__/accessibility';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<DeleteServerButton />', () => {
  const DeleteServerButton = DeleteServerButtonFactory(fromPartial({
    DeleteServerModal: ({ isOpen }: DeleteServerModalProps) => <>DeleteServerModal {isOpen ? '[Open]' : '[Closed]'}</>,
  }));
  const setUp = (children?: ReactNode) => renderWithEvents(
    <DeleteServerButton server={fromPartial({})} textClassName="button">{children}</DeleteServerButton>,
  );

  it('passes a11y checks', () => checkAccessibility(setUp('Delete me')));

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
