import PropTypes from 'prop-types';
import { rangeOf } from '../utils';
import LocalStorage from './LocalStorage';

const HEX_COLOR_LENGTH = 6;
const { floor, random } = Math;
const letters = '0123456789ABCDEF';
const buildRandomColor = () => `#${rangeOf(HEX_COLOR_LENGTH, () => letters[floor(random() * letters.length)]).join('')}`;
const normalizeKey = (key: string) => key.toLowerCase().trim();

export default class ColorGenerator {
  private readonly colors: Record<string, string>;

  public constructor(private readonly storage: LocalStorage) {
    this.colors = this.storage.get<Record<string, string>>('colors') || {};
  }

  public readonly getColorForKey = (key: string) => {
    const normalizedKey = normalizeKey(key);
    const color = this.colors[normalizedKey];

    // If a color has not been set yet, generate a random one and save it
    if (!color) {
      return this.setColorForKey(normalizedKey, buildRandomColor());
    }

    return color;
  };

  public readonly setColorForKey = (key: string, color: string) => {
    const normalizedKey = normalizeKey(key);

    this.colors[normalizedKey] = color;
    this.storage.set('colors', this.colors);

    return color;
  };
}

/** @deprecated Use ColorGenerator class instead */
export const colorGeneratorType = PropTypes.shape({
  getColorForKey: PropTypes.func,
  setColorForKey: PropTypes.func,
});
