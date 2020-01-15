import React from 'react';
import { shallow } from 'enzyme';
import { UncontrolledTooltip } from 'reactstrap';
import each from 'jest-each';
import ShortUrlVisitsCount from '../../../src/short-urls/helpers/ShortUrlVisitsCount';

describe('<ShortUrlVisitsCount />', () => {
  let wrapper;

  const createWrapper = (visitsCount, meta) => {
    wrapper = shallow(<ShortUrlVisitsCount visitsCount={visitsCount} meta={meta} />);

    return wrapper;
  };

  afterEach(() => wrapper && wrapper.unmount());

  each([ undefined, {}]).it('just returns visits when no maxVisits is provided', (meta) => {
    const visitsCount = 45;
    const wrapper = createWrapper(visitsCount, meta);
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
    const wrapper = createWrapper(visitsCount, meta);
    const maxVisitsHelper = wrapper.find('.short-urls-visits-count__max-visits-control');
    const maxVisitsTooltip = wrapper.find(UncontrolledTooltip);

    expect(wrapper.html()).toContain(`/ ${maxVisits}`);
    expect(maxVisitsHelper).toHaveLength(1);
    expect(maxVisitsTooltip).toHaveLength(1);
  });
});
