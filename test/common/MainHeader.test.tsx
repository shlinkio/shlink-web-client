import { screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';
import { MainHeaderFactory } from '../../src/common/MainHeader';
import { checkAccessibility } from '../__helpers__/accessibility';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<MainHeader />', () => {
  const MainHeader = MainHeaderFactory(fromPartial({
    // Fake this component as a li[role="menuitem"], as it gets rendered inside a ul[role="menu"]
    ServersDropdown: () => <li role="menuitem">ServersDropdown</li>,
  }));
  const setUp = (pathname = '') => {
    const history = createMemoryHistory();
    history.push(pathname);

    return renderWithEvents(
      <Router location={history.location} navigator={history}>
        <MainHeader />
      </Router>,
    );
  };

  it('passes a11y checks', () => checkAccessibility(setUp()));

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
    expect(screen.getByRole('menuitem', { name: /Settings$/ })).toHaveAttribute(
      'data-active', isActive ? 'true' : 'false',
    );
  });
});
