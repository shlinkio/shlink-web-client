import React from 'react';
import { shallow } from 'enzyme';
import createScrollToTop from '../../src/common/ScrollToTop';

describe('<ScrollToTop />', () => {
  let wrapper;
  const window = {
    scrollTo: jest.fn(),
  };

  beforeEach(() => {
    const ScrollToTop = createScrollToTop(window);

    wrapper = shallow(<ScrollToTop locaction={{ href: 'foo' }}>Foobar</ScrollToTop>);
  });

  afterEach(() => {
    wrapper.unmount();
    window.scrollTo.mockReset();
  });

  it('just renders children', () => expect(wrapper.text()).toEqual('Foobar'));
});
