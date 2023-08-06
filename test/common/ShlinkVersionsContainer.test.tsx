import { render } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { ShlinkVersionsContainer } from '../../src/common/ShlinkVersionsContainer';

describe('<ShlinkVersionsContainer />', () => {
  const setUp = (activeRoute: string) => {
    const history = createMemoryHistory();
    history.push(activeRoute);

    return render(
      <Router location={history.location} navigator={history}>
        <ShlinkVersionsContainer selectedServer={fromPartial({})} />
      </Router>,
    );
  };

  it.each([
    ['/something', 'text-center'],
    ['/server/foo/edit', 'text-center'],
    ['/server/foo/bar', 'text-center shlink-versions-container--with-sidebar'],
  ])('renders proper col classes based on sidebar status', (sidebar, expectedClasses) => {
    const { container } = setUp(sidebar);
    expect(container.firstChild).toHaveAttribute('class', `${expectedClasses}`);
  });
});
