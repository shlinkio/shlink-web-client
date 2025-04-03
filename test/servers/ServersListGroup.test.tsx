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
  const setUp = (params: { servers?: ServerWithId[]; withChildren?: boolean; borderless?: boolean } = {}) => {
    const { servers = [], withChildren = true, borderless } = params;

    return render(
      <MemoryRouter>
        <ServersListGroup servers={servers} borderless={borderless}>
          {withChildren ? 'The list of servers' : undefined}
        </ServersListGroup>
      </MemoryRouter>,
    );
  };

  it('passes a11y checks', () => checkAccessibility(setUp()));

  it('renders title', () => {
    setUp({});
    expect(screen.getByTestId('title')).toHaveTextContent('The list of servers');
  });

  it('does not render title when children is not provided', () => {
    setUp({ withChildren: false });
    expect(screen.queryByTestId('title')).not.toBeInTheDocument();
  });

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
      expect(list).toHaveClass('tw:border-y');
    } else {
      expect(list).not.toHaveClass('tw:border-y');
    }
  });
});
