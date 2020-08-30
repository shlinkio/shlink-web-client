import L from 'leaflet';
import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import marker from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { fixLeafletIcons } from '../../../src/utils/helpers/leaflet';

describe('leaflet', () => {
  describe('fixLeafletIcons', () => {
    it('updates icons used by leaflet', () => {
      fixLeafletIcons();

      const { iconRetinaUrl, iconUrl, shadowUrl } = L.Icon.Default.prototype.options;

      expect(iconRetinaUrl).toEqual(marker2x);
      expect(iconUrl).toEqual(marker);
      expect(shadowUrl).toEqual(markerShadow);
    });
  });
});
