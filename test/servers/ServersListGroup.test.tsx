import { render, screen } from '@testing-library/react';
import { Mock } from 'ts-mockery';
import { MemoryRouter } from 'react-router-dom';
import { ServersListGroup } from '../../src/servers/ServersListGroup';
import { ServerWithId } from '../../src/servers/data';

describe('<ServersListGroup />', () => {
  const servers = [
    Mock.of<ServerWithId>({ name: 'foo', id: '123' }),
    Mock.of<ServerWithId>({ name: 'bar', id: '456' }),
  ];
  const setUp = (params: { servers?: ServerWithId[]; withChildren?: boolean; embedded?: boolean }) => {
    const { servers = [], withChildren = true, embedded } = params;

    return render(
      <MemoryRouter>
        <ServersListGroup servers={servers} embedded={embedded}>
          {withChildren ? 'The list of servers' : undefined}
        </ServersListGroup>
      </MemoryRouter>,
    );
  };

  it('renders title', () => {
    setUp({});
    expect(screen.getByRole('heading')).toHaveTextContent('The list of servers');
  });

  it('does not render title when children is not provided', () => {
    setUp({ withChildren: false });
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it.each([
    [servers],
    [[]],
  ])('shows servers list', (servers) => {
    setUp({ servers });

    expect(screen.queryAllByRole('list')).toHaveLength(servers.length ? 1 : 0);
    expect(screen.queryAllByRole('link')).toHaveLength(servers.length);
  });

  it.each([
    [true, 'servers-list__list-group servers-list__list-group--embedded'],
    [false, 'servers-list__list-group'],
    [undefined, 'servers-list__list-group'],
  ])('renders proper classes for embedded', (embedded, expectedClasses) => {
    setUp({ servers, embedded });
    expect(screen.getByRole('list')).toHaveAttribute('class', `${expectedClasses} list-group`);
  });
});
