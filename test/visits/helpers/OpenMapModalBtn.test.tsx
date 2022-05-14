import { shallow, ShallowWrapper } from 'enzyme';
import { Dropdown, DropdownItem, UncontrolledTooltip } from 'reactstrap';
import { Mock } from 'ts-mockery';
import OpenMapModalBtn from '../../../src/visits/helpers/OpenMapModalBtn';
import MapModal from '../../../src/visits/helpers/MapModal';
import { CityStats } from '../../../src/visits/types';

describe('<OpenMapModalBtn />', () => {
  let wrapper: ShallowWrapper;
  const title = 'Foo';
  const locations = [
    Mock.of<CityStats>({ cityName: 'foo', count: 30 }),
    Mock.of<CityStats>({ cityName: 'bar', count: 45 }),
  ];
  const createWrapper = (activeCities: string[] = []) => {
    wrapper = shallow(<OpenMapModalBtn modalTitle={title} locations={locations} activeCities={activeCities} />);

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());

  it('renders expected content', () => {
    const wrapper = createWrapper();
    const button = wrapper.find('.open-map-modal-btn__btn');
    const tooltip = wrapper.find(UncontrolledTooltip);
    const dropdown = wrapper.find(Dropdown);
    const modal = wrapper.find(MapModal);

    expect(button).toHaveLength(1);
    expect(tooltip).toHaveLength(1);
    expect(dropdown).toHaveLength(1);
    expect(modal).toHaveLength(1);
  });

  it('opens dropdown instead of modal when a list of active cities has been provided', () => {
    const wrapper = createWrapper(['bar']);

    wrapper.find('.open-map-modal-btn__btn').simulate('click');

    expect(wrapper.find(Dropdown).prop('isOpen')).toEqual(true);
    expect(wrapper.find(MapModal).prop('isOpen')).toEqual(false);
  });

  it('filters out non-active cities from list of locations', () => {
    const wrapper = createWrapper(['bar']);

    wrapper.find('.open-map-modal-btn__btn').simulate('click');
    wrapper.find(Dropdown).find(DropdownItem).at(1).simulate('click');

    const modal = wrapper.find(MapModal);

    expect(modal.prop('title')).toEqual(title);
    expect(modal.prop('locations')).toEqual([
      {
        cityName: 'bar',
        count: 45,
      },
    ]);
  });
});
