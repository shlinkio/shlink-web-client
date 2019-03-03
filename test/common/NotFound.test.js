import React from 'react';
import { shallow } from 'enzyme';
import { Link } from 'react-router-dom';
import NotFound from '../../src/common/NotFound';

describe('<NotFound />', () => {
  let wrapper;
  let content;

  beforeEach(() => {
    wrapper = shallow(<NotFound />);
    content = wrapper.text();
  });

  afterEach(() => wrapper.unmount());

  it('shows expected error title', () => expect(content).toContain('Oops! We could not find requested route.'));

  it('shows expected error message', () =>
    expect(content).toContain(
      'Use your browser\'s back button to navigate to the page you have previously come from, or just press this button.'
    ));

  it('shows a link to the home', () => {
    const link = wrapper.find(Link);

    expect(link.prop('to')).toEqual('/');
    expect(link.prop('className')).toEqual('btn btn-outline-primary btn-lg');
  });
});
