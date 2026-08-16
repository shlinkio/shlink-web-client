import { fromPartial } from '@total-typescript/shoehorn';
import { MemoryRouter } from 'react-router';
import type { ServerWithId } from '../../src/servers/data';
import { ServersListGroup } from '../../src/servers/ServersListGroup';
import { checkAccessibility } from '../__helpers__/accessibility';
import { render } from '../__helpers__/setUpTest.tsx';

describe('<ServersListGroup />', () => {
  const servers: ServerWithId[] = [fromPartial({ name: 'foo', id: '123' }), fromPartial({ name: 'bar', id: '456' })];
  const setUp = (params: { servers?: ServerWithId[]; borderless?: boolean } = {}) => {
    const { servers = [], borderless } = params;

    return render(
      <MemoryRouter>
        <ServersListGroup servers={servers} borderless={borderless} />
      </MemoryRouter>,
    );
  };

  it('passes a11y checks', () => checkAccessibility(setUp()));

  it.each([[servers], [[]]])('shows servers list', async (servers) => {
    const screen = await setUp({ servers });

    expect(screen.getByTestId('list').elements()).toHaveLength(servers.length ? 1 : 0);
    expect(screen.getByRole('link').elements()).toHaveLength(servers.length);
  });

  it.each([[true], [false], [undefined]])('renders proper classes for embedded', async (borderless) => {
    const screen = await setUp({ servers, borderless });
    const list = screen.getByTestId('list');

    if (!borderless) {
      await expect.element(list).toHaveClass('border-y');
    } else {
      await expect.element(list).not.toHaveClass('border-y');
    }
  });
});
