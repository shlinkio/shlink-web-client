import { screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { MainHeader as createMainHeader } from '../../src/common/MainHeader';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<MainHeader />', () => {
  const MainHeader = createMainHeader(() => <>ServersDropdown</>);
  const setUp = (pathname = '') => {
    const history = createMemoryHistory();
    history.push(pathname);

    return renderWithEvents(
      <Router location={history.location} navigator={history}>
        <MainHeader />
      </Router>,
    );
  };

  it('renders ServersDropdown', () => {
    setUp();
    expect(screen.getByText('ServersDropdown')).toBeInTheDocument();
  });

  it.each([
    ['/foo', false],
    ['/bar', false],
    ['/settings', true],
    ['/settings/foo', true],
    ['/settings/bar', true],
  ])('sets link to settings as active only when current path is settings', (currentPath, isActive) => {
    setUp(currentPath);

    if (isActive) {
      expect(screen.getByText(/Settings$/).getAttribute('class')).toContain('active');
    } else {
      expect(screen.getByText(/Settings$/).getAttribute('class')).not.toContain('active');
    }
  });

  it('renders expected class based on the nav bar state', async () => {
    const { user } = setUp();

    const toggle = screen.getByLabelText('Toggle navigation');
    const icon = toggle.firstChild;

    expect(icon).toHaveAttribute('class', expect.stringMatching(/main-header__toggle-icon$/));
    await user.click(toggle);
    expect(icon).toHaveAttribute(
      'class',
      expect.stringMatching(/main-header__toggle-icon main-header__toggle-icon--opened$/),
    );
    await user.click(toggle);
    expect(icon).toHaveAttribute('class', expect.stringMatching(/main-header__toggle-icon$/));
  });

  it('opens Collapse when clicking toggle', async () => {
    const { container, user } = setUp();
    const collapse = container.querySelector('.collapse');
    const toggle = screen.getByLabelText('Toggle navigation');

    expect(collapse).not.toHaveAttribute('class', expect.stringContaining('show'));
    await user.click(toggle);
    await waitFor(() => expect(collapse).toHaveAttribute('class', expect.stringContaining('show')));
  });
});
