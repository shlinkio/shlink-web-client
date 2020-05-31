import React from 'react';
import { shallow } from 'enzyme';
import { identity } from 'ramda';
import { Card, Progress } from 'reactstrap';
import createVisitStats from '../../src/visits/VisitsStats';
import Message from '../../src/utils/Message';
import GraphCard from '../../src/visits/helpers/GraphCard';
import SortableBarGraph from '../../src/visits/helpers/SortableBarGraph';
import DateRangeRow from '../../src/utils/DateRangeRow';

describe('<VisitStats />', () => {
  let wrapper;
  const processStatsFromVisits = () => (
    { os: {}, browsers: {}, referrers: {}, countries: {}, cities: {}, citiesForMap: {} }
  );
  const getVisitsMock = jest.fn();

  const createComponent = (visitsInfo) => {
    const VisitStats = createVisitStats({ processStatsFromVisits, normalizeVisits: identity }, () => '');

    wrapper = shallow(
      <VisitStats
        getVisits={getVisitsMock}
        visitsInfo={visitsInfo}
        cancelGetVisits={identity}
        matchMedia={() => ({ matches: false })}
      />
    );

    return wrapper;
  };

  afterEach(() => wrapper && wrapper.unmount());

  it('renders a preloader when visits are loading', () => {
    const wrapper = createComponent({ loading: true, visits: [] });
    const loadingMessage = wrapper.find(Message);
    const progress = wrapper.find(Progress);

    expect(loadingMessage).toHaveLength(1);
    expect(loadingMessage.html()).toContain('Loading...');
    expect(progress).toHaveLength(0);
  });

  it('renders a warning and progress bar when loading large amounts of visits', () => {
    const wrapper = createComponent({ loading: true, loadingLarge: true, visits: [], progress: 25 });
    const loadingMessage = wrapper.find(Message);
    const progress = wrapper.find(Progress);

    expect(loadingMessage).toHaveLength(1);
    expect(loadingMessage.html()).toContain('This is going to take a while... :S');
    expect(progress).toHaveLength(1);
    expect(progress.prop('value')).toEqual(25);
  });

  it('renders an error message when visits could not be loaded', () => {
    const wrapper = createComponent({ loading: false, error: true, visits: [] });
    const errorMessage = wrapper.find(Card);

    expect(errorMessage).toHaveLength(1);
    expect(errorMessage.html()).toContain('An error occurred while loading visits :(');
  });

  it('renders a message when visits are loaded but the list is empty', () => {
    const wrapper = createComponent({ loading: false, error: false, visits: [] });
    const message = wrapper.find(Message);

    expect(message).toHaveLength(1);
    expect(message.html()).toContain('There are no visits matching current filter  :(');
  });

  it('renders all graphics when visits are properly loaded', () => {
    const wrapper = createComponent({ loading: false, error: false, visits: [{}, {}, {}] });
    const graphs = wrapper.find(GraphCard);
    const sortableBarGraphs = wrapper.find(SortableBarGraph);

    expect(graphs.length + sortableBarGraphs.length).toEqual(5);
  });

  it('reloads visits when selected dates change', () => {
    const wrapper = createComponent({ loading: false, error: false, visits: [{}, {}, {}] });
    const dateRange = wrapper.find(DateRangeRow);

    dateRange.simulate('startDateChange', '2016-01-01T00:00:00+01:00');
    dateRange.simulate('endDateChange', '2016-01-02T00:00:00+01:00');
    dateRange.simulate('endDateChange', '2016-01-03T00:00:00+01:00');

    expect(wrapper.find(DateRangeRow).prop('startDate')).toEqual('2016-01-01T00:00:00+01:00');
    expect(wrapper.find(DateRangeRow).prop('endDate')).toEqual('2016-01-03T00:00:00+01:00');
  });

  it('holds the map button content generator on cities graph extraHeaderContent', () => {
    const wrapper = createComponent({ loading: false, error: false, visits: [{}, {}, {}] });
    const citiesGraph = wrapper.find(SortableBarGraph).find('[title="Cities"]');
    const extraHeaderContent = citiesGraph.prop('extraHeaderContent');

    expect(extraHeaderContent).toHaveLength(1);
    expect(typeof extraHeaderContent).toEqual('function');
  });
});
