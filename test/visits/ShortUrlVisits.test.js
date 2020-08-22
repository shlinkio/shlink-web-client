import React from 'react';
import { shallow } from 'enzyme';
import { identity } from 'ramda';
import createShortUrlVisits from '../../src/visits/ShortUrlVisits';
import ShortUrlVisitsHeader from '../../src/visits/ShortUrlVisitsHeader';

describe('<ShortUrlVisits />', () => {
  let wrapper;
  const getShortUrlVisitsMock = jest.fn();
  const match = {
    params: { shortCode: 'abc123' },
  };
  const location = { search: '' };
  const history = {
    goBack: jest.fn(),
  };
  const VisitsStats = jest.fn();

  beforeEach(() => {
    const ShortUrlVisits = createShortUrlVisits(VisitsStats);

    wrapper = shallow(
      <ShortUrlVisits
        getShortUrlDetail={identity}
        getShortUrlVisits={getShortUrlVisitsMock}
        match={match}
        location={location}
        history={history}
        shortUrlVisits={{ loading: true, visits: [] }}
        shortUrlDetail={{}}
        cancelGetShortUrlVisits={identity}
        matchMedia={() => ({ matches: false })}
      />,
    );
  });

  afterEach(() => wrapper.unmount());
  afterEach(jest.resetAllMocks);

  it('renders visit stats and visits header', () => {
    const visitStats = wrapper.find(VisitsStats);
    const visitHeader = wrapper.find(ShortUrlVisitsHeader);

    expect(visitStats).toHaveLength(1);
    expect(visitHeader).toHaveLength(1);
  });
});
