import React from 'react';
import { shallow } from 'enzyme';
import * as sinon from 'sinon';
import createScrollToTop from '../../src/common/ScrollToTop';

describe('<ScrollToTop />', () => {
  let wrapper;
  const window = {
    scrollTo: sinon.spy(),
  };

  beforeEach(() => {
    const ScrollToTop = createScrollToTop(window);

    wrapper = shallow(<ScrollToTop locaction={{ href: 'foo' }}>Foobar</ScrollToTop>);
  });

  afterEach(() => {
    wrapper.unmount();
    window.scrollTo.resetHistory();
  });

  it('just renders children', () => expect(wrapper.text()).toEqual('Foobar'));

  it('scrolls to top when location changes', () => {
    wrapper.instance().componentDidUpdate({ location: { href: 'bar' } });
    expect(window.scrollTo.calledOnce).toEqual(true);
  });
});
