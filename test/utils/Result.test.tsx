import { shallow, ShallowWrapper } from 'enzyme';
import { Result, ResultProps, ResultType } from '../../src/utils/Result';
import { SimpleCard } from '../../src/utils/SimpleCard';

describe('<Result />', () => {
  let wrapper: ShallowWrapper;
  const createWrapper = (props: ResultProps) => {
    wrapper = shallow(<Result {...props} />);

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());

  it.each([
    ['success' as ResultType, 'bg-main text-white'],
    ['error' as ResultType, 'bg-danger text-white'],
    ['warning' as ResultType, 'bg-warning'],
  ])('renders expected classes based on type', (type, expectedClasses) => {
    const wrapper = createWrapper({ type });
    const innerCard = wrapper.find(SimpleCard);

    expect(innerCard.prop('className')).toEqual(`text-center ${expectedClasses}`);
  });

  it.each([
    [undefined],
    ['foo'],
    ['bar'],
  ])('renders provided classes in root element', (className) => {
    const wrapper = createWrapper({ type: 'success', className });

    expect(wrapper.prop('className')).toEqual(className);
  });

  it.each([{ small: true }, { small: false }])('renders small results properly', ({ small }) => {
    const wrapper = createWrapper({ type: 'success', small });
    const bigElement = wrapper.find('.col-md-10');
    const smallElement = wrapper.find('.col-12');
    const innerCard = wrapper.find(SimpleCard);

    expect(bigElement).toHaveLength(small ? 0 : 1);
    expect(smallElement).toHaveLength(small ? 1 : 0);
    expect(innerCard.prop('bodyClassName')).toEqual(small ? 'p-2' : '');
  });
});
