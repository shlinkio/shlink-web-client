import L from 'leaflet';
import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import marker from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { isEmpty, isNil, range } from 'ramda';

const DEFAULT_TIMEOUT_DELAY = 2000;

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

export const hasValue = (value) => !isNil(value) && !isEmpty(value);
