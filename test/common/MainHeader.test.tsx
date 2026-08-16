import { createMemoryHistory } from 'history';
import { Router } from 'react-router';
import { page } from 'vitest/browser';
import { MainHeader } from '../../src/common/MainHeader';
import { checkAccessibility } from '../__helpers__/accessibility';
import { renderWithStore } from '../__helpers__/setUpTest';

describe('<MainHeader />', () => {
  const setUp = (pathname = '') => {
    const history = createMemoryHistory();
    history.push(pathname);

    return renderWithStore(
      <Router location={history.location} navigator={history}>
        <MainHeader />
      </Router>,
    );
  };

  it('passes a11y checks', () => checkAccessibility(setUp()));

  it('renders ServersDropdown', async () => {
    setUp();
    await expect.element(page.getByRole('button', { name: 'Servers' })).toBeInTheDocument();
  });

  it.each([
    ['/foo', false],
    ['/bar', false],
    ['/settings', true],
    ['/settings/foo', true],
    ['/settings/bar', true],
  ])('sets link to settings as active only when current path is settings', async (currentPath, isActive) => {
    setUp(currentPath);
    await expect
      .element(page.getByRole('menuitem', { name: /Settings$/ }))
      .toHaveAttribute('data-active', isActive ? 'true' : 'false');
  });
});
