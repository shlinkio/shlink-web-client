import React from 'react';
import { shallow } from 'enzyme';
import { identity } from 'ramda';
import createTagVisits from '../../src/visits/TagVisits';
import TagVisitsHeader from '../../src/visits/TagVisitsHeader';

describe('<TagVisits />', () => {
  let wrapper;
  const getTagVisitsMock = jest.fn();
  const match = {
    params: { tag: 'foo' },
  };
  const history = {
    goBack: jest.fn(),
  };
  const realTimeUpdates = { enabled: true };
  const VisitsStats = jest.fn();

  beforeEach(() => {
    const TagVisits = createTagVisits(VisitsStats, {});

    wrapper = shallow(
      <TagVisits
        getTagVisits={getTagVisitsMock}
        match={match}
        history={history}
        tagVisits={{ loading: true, visits: [] }}
        cancelGetTagVisits={identity}
        settings={{ realTimeUpdates }}
      />
    );
  });

  afterEach(() => wrapper.unmount());
  afterEach(jest.resetAllMocks);

  it('renders visit stats and visits header', () => {
    const visitStats = wrapper.find(VisitsStats);
    const visitHeader = wrapper.find(TagVisitsHeader);

    expect(visitStats).toHaveLength(1);
    expect(visitHeader).toHaveLength(1);
  });
});
