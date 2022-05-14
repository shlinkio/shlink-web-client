import { shallow, ShallowWrapper } from 'enzyme';
import { DateProps, Time } from '../../src/utils/Time';
import { parseDate } from '../../src/utils/helpers/date';

describe('<Time />', () => {
  let wrapper: ShallowWrapper;
  const createWrapper = (props: DateProps) => {
    wrapper = shallow(<Time {...props} />);

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());

  it.each([
    [{ date: parseDate('2020-05-05', 'yyyy-MM-dd') }, '1588636800000', '2020-05-05 00:00'],
    [{ date: parseDate('2021-03-20', 'yyyy-MM-dd'), format: 'dd/MM/yyyy' }, '1616198400000', '20/03/2021'],
  ])('includes expected dateTime and format', (props, expectedDateTime, expectedFormatted) => {
    const wrapper = createWrapper(props);

    expect(wrapper.prop('dateTime')).toEqual(expectedDateTime);
    expect(wrapper.prop('children')).toEqual(expectedFormatted);
  });

  it('renders relative times when requested', () => {
    const wrapper = createWrapper({ date: new Date(), relative: true });

    expect(wrapper.prop('children')).toContain(' ago');
  });
});
