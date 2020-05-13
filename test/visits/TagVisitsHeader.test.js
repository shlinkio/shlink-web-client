import React from 'react';
import { shallow } from 'enzyme';
import Tag from '../../src/tags/helpers/Tag';
import TagVisitsHeader from '../../src/visits/TagVisitsHeader';

describe('<TagVisitsHeader />', () => {
  let wrapper;
  const tagVisits = {
    tag: 'foo',
    visits: [{}, {}, {}],
  };
  const goBack = jest.fn();

  beforeEach(() => {
    wrapper = shallow(
      <TagVisitsHeader tagVisits={tagVisits} goBack={goBack} colorGenerator={{}} />
    );
  });
  afterEach(() => wrapper.unmount());

  it('shows expected visits', () => {
    expect(wrapper.prop('visits')).toEqual(tagVisits.visits);
  });

  it('shows title for tag', () => {
    const title = shallow(wrapper.prop('title'));
    const tag = title.find(Tag).first();

    expect(tag.prop('text')).toEqual(tagVisits.tag);

    title.unmount();
  });
});
