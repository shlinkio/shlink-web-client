import { render } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import type { Sidebar } from '../../src/common/reducers/sidebar';
import { ShlinkVersionsContainer } from '../../src/common/ShlinkVersionsContainer';

describe('<ShlinkVersionsContainer />', () => {
  const setUp = (sidebar: Sidebar) => render(
    <ShlinkVersionsContainer selectedServer={fromPartial({})} sidebar={sidebar} />,
  );

  it.each([
    [{ sidebarPresent: false }, 'text-center'],
    [{ sidebarPresent: true }, 'text-center shlink-versions-container--with-sidebar'],
  ])('renders proper col classes based on sidebar status', (sidebar, expectedClasses) => {
    const { container } = setUp(sidebar);
    expect(container.firstChild).toHaveAttribute('class', `${expectedClasses}`);
  });
});
