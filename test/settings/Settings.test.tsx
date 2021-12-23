import { shallow } from 'enzyme';
import createSettings from '../../src/settings/Settings';
import NoMenuLayout from '../../src/common/NoMenuLayout';

describe('<Settings />', () => {
  const Component = () => null;
  const Settings = createSettings(Component, Component, Component, Component, Component);

  it('renders a no-menu layout with the expected settings sections', () => {
    const wrapper = shallow(<Settings />);
    const layout = wrapper.find(NoMenuLayout);
    const sections = wrapper.find('SettingsSections');

    expect(layout).toHaveLength(1);
    expect(sections).toHaveLength(1);
    expect((sections.prop('items') as any[]).flat()).toHaveLength(5);
  });
});
