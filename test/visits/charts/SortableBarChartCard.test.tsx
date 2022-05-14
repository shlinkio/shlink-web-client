import { shallow, ShallowWrapper } from 'enzyme';
import { range } from 'ramda';
import { OrderingDropdown } from '../../../src/utils/OrderingDropdown';
import PaginationDropdown from '../../../src/utils/PaginationDropdown';
import { rangeOf } from '../../../src/utils/utils';
import { OrderDir } from '../../../src/utils/helpers/ordering';
import { Stats } from '../../../src/visits/types';
import { SortableBarChartCard } from '../../../src/visits/charts/SortableBarChartCard';
import { HorizontalBarChart } from '../../../src/visits/charts/HorizontalBarChart';

describe('<SortableBarChartCard />', () => {
  let wrapper: ShallowWrapper;
  const sortingItems = {
    name: 'Name',
    amount: 'Amount',
  };
  const stats = {
    Foo: 100,
    Bar: 50,
  };
  const createWrapper = (withPagination = false, extraStats = {}) => {
    wrapper = shallow(
      <SortableBarChartCard
        title="Foo"
        stats={{ ...stats, ...extraStats }}
        sortingItems={sortingItems}
        withPagination={withPagination}
      />,
    );

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());

  it('renders stats unchanged when no ordering is set', () => {
    const wrapper = createWrapper();
    const chart = wrapper.find(HorizontalBarChart);

    expect(chart.prop('stats')).toEqual(stats);
  });

  describe('renders properly ordered stats when ordering is set', () => {
    let assert: (sortName: string, sortDir: OrderDir, keys: string[], values: number[]) => void;

    beforeEach(() => {
      const wrapper = createWrapper();
      const dropdown = wrapper.renderProp('title' as never)().find(OrderingDropdown);

      assert = (sortName: string, sortDir: OrderDir, keys: string[], values: number[]) => {
        dropdown.prop('onChange')(sortName, sortDir);

        const stats = wrapper.find(HorizontalBarChart).prop('stats');

        expect(Object.keys(stats)).toEqual(keys);
        expect(Object.values(stats)).toEqual(values);
      };
    });

    it('name - ASC', () => assert('name', 'ASC', ['Bar', 'Foo'], [50, 100]));
    it('name - DESC', () => assert('name', 'DESC', ['Foo', 'Bar'], [100, 50]));
    it('value - ASC', () => assert('value', 'ASC', ['Bar', 'Foo'], [50, 100]));
    it('value - DESC', () => assert('value', 'DESC', ['Foo', 'Bar'], [100, 50]));
  });

  describe('renders properly paginated stats when pagination is set', () => {
    let assert: (itemsPerPage: number, expectedStats: string[]) => void;

    beforeEach(() => {
      const wrapper = createWrapper(true, range(1, 159).reduce<Stats>((accum, value) => {
        accum[`key_${value}`] = value;

        return accum;
      }, {}));
      const dropdown = wrapper.renderProp('title' as never)().find(PaginationDropdown);

      assert = (itemsPerPage: number, expectedStats: string[]) => {
        dropdown.prop('setValue')(itemsPerPage);

        const stats = wrapper.find(HorizontalBarChart).prop('stats');

        expect(Object.keys(stats)).toEqual(expectedStats);
      };
    });

    const buildExpected = (size: number): string[] => ['Foo', 'Bar', ...rangeOf(size - 2, (i) => `key_${i}`)];

    it('50 items per page', () => assert(50, buildExpected(50)));
    it('100 items per page', () => assert(100, buildExpected(100)));
    it('200 items per page', () => assert(200, buildExpected(160)));
    it('500 items per page', () => assert(500, buildExpected(160)));
  });

  it('renders extra header content', () => {
    const wrapper = shallow(
      <span>
        <SortableBarChartCard
          title="Foo"
          stats={stats}
          sortingItems={sortingItems}
          extraHeaderContent={() => (
            <span>
              <span className="foo-span">Foo</span>
              <span className="bar-span">Bar</span>
            </span>
          )}
        />
      </span>,
    ).find(SortableBarChartCard);
    const header = wrapper.renderProp('extraHeaderContent')();

    expect(header.find('.foo-span')).toHaveLength(1);
    expect(header.find('.bar-span')).toHaveLength(1);
  });
});
