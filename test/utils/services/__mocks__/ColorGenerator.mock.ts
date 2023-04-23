import { fromPartial } from '@total-typescript/shoehorn';
import type { ColorGenerator } from '../../../../src/utils/services/ColorGenerator';

export const colorGeneratorMock = fromPartial<ColorGenerator>({
  getColorForKey: jest.fn(() => 'red'),
  setColorForKey: jest.fn(),
  isColorLightForKey: jest.fn(() => false),
});
