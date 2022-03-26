import { shallow, ShallowWrapper } from 'enzyme';
import { Marker, Popup } from 'react-leaflet';
import { Modal } from 'reactstrap';
import MapModal from '../../../src/visits/helpers/MapModal';
import { CityStats } from '../../../src/visits/types';

describe('<MapModal />', () => {
  let wrapper: ShallowWrapper;
  const toggle = () => '';
  const isOpen = true;
  const title = 'Foobar';
  const zaragozaLat = 41.6563497;
  const zaragozaLong = -0.876566;
  const newYorkLat = 40.730610;
  const newYorkLong = -73.935242;
  const locations: CityStats[] = [
    {
      cityName: 'Zaragoza',
      count: 54,
      latLong: [zaragozaLat, zaragozaLong],
    },
    {
      cityName: 'New York',
      count: 7,
      latLong: [newYorkLat, newYorkLong],
    },
  ];

  beforeEach(() => {
    wrapper = shallow(<MapModal toggle={toggle} isOpen={isOpen} title={title} locations={locations} />);
  });

  afterEach(() => wrapper.unmount());

  it('renders modal with provided props', () => {
    const modal = wrapper.find(Modal);
    const header = wrapper.find('.map-modal__modal-title');

    expect(modal.prop('toggle')).toEqual(toggle);
    expect(modal.prop('isOpen')).toEqual(isOpen);
    expect(header.find('.btn-close').prop('onClick')).toEqual(toggle);
    expect(header.text()).toContain(title);
  });

  it('renders open street map tile', () => {
    expect(wrapper.find('OpenStreetMapTile')).toHaveLength(1);
  });

  it('renders proper amount of markers', () => {
    const markers = wrapper.find(Marker);

    expect(markers).toHaveLength(locations.length);
    locations.forEach(({ latLong, count, cityName }, index) => {
      const marker = markers.at(index);
      const popup = marker.find(Popup);

      expect(marker.prop('position')).toEqual(latLong);
      expect(popup.text()).toEqual(`${count} visits from ${cityName}`);
    });
  });
});
