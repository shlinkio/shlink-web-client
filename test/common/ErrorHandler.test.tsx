import { shallow, ShallowWrapper } from 'enzyme';
import { Button } from 'reactstrap';
import { Mock } from 'ts-mockery';
import createErrorHandler from '../../src/common/ErrorHandler';
import { SimpleCard } from '../../src/utils/SimpleCard';

describe('<ErrorHandler />', () => {
  const window = Mock.of<Window>({
    location: {
      reload: jest.fn(),
    },
  });
  const console = Mock.of<Console>({ error: jest.fn() });
  let wrapper: ShallowWrapper;

  beforeEach(() => {
    const ErrorHandler = createErrorHandler(window, console);

    wrapper = shallow(<ErrorHandler children={<span>Foo</span>} />);
  });

  afterEach(() => wrapper.unmount());

  it('renders children when no error has occurred', () => {
    expect(wrapper.text()).toEqual('Foo');
    expect(wrapper.find(Button)).toHaveLength(0);
  });

  it('renders error page when error has occurred', () => {
    wrapper.setState({ hasError: true });

    expect(wrapper.find(SimpleCard).contains('Oops! This is awkward :S')).toEqual(true);
    expect(wrapper.find(SimpleCard).contains(
      'It seems that something went wrong. Try refreshing the page or just click this button.',
    )).toEqual(true);
    expect(wrapper.find(Button)).toHaveLength(1);
  });
});
