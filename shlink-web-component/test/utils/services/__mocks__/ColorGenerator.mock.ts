import { fromPartial } from '@total-typescript/shoehorn';
import type { ColorGenerator } from '../../../../src/utils/services/ColorGenerator';

export const colorGeneratorMock = fromPartial<ColorGenerator>({
  getColorForKey: vi.fn(() => 'red'),
  setColorForKey: vi.fn(),
  isColorLightForKey: vi.fn(() => false),
});
