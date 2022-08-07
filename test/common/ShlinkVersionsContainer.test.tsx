import { render } from '@testing-library/react';
import { Mock } from 'ts-mockery';
import { ShlinkVersionsContainer } from '../../src/common/ShlinkVersionsContainer';
import { SelectedServer } from '../../src/servers/data';
import { Sidebar } from '../../src/common/reducers/sidebar';

describe('<ShlinkVersionsContainer />', () => {
  const setUp = (sidebar: Sidebar) => render(
    <ShlinkVersionsContainer selectedServer={Mock.all<SelectedServer>()} sidebar={sidebar} />,
  );

  it.each([
    [{ sidebarPresent: false }, 'text-center'],
    [{ sidebarPresent: true }, 'text-center shlink-versions-container--with-sidebar'],
  ])('renders proper col classes based on sidebar status', (sidebar, expectedClasses) => {
    const { container } = setUp(sidebar);
    expect(container.firstChild).toHaveAttribute('class', `${expectedClasses}`);
  });
});
