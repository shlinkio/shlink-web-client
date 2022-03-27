import { shallow } from 'enzyme';
import { ShortUrlFormCheckboxGroup } from '../../../src/short-urls/helpers/ShortUrlFormCheckboxGroup';
import Checkbox from '../../../src/utils/Checkbox';
import { InfoTooltip } from '../../../src/utils/InfoTooltip';

describe('<ShortUrlFormCheckboxGroup />', () => {
  it.each([
    [undefined, '', 0],
    ['This is the tooltip', 'me-2', 1],
  ])('renders tooltip only when provided', (infoTooltip, expectedClassName, expectedAmountOfTooltips) => {
    const wrapper = shallow(<ShortUrlFormCheckboxGroup infoTooltip={infoTooltip} />);
    const checkbox = wrapper.find(Checkbox);

    expect(checkbox.prop('className')).toEqual(expectedClassName);
    expect(wrapper.find(InfoTooltip)).toHaveLength(expectedAmountOfTooltips);
  });
});
