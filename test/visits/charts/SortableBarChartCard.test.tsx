import type { ReactNode } from 'react';
import { screen } from '@testing-library/react';
import { range } from 'ramda';
import { rangeOf } from '../../../src/utils/utils';
import type { Stats } from '../../../src/visits/types';
import { SortableBarChartCard } from '../../../src/visits/charts/SortableBarChartCard';
import { renderWithEvents } from '../../__helpers__/setUpTest';

describe('<SortableBarChartCard />', () => {
  const sortingItems = {
    name: 'Name',
    amount: 'Amount',
  };
  const stats = {
    Foo: 100,
    Bar: 50,
  };
  const setUp = (withPagination = false, extraStats = {}, extra?: (foo?: string[]) => ReactNode) => renderWithEvents(
    <SortableBarChartCard
      title="Foo"
      stats={{ ...stats, ...extraStats }}
      sortingItems={sortingItems}
      withPagination={withPagination}
      extraHeaderContent={extra}
    />,
  );

  it('renders stats unchanged when no ordering is set', () => {
    const { container } = setUp();

    expect(container.firstChild).not.toBeNull();
    expect(container.firstChild).toMatchSnapshot();
  });

  it.each([
    ['Name', 1],
    ['Amount', 1],
    ['Name', 2],
    ['Amount', 2],
  ])('renders properly ordered stats when ordering is set', async (name, clicks) => {
    const { user } = setUp();

    await user.click(screen.getByRole('button'));
    await Promise.all(rangeOf(clicks, async () => user.click(screen.getByRole('menuitem', { name }))));

    expect(screen.getByRole('document')).toMatchSnapshot();
  });

  it.each([
    [0],
    [1],
    [2],
    [3],
  ])('renders properly paginated stats when pagination is set', async (itemIndex) => {
    const { user } = setUp(true, range(1, 159).reduce<Stats>((accum, value) => {
      accum[`key_${value}`] = value;
      return accum;
    }, {}));

    await user.click(screen.getAllByRole('button')[1]);
    await user.click(screen.getAllByRole('menuitem')[itemIndex]);

    expect(screen.getByRole('document')).toMatchSnapshot();
  });

  it('renders extra header content', () => {
    setUp(false, {}, () => (
      <span>
        <span className="foo-span">Foo in header</span>
        <span className="bar-span">Bar in header</span>
      </span>
    ));

    expect(screen.getByText('Foo in header')).toHaveClass('foo-span');
    expect(screen.getByText('Bar in header')).toHaveClass('bar-span');
  });
});
