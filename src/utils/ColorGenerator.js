import { range } from 'ramda';
import PropTypes from 'prop-types';

const HEX_COLOR_LENGTH = 6;
const { floor, random } = Math;
const letters = '0123456789ABCDEF';
const buildRandomColor = () =>
  `#${
    range(0, HEX_COLOR_LENGTH)
      .map(() => letters[floor(random() * letters.length)])
      .join('')
  }`;
const normalizeKey = (key) => key.toLowerCase().trim();

export default class ColorGenerator {
  constructor(storage) {
    this.storage = storage;
    this.colors = this.storage.get('colors') || {};
  }

  getColorForKey = (key) => {
    const normalizedKey = normalizeKey(key);
    const color = this.colors[normalizedKey];

    // If a color has not been set yet, generate a random one and save it
    if (!color) {
      return this.setColorForKey(normalizedKey, buildRandomColor());
    }

    return color;
  };

  setColorForKey = (key, color) => {
    const normalizedKey = normalizeKey(key);

    this.colors[normalizedKey] = color;
    this.storage.set('colors', this.colors);

    return color;
  }
}

export const colorGeneratorType = PropTypes.shape({
  getColorForKey: PropTypes.func,
  setColorForKey: PropTypes.func,
});
