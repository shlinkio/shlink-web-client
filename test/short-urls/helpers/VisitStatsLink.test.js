import React from 'react';
import { shallow } from 'enzyme';
import { Link } from 'react-router-dom';
import VisitStatsLink from '../../../src/short-urls/helpers/VisitStatsLink';

describe('<VisitStatsLink />', () => {
  let wrapper;

  afterEach(() => wrapper && wrapper.unmount());

  it.each([
    [ undefined, undefined ],
    [ null, null ],
    [{}, null ],
    [{}, undefined ],
    [ null, {}],
    [ undefined, {}],
  ])('only renders a plan span when either server or short URL are not set', (selectedServer, shortUrl) => {
    wrapper = shallow(<VisitStatsLink selectedServer={selectedServer} shortUrl={shortUrl}>Something</VisitStatsLink>);
    const link = wrapper.find(Link);

    expect(link).toHaveLength(0);
    expect(wrapper.html()).toEqual('<span>Something</span>');
  });

  it.each([
    [{ id: '1' }, { shortCode: 'abc123' }, '/server/1/short-code/abc123/visits' ],
    [
      { id: '3' },
      { shortCode: 'def456', domain: 'example.com' },
      '/server/3/short-code/def456/visits?domain=example.com',
    ],
  ])('renders link with expected query when', (selectedServer, shortUrl, expectedLink) => {
    wrapper = shallow(<VisitStatsLink selectedServer={selectedServer} shortUrl={shortUrl}>Something</VisitStatsLink>);
    const link = wrapper.find(Link);
    const to = link.prop('to');

    expect(link).toHaveLength(1);
    expect(to).toEqual(expectedLink);
  });
});
