import { screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { createMemoryHistory } from 'history';
import type { ReactNode } from 'react';
import { Router } from 'react-router';
import { DeleteServerButton } from '../../src/servers/DeleteServerButton';
import { checkAccessibility } from '../__helpers__/accessibility';
import { renderWithStore } from '../__helpers__/setUpTest';

describe('<DeleteServerButton />', () => {
  const setUp = (children: ReactNode = 'Remove this server') => {
    const history = createMemoryHistory({ initialEntries: ['/foo'] });
    const result = renderWithStore(
      <Router location={history.location} navigator={history}>
        <DeleteServerButton server={fromPartial({})}>{children}</DeleteServerButton>
      </Router>,
    );

    return { history, ...result };
  };

  it('passes a11y checks', () => checkAccessibility(setUp('Delete me')));

  it.each([
    ['Foo bar'],
    ['baz'],
    ['something'],
  ])('renders expected content', (children) => {
    const { container } = setUp(children);
    expect(container.firstChild).toBeTruthy();
    expect(container.firstChild).toMatchSnapshot();
  });

  it('displays modal when button is clicked', async () => {
    const { user } = setUp();

    expect(screen.queryByText(/Are you sure you want to remove/)).not.toBeInTheDocument();
    await user.click(screen.getByText('Remove this server'));
    expect(screen.getByText(/Are you sure you want to remove/)).toBeInTheDocument();
  });

  it('navigates to home when deletion is confirmed', async () => {
    const { user, history } = setUp();

    // Open modal
    await user.click(screen.getByText('Remove this server'));

    expect(history.location.pathname).toEqual('/foo');
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(history.location.pathname).toEqual('/');
  });
});
