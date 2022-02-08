import { shallow, ShallowWrapper } from 'enzyme';
import createScrollToTop from '../../src/common/ScrollToTop';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn().mockReturnValue({}),
}));

describe('<ScrollToTop />', () => {
  let wrapper: ShallowWrapper;

  beforeEach(() => {
    const ScrollToTop = createScrollToTop();

    wrapper = shallow(<ScrollToTop>Foobar</ScrollToTop>);
  });

  afterEach(() => wrapper.unmount());

  it('just renders children', () => expect(wrapper.text()).toEqual('Foobar'));
});
