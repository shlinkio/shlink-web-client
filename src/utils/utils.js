import L from 'leaflet';
import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import marker from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { range } from 'ramda';
import { useState } from 'react';
import { compare } from 'compare-versions';

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

export const useToggle = (initialValue = false) => {
  const [ flag, setFlag ] = useState(initialValue);

  return [ flag, () => setFlag(!flag) ];
};

export const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export const compareVersions = (firstVersion, operator, secondVersion) => compare(
  firstVersion,
  secondVersion,
  operator
);

export const versionIsValidSemVer = (version) => {
  try {
    return compareVersions(version, '=', version);
  } catch (e) {
    return false;
  }
};

export const formatDate = (format = 'YYYY-MM-DD') => (date) => date && date.format ? date.format(format) : date;

export const formatIsoDate = (date) => date && date.format ? date.format() : date;
