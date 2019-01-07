import React from 'react';
import { shallow } from 'enzyme';
import { identity } from 'ramda';
import { Card } from 'reactstrap';
import * as sinon from 'sinon';
import createShortUrlVisits from '../../src/visits/ShortUrlVisits';
import MutedMessage from '../../src/utils/MuttedMessage';
import GraphCard from '../../src/visits/GraphCard';
import DateInput from '../../src/utils/DateInput';
import SortableBarGraph from '../../src/visits/SortableBarGraph';

describe('<ShortUrlVisits />', () => {
  let wrapper;
  const statsProcessor = () => ({});
  const getShortUrlVisitsMock = sinon.spy();
  const match = {
    params: { shortCode: 'abc123' },
  };

  const createComponent = (shortUrlVisits) => {
    const ShortUrlVisits = createShortUrlVisits({
      processBrowserStats: statsProcessor,
      processCountriesStats: statsProcessor,
      processOsStats: statsProcessor,
      processReferrersStats: statsProcessor,
      processCitiesStats: statsProcessor,
    });

    wrapper = shallow(
      <ShortUrlVisits
        getShortUrlDetail={identity}
        getShortUrlVisits={getShortUrlVisitsMock}
        match={match}
        shortUrlVisits={shortUrlVisits}
        shortUrlDetail={{}}
      />
    );

    return wrapper;
  };

  afterEach(() => {
    getShortUrlVisitsMock.resetHistory();

    if (wrapper) {
      wrapper.unmount();
    }
  });

  it('Renders a preloader when visits are loading', () => {
    const wrapper = createComponent({ loading: true });
    const loadingMessage = wrapper.find(MutedMessage);

    expect(loadingMessage).toHaveLength(1);
    expect(loadingMessage.html()).toContain('Loading...');
  });

  it('renders an error message when visits could not be loaded', () => {
    const wrapper = createComponent({ loading: false, error: true });
    const errorMessage = wrapper.find(Card);

    expect(errorMessage).toHaveLength(1);
    expect(errorMessage.html()).toContain('An error occurred while loading visits :(');
  });

  it('renders a message when visits are loaded but the list is empty', () => {
    const wrapper = createComponent({ loading: false, error: false, visits: [] });
    const message = wrapper.find(MutedMessage);

    expect(message).toHaveLength(1);
    expect(message.html()).toContain('There are no visits matching current filter  :(');
  });

  it('renders all graphics when visits are properly loaded', () => {
    const wrapper = createComponent({ loading: false, error: false, visits: [{}, {}, {}] });
    const graphs = wrapper.find(GraphCard);
    const sortableBarGraphs = wrapper.find(SortableBarGraph);
    const expectedGraphsCount = 5;

    expect(graphs.length + sortableBarGraphs.length).toEqual(expectedGraphsCount);
  });

  it('reloads visits when selected dates change', () => {
    const wrapper = createComponent({ loading: false, error: false, visits: [{}, {}, {}] });
    const dateInput = wrapper.find(DateInput).first();
    const expectedGetShortUrlVisitsCalls = 4;

    dateInput.simulate('change', '2016-01-01T00:00:00+01:00');
    dateInput.simulate('change', '2016-01-02T00:00:00+01:00');
    dateInput.simulate('change', '2016-01-03T00:00:00+01:00');

    expect(getShortUrlVisitsMock.callCount).toEqual(expectedGetShortUrlVisitsCalls);
    expect(wrapper.state('startDate')).toEqual('2016-01-03T00:00:00+01:00');
  });
});
