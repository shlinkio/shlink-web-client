import React from 'react';
import { shallow } from 'enzyme';
import { UncontrolledTooltip } from 'reactstrap';
import ShortUrlVisitsCount from '../../../src/short-urls/helpers/ShortUrlVisitsCount';

describe('<ShortUrlVisitsCount />', () => {
  let wrapper;

  const createWrapper = (shortUrl) => {
    wrapper = shallow(<ShortUrlVisitsCount shortUrl={shortUrl} />);

    return wrapper;
  };

  afterEach(() => wrapper && wrapper.unmount());

  it('just returns visits when no maxVisits is provided', () => {
    const visitsCount = 45;
    const wrapper = createWrapper({ visitsCount });
    const maxVisitsHelper = wrapper.find('.short-urls-visits-count__max-visits-control');
    const maxVisitsTooltip = wrapper.find(UncontrolledTooltip);

    expect(wrapper.html()).toEqual(`<span>${visitsCount}</span>`);
    expect(maxVisitsHelper).toHaveLength(0);
    expect(maxVisitsTooltip).toHaveLength(0);
  });

  it('displays the maximum amount of visits when present', () => {
    const visitsCount = 45;
    const maxVisits = 500;
    const meta = { maxVisits };
    const wrapper = createWrapper({ visitsCount, meta });
    const maxVisitsHelper = wrapper.find('.short-urls-visits-count__max-visits-control');
    const maxVisitsTooltip = wrapper.find(UncontrolledTooltip);

    expect(wrapper.html()).toContain(`/ ${maxVisits}`);
    expect(maxVisitsHelper).toHaveLength(1);
    expect(maxVisitsTooltip).toHaveLength(1);
  });
});
