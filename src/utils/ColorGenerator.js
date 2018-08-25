import { range } from 'ramda';
import PropTypes from 'prop-types';
import storage from './Storage';

const HEX_COLOR_LENGTH = 6;
const { floor, random } = Math;
const letters = '0123456789ABCDEF';
const buildRandomColor = () =>
  `#${
    range(0, HEX_COLOR_LENGTH)
      .map(() => letters[floor(random() * letters.length)])
      .join('')
  }`;

export class ColorGenerator {
  constructor(storage) {
    this.storage = storage;
    this.colors = this.storage.get('colors') || {};
  }

  getColorForKey = (key) => {
    const color = this.colors[key];

    // If a color has not been set yet, generate a random one and save it
    if (!color) {
      this.setColorForKey(key, buildRandomColor());

      return this.getColorForKey(key);
    }

    return color;
  };

  setColorForKey = (key, color) => {
    this.colors[key] = color;
    this.storage.set('colors', this.colors);
  }
}

export const colorGeneratorType = PropTypes.shape({
  getColorForKey: PropTypes.func,
  setColorForKey: PropTypes.func,
});

const colorGenerator = new ColorGenerator(storage);

export default colorGenerator;
