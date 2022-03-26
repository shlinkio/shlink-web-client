import { shallow, ShallowWrapper } from 'enzyme';
import { ShlinkLogo, ShlinkLogoProps } from '../../../src/common/img/ShlinkLogo';
import { MAIN_COLOR } from '../../../src/utils/theme';

describe('<ShlinkLogo />', () => {
  let wrapper: ShallowWrapper;
  const createWrapper = (props: ShlinkLogoProps) => {
    wrapper = shallow(<ShlinkLogo {...props} />);

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());

  it.each([
    [undefined, MAIN_COLOR],
    ['red', 'red'],
    ['white', 'white'],
  ])('renders expected color', (color, expectedColor) => {
    const wrapper = createWrapper({ color });

    expect(wrapper.find('g').prop('fill')).toEqual(expectedColor);
  });

  it.each([
    [undefined, undefined],
    ['foo', 'foo'],
    ['bar', 'bar'],
  ])('renders expected class', (className, expectedClassName) => {
    const wrapper = createWrapper({ className });

    expect(wrapper.prop('className')).toEqual(expectedClassName);
  });
});
