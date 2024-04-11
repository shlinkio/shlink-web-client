import { render } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { ShlinkVersionsContainer } from '../../src/common/ShlinkVersionsContainer';
import type { ReachableServer, SelectedServer } from '../../src/servers/data';
import { checkAccessibility } from '../__helpers__/accessibility';

describe('<ShlinkVersionsContainer />', () => {
  const setUp = (selectedServer: SelectedServer = null) => render(
    <ShlinkVersionsContainer selectedServer={selectedServer} />,
  );

  it.each([
    [null],
    [fromPartial<SelectedServer>({})],
    [fromPartial<ReachableServer>({ version: '1.0.0', printableVersion: 'v1.0.0' })],
  ])('passes a11y checks', (selectedServer) => checkAccessibility(setUp(selectedServer)));

  it.each([
    [null, 'text-center'],
    [fromPartial<SelectedServer>({}), 'text-center'],
    [fromPartial<ReachableServer>({ version: '1.0.0' }), 'text-center shlink-versions-container--with-sidebar'],
  ])('renders proper col classes based on sidebar status', (selectedServer, expectedClasses) => {
    const { container } = setUp(selectedServer);
    expect(container.firstChild).toHaveAttribute('class', `${expectedClasses}`);
  });
});
