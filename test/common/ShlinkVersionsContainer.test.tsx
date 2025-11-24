import { fromPartial } from '@total-typescript/shoehorn';
import { ShlinkVersionsContainer } from '../../src/common/ShlinkVersionsContainer';
import type { ReachableServer, SelectedServer } from '../../src/servers/data';
import { checkAccessibility } from '../__helpers__/accessibility';
import { renderWithStore } from '../__helpers__/setUpTest';

describe('<ShlinkVersionsContainer />', () => {
  const setUp = (selectedServer: SelectedServer = null) => renderWithStore(<ShlinkVersionsContainer />, {
    initialState: { selectedServer },
  });

  it.each([
    [null],
    [fromPartial<SelectedServer>({})],
    [fromPartial<ReachableServer>({ version: '1.0.0', printableVersion: 'v1.0.0' })],
  ])('passes a11y checks', (selectedServer) => checkAccessibility(setUp(selectedServer)));

  it.each([
    [null, false],
    [fromPartial<SelectedServer>({}), false],
    [fromPartial<ReachableServer>({ version: '1.0.0' }), true],
  ])('renders proper col classes based on sidebar status', (selectedServer, shouldAddMargin) => {
    const { container } = setUp(selectedServer);

    if (shouldAddMargin) {
      expect(container.firstChild).toHaveClass('md:ml-(--aside-menu-width)');
    } else {
      expect(container.firstChild).not.toHaveClass('md:ml-(--aside-menu-width)');
    }
  });
});
