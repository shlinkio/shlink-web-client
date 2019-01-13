import React from 'react';
import { shallow } from 'enzyme';
import Moment from 'react-moment';
import { VisitsHeader } from '../../src/visits/VisitsHeader';
import ExternalLink from '../../src/utils/ExternalLink';

describe('<VisitsHeader />', () => {
  let wrapper;
  const shortUrlDetail = {
    shortUrl: {
      shortUrl: 'https://doma.in/abc123',
      longUrl: 'https://foo.bar/bar/foo',
      dateCreated: '2018-01-01T10:00:00+01:00',
    },
    loading: false,
  };
  const shortUrlVisits = {
    visits: [{}, {}, {}],
  };

  beforeEach(() => {
    wrapper = shallow(
      <VisitsHeader shortUrlDetail={shortUrlDetail} shortUrlVisits={shortUrlVisits} shortLink="foo" />
    );
  });
  afterEach(() => wrapper.unmount());

  it('shows the amount of visits', () => {
    const visitsBadge = wrapper.find('.badge');

    expect(visitsBadge.text()).toEqual(`Visits: ${shortUrlVisits.visits.length}`);
  });

  it('shows when the URL was created', () => {
    const moment = wrapper.find(Moment).first();

    expect(moment.prop('children')).toEqual(shortUrlDetail.shortUrl.dateCreated);
  });

  it('shows the long URL', () => {
    const longUrlLink = wrapper.find(ExternalLink).last();

    expect(longUrlLink.prop('href')).toEqual(shortUrlDetail.shortUrl.longUrl);
  });
});
