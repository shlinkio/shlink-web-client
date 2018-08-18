import Storage from './Storage';
import PropTypes from 'prop-types';
import { range } from 'ramda';

const { floor, random } = Math;
const letters = '0123456789ABCDEF';
const buildRandomColor = () =>
  `#${
    range(0, 6)
      .map(() => letters[floor(random() * 16)])
      .join('')
  }`;

export class ColorGenerator {
  constructor(storage) {
    this.storage = storage;
    this.colors = this.storage.get('colors') || {};

    this.getColorForKey = this.getColorForKey.bind(this);
    this.setColorForKey = this.setColorForKey.bind(this);
  }

  getColorForKey = key => {
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

export default new ColorGenerator(Storage);
