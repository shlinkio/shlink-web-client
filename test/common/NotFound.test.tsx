import { shallow, ShallowWrapper } from 'enzyme';
import { Link } from 'react-router-dom';
import NotFound from '../../src/common/NotFound';
import { SimpleCard } from '../../src/utils/SimpleCard';

describe('<NotFound />', () => {
  let wrapper: ShallowWrapper;
  const createWrapper = (props = {}) => {
    wrapper = shallow(<NotFound {...props} />).find(SimpleCard);

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());

  it('shows expected error title', () => {
    const wrapper = createWrapper();

    expect(wrapper.contains('Oops! We could not find requested route.')).toEqual(true);
  });

  it('shows expected error message', () => {
    const wrapper = createWrapper();

    expect(wrapper.contains(
      'Use your browser\'s back button to navigate to the page you have previously come from, or just press this button.',
    )).toEqual(true);
  });

  it('shows a link to the home', () => {
    const wrapper = createWrapper();
    const link = wrapper.find(Link);

    expect(link.prop('to')).toEqual('/');
    expect(link.prop('className')).toEqual('btn btn-outline-primary btn-lg');
    expect(link.prop('children')).toEqual('Home');
  });

  it('shows a link with provided props', () => {
    const wrapper = createWrapper({ to: '/foo/bar', children: 'Hello' });
    const link = wrapper.find(Link);

    expect(link.prop('to')).toEqual('/foo/bar');
    expect(link.prop('className')).toEqual('btn btn-outline-primary btn-lg');
    expect(link.prop('children')).toEqual('Hello');
  });
});
