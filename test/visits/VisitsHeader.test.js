import React from 'react';
import { shallow } from 'enzyme';
import VisitsHeader from '../../src/visits/VisitsHeader';

describe('<VisitsHeader />', () => {
  let wrapper;
  const visits = [{}, {}, {}];
  const title = 'My header title';
  const goBack = jest.fn();

  beforeEach(() => {
    wrapper = shallow(
      <VisitsHeader visits={visits} goBack={goBack} title={title} />
    );
  });

  afterEach(() => wrapper.unmount());
  afterEach(jest.resetAllMocks);

  it('shows the amount of visits', () => {
    const visitsBadge = wrapper.find('.badge');

    expect(visitsBadge.html()).toContain(
      `Visits: <span><strong class="short-url-visits-count__amount">${visits.length}</strong></span>`
    );
  });

  it('shows the title in two places', () => {
    const titles = wrapper.find('.text-center');

    expect(titles).toHaveLength(2);
    expect(titles.at(0).html()).toContain(title);
    expect(titles.at(1).html()).toContain(title);
  });
});
