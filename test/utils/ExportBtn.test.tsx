import { shallow, ShallowWrapper } from 'enzyme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileDownload } from '@fortawesome/free-solid-svg-icons';
import { ExportBtn } from '../../src/utils/ExportBtn';

describe('<ExportBtn />', () => {
  let wrapper: ShallowWrapper;
  const onClick = jest.fn();
  const createWrapper = (className?: string, amount?: number) => {
    wrapper = shallow(<ExportBtn className={className} amount={amount} onClick={onClick} />);

    return wrapper;
  };

  afterEach(jest.clearAllMocks);
  afterEach(() => wrapper?.unmount());

  it.each([
    [ undefined ],
    [ 'foo' ],
    [ 'bar' ],
  ])('renders a button', (className) => {
    const wrapper = createWrapper(className);

    expect(wrapper.prop('outline')).toEqual(true);
    expect(wrapper.prop('color')).toEqual('primary');
    expect(wrapper.prop('onClick')).toEqual(onClick);
    expect(wrapper.prop('className')).toEqual(className);
  });

  it.each([
    [ undefined, '0' ],
    [ 10, '10' ],
    [ 10_000, '10,000' ],
    [ 10_000_000, '10,000,000' ],
  ])('renders expected amount', (amount, expectedRenderedAmount) => {
    const wrapper = createWrapper(undefined, amount);

    expect(wrapper.html()).toContain(`Export (${expectedRenderedAmount})`);
  });

  it('renders expected icon', () => {
    const wrapper = createWrapper();
    const icon = wrapper.find(FontAwesomeIcon);

    expect(icon).toHaveLength(1);
    expect(icon.prop('icon')).toEqual(faFileDownload);
  });

  it('invokes callback onClick', () => {
    const wrapper = createWrapper();

    expect(onClick).not.toHaveBeenCalled();
    wrapper.simulate('click');
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
