import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { MainHeader as createMainHeader } from '../../src/common/MainHeader';

describe('<MainHeader />', () => {
  const MainHeader = createMainHeader(() => <>ServersDropdown</>);
  const setUp = (pathname = '') => {
    const history = createMemoryHistory();
    history.push(pathname);

    return render(
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

  it('renders expected class based on the nav bar state', () => {
    setUp();

    const toggle = screen.getByLabelText('Toggle navigation');
    const icon = toggle.firstChild;

    expect(icon).toHaveAttribute('class', expect.stringMatching(/main-header__toggle-icon$/));
    fireEvent.click(toggle);
    expect(icon).toHaveAttribute(
      'class',
      expect.stringMatching(/main-header__toggle-icon main-header__toggle-icon--opened$/),
    );
    fireEvent.click(toggle);
    expect(icon).toHaveAttribute('class', expect.stringMatching(/main-header__toggle-icon$/));
  });

  it('opens Collapse when clicking toggle', async () => {
    const { container } = setUp();
    const collapse = container.querySelector('.collapse');
    const toggle = screen.getByLabelText('Toggle navigation');

    expect(collapse).not.toHaveAttribute('class', expect.stringContaining('show'));
    fireEvent.click(toggle);
    await waitFor(() => expect(collapse).toHaveAttribute('class', expect.stringContaining('show')));
  });
});
