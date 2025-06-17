import { render, screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { MemoryRouter } from 'react-router';
import type { ServerWithId } from '../../src/servers/data';
import { ServersListGroup } from '../../src/servers/ServersListGroup';
import { checkAccessibility } from '../__helpers__/accessibility';

describe('<ServersListGroup />', () => {
  const servers: ServerWithId[] = [
    fromPartial({ name: 'foo', id: '123' }),
    fromPartial({ name: 'bar', id: '456' }),
  ];
  const setUp = (params: { servers?: ServerWithId[]; borderless?: boolean } = {}) => {
    const { servers = [], borderless } = params;

    return render(
      <MemoryRouter>
        <ServersListGroup servers={servers} borderless={borderless} />
      </MemoryRouter>,
    );
  };

  it('passes a11y checks', () => checkAccessibility(setUp()));

  it.each([
    [servers],
    [[]],
  ])('shows servers list', (servers) => {
    setUp({ servers });

    expect(screen.queryAllByTestId('list')).toHaveLength(servers.length ? 1 : 0);
    expect(screen.queryAllByRole('link')).toHaveLength(servers.length);
  });

  it.each([
    [true],
    [false],
    [undefined],
  ])('renders proper classes for embedded', (borderless) => {
    setUp({ servers, borderless });
    const list = screen.getByTestId('list');

    if (!borderless) {
      expect(list).toHaveClass('border-y');
    } else {
      expect(list).not.toHaveClass('border-y');
    }
  });
});
