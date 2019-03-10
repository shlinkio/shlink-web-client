import React from 'react';
import { shallow } from 'enzyme';
import { keys, values } from 'ramda';
import SortableBarGraph from '../../src/visits/SortableBarGraph';
import GraphCard from '../../src/visits/GraphCard';
import SortingDropdown from '../../src/utils/SortingDropdown';

describe('<SortableBarGraph />', () => {
  let wrapper;
  const sortingItems = {
    name: 'Name',
    amount: 'Amount',
  };
  const stats = {
    Foo: 100,
    Bar: 50,
  };
  const createWrapper = (extraHeaderContent) => {
    wrapper = shallow(
      <SortableBarGraph title="Foo" stats={stats} sortingItems={sortingItems} extraHeaderContent={extraHeaderContent} />
    );

    return wrapper;
  };

  afterEach(() => wrapper && wrapper.unmount());

  it('renders stats unchanged when no ordering is set', () => {
    const wrapper = createWrapper();
    const graphCard = wrapper.find(GraphCard);

    expect(graphCard.prop('stats')).toEqual(stats);
  });

  describe('renders properly ordered stats when ordering is set', () => {
    let assert;

    beforeEach(() => {
      const wrapper = createWrapper();
      const dropdown = wrapper.find(SortingDropdown);

      assert = (sortName, sortDir, expectedKeys, expectedValues, done) => {
        dropdown.prop('onChange')(sortName, sortDir);
        setImmediate(() => {
          const graphCard = wrapper.find(GraphCard);
          const statsKeys = keys(graphCard.prop('stats'));
          const statsValues = values(graphCard.prop('stats'));

          expect(statsKeys).toEqual(expectedKeys);
          expect(statsValues).toEqual(expectedValues);
          done();
        });
      };
    });

    it('name - ASC', (done) => assert('name', 'ASC', [ 'Bar', 'Foo' ], [ 50, 100 ], done));
    it('name - DESC', (done) => assert('name', 'DESC', [ 'Foo', 'Bar' ], [ 100, 50 ], done));
    it('value - ASC', (done) => assert('value', 'ASC', [ 'Bar', 'Foo' ], [ 50, 100 ], done));
    it('value - DESC', (done) => assert('value', 'DESC', [ 'Foo', 'Bar' ], [ 100, 50 ], done));
  });

  it('renders extra header functions', () => {
    const wrapper = createWrapper((
      <React.Fragment>
        <span className="foo-span">Foo</span>
        <span className="bar-span">Bar</span>
      </React.Fragment>
    ));

    expect(wrapper.find('.foo-span')).toHaveLength(1);
    expect(wrapper.find('.bar-span')).toHaveLength(1);
  });
});
