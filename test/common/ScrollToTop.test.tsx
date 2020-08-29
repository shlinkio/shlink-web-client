import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import { RouteChildrenProps } from 'react-router';
import createScrollToTop from '../../src/common/ScrollToTop';

describe('<ScrollToTop />', () => {
  let wrapper: ShallowWrapper;

  beforeEach(() => {
    const ScrollToTop = createScrollToTop();

    wrapper = shallow(<ScrollToTop {...Mock.all<RouteChildrenProps>()}>Foobar</ScrollToTop>);
  });

  afterEach(() => wrapper.unmount());

  it('just renders children', () => expect(wrapper.text()).toEqual('Foobar'));
});
