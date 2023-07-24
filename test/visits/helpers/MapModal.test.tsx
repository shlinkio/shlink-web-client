import { render, screen } from '@testing-library/react';
import { MapModal } from '../../../shlink-web-component/visits/helpers/MapModal';
import type { CityStats } from '../../../shlink-web-component/visits/types';

describe('<MapModal />', () => {
  const toggle = vi.fn();
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

  it('renders expected map', () => {
    render(<MapModal toggle={toggle} isOpen title="Foobar" locations={locations} />);
    expect(screen.getByRole('dialog')).toMatchSnapshot();
  });
});
