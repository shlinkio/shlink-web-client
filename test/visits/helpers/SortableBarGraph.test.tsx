import { shallow, ShallowWrapper } from 'enzyme';
import { range } from 'ramda';
import SortableBarGraph from '../../../src/visits/helpers/SortableBarGraph';
import GraphCard from '../../../src/visits/helpers/GraphCard';
import SortingDropdown from '../../../src/utils/SortingDropdown';
import PaginationDropdown from '../../../src/utils/PaginationDropdown';
import { OrderDir, rangeOf } from '../../../src/utils/utils';
import { Stats } from '../../../src/visits/types';

describe('<SortableBarGraph />', () => {
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
      <SortableBarGraph
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
    const graphCard = wrapper.find(GraphCard);

    expect(graphCard.prop('stats')).toEqual(stats);
  });

  describe('renders properly ordered stats when ordering is set', () => {
    let assert: (sortName: string, sortDir: OrderDir, keys: string[], values: number[], done: Function) => void;

    beforeEach(() => {
      const wrapper = createWrapper();
      const dropdown = wrapper.renderProp('title' as never)().find(SortingDropdown);

      assert = (sortName: string, sortDir: OrderDir, keys: string[], values: number[], done: Function) => {
        dropdown.prop('onChange')(sortName, sortDir);
        setImmediate(() => {
          const stats = wrapper.find(GraphCard).prop('stats');

          expect(Object.keys(stats)).toEqual(keys);
          expect(Object.values(stats)).toEqual(values);
          done();
        });
      };
    });

    it('name - ASC', (done) => assert('name', 'ASC', [ 'Bar', 'Foo' ], [ 50, 100 ], done));
    it('name - DESC', (done) => assert('name', 'DESC', [ 'Foo', 'Bar' ], [ 100, 50 ], done));
    it('value - ASC', (done) => assert('value', 'ASC', [ 'Bar', 'Foo' ], [ 50, 100 ], done));
    it('value - DESC', (done) => assert('value', 'DESC', [ 'Foo', 'Bar' ], [ 100, 50 ], done));
  });

  describe('renders properly paginated stats when pagination is set', () => {
    let assert: (itemsPerPage: number, expectedStats: string[], done: Function) => void;

    beforeEach(() => {
      const wrapper = createWrapper(true, range(1, 159).reduce<Stats>((accum, value) => {
        accum[`key_${value}`] = value;

        return accum;
      }, {}));
      const dropdown = wrapper.renderProp('title' as never)().find(PaginationDropdown);

      assert = (itemsPerPage: number, expectedStats: string[], done: Function) => {
        dropdown.prop('setValue')(itemsPerPage);
        setImmediate(() => {
          const stats = wrapper.find(GraphCard).prop('stats');

          expect(Object.keys(stats)).toEqual(expectedStats);
          done();
        });
      };
    });

    const buildExpected = (size: number): string[] => [ 'Foo', 'Bar', ...rangeOf(size - 2, (i) => `key_${i}`) ];

    it('50 items per page', (done) => assert(50, buildExpected(50), done));
    it('100 items per page', (done) => assert(100, buildExpected(100), done));
    it('200 items per page', (done) => assert(200, buildExpected(160), done));
    it('500 items per page', (done) => assert(500, buildExpected(160), done));
  });

  it('renders extra header content', () => {
    const wrapper = shallow(
      <span>
        <SortableBarGraph
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
    ).find(SortableBarGraph);
    const header = wrapper.renderProp('extraHeaderContent')();

    expect(header.find('.foo-span')).toHaveLength(1);
    expect(header.find('.bar-span')).toHaveLength(1);
  });
});
