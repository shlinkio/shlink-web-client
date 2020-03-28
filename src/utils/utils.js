import L from 'leaflet';
import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import marker from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { range } from 'ramda';

const TEN_ROUNDING_NUMBER = 10;
const DEFAULT_TIMEOUT_DELAY = 2000;
const { ceil } = Math;

export const stateFlagTimeout = (setTimeout) => (
  setState,
  flagName,
  initialValue = true,
  delay = DEFAULT_TIMEOUT_DELAY
) => {
  setState({ [flagName]: initialValue });
  setTimeout(() => setState({ [flagName]: !initialValue }), delay);
};

export const determineOrderDir = (clickedField, currentOrderField, currentOrderDir) => {
  if (currentOrderField !== clickedField) {
    return 'ASC';
  }

  const newOrderMap = {
    ASC: 'DESC',
    DESC: undefined,
  };

  return currentOrderDir ? newOrderMap[currentOrderDir] : 'ASC';
};

export const fixLeafletIcons = () => {
  delete L.Icon.Default.prototype._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: marker2x,
    iconUrl: marker,
    shadowUrl: markerShadow,
  });
};

export const rangeOf = (size, mappingFn, startAt = 1) => range(startAt, size + 1).map(mappingFn);

export const roundTen = (number) => ceil(number / TEN_ROUNDING_NUMBER) * TEN_ROUNDING_NUMBER;

