import L from 'leaflet';
import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import marker from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

export const fixLeafletIcons = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl; // eslint-disable-line no-underscore-dangle

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: marker2x,
    iconUrl: marker,
    shadowUrl: markerShadow,
  });
};
