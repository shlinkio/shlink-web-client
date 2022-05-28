import { shallow } from 'enzyme';
import { Route } from 'react-router-dom';
import { Settings as createSettings } from '../../src/settings/Settings';
import { NoMenuLayout } from '../../src/common/NoMenuLayout';
import { NavPillItem } from '../../src/utils/NavPills';

describe('<Settings />', () => {
  const Component = () => null;
  const Settings = createSettings(Component, Component, Component, Component, Component, Component);

  it('renders a no-menu layout with the expected settings sections', () => {
    const wrapper = shallow(<Settings />);
    const layout = wrapper.find(NoMenuLayout);
    const sections = wrapper.find(Route);

    expect(layout).toHaveLength(1);
    expect(sections).toHaveLength(4);
  });

  it('renders expected menu', () => {
    const wrapper = shallow(<Settings />);
    const items = wrapper.find(NavPillItem);

    expect(items).toHaveLength(3);
    expect(items.first().prop('to')).toEqual('general');
    expect(items.at(1).prop('to')).toEqual('short-urls');
    expect(items.last().prop('to')).toEqual('other-items');
  });
});
