import { rangeOf } from '../utils';
import LocalStorage from './LocalStorage';

const HEX_COLOR_LENGTH = 6;
const { floor, random, sqrt, round } = Math;
const letters = '0123456789ABCDEF';
const buildRandomColor = () => `#${rangeOf(HEX_COLOR_LENGTH, () => letters[floor(random() * letters.length)]).join('')}`;
const normalizeKey = (key: string) => key.toLowerCase().trim();
const hexColorToRgbArray = (colorHex: string): number[] =>
  (colorHex.match(/../g) ?? []).map((hex) => parseInt(hex, 16) || 0);
// HSP by Darel Rex Finley https://alienryderflex.com/hsp.html
const perceivedLightness = (r = 0, g = 0, b = 0) => round(sqrt(0.299 * r ** 2 + 0.587 * g ** 2 + 0.114 * b ** 2));

export default class ColorGenerator {
  private readonly colors: Record<string, string>;
  private readonly lights: Record<string, boolean>;

  public constructor(private readonly storage: LocalStorage) {
    this.colors = this.storage.get<Record<string, string>>('colors') ?? {};
    this.lights = {};
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

  public readonly isColorLightForKey = (key: string): boolean => {
    const colorHex = this.getColorForKey(key).substring(1);

    if (!this.lights[colorHex]) {
      const rgb = hexColorToRgbArray(colorHex);

      this.lights[colorHex] = perceivedLightness(...rgb) >= 128;
    }

    return this.lights[colorHex];
  };
}
