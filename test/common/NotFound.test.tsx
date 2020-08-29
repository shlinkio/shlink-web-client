import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Link } from 'react-router-dom';
import NotFound from '../../src/common/NotFound';

describe('<NotFound />', () => {
  let wrapper: ShallowWrapper;
  const createWrapper = (props = {}) => {
    wrapper = shallow(<NotFound {...props} />);
    const content = wrapper.text();

    return { wrapper, content };
  };

  afterEach(() => wrapper?.unmount());

  it('shows expected error title', () => {
    const { content } = createWrapper();

    expect(content).toContain('Oops! We could not find requested route.');
  });

  it('shows expected error message', () => {
    const { content } = createWrapper();

    expect(content).toContain(
      'Use your browser\'s back button to navigate to the page you have previously come from, or just press this button.',
    );
  });

  it('shows a link to the home', () => {
    const { wrapper } = createWrapper();
    const link = wrapper.find(Link);

    expect(link.prop('to')).toEqual('/');
    expect(link.prop('className')).toEqual('btn btn-outline-primary btn-lg');
    expect(link.prop('children')).toEqual('Home');
  });

  it('shows a link with provided props', () => {
    const { wrapper } = createWrapper({ to: '/foo/bar', children: 'Hello' });
    const link = wrapper.find(Link);

    expect(link.prop('to')).toEqual('/foo/bar');
    expect(link.prop('className')).toEqual('btn btn-outline-primary btn-lg');
    expect(link.prop('children')).toEqual('Hello');
  });
});
