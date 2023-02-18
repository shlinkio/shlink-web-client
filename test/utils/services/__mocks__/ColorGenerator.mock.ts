import { Mock } from 'ts-mockery';
import type { ColorGenerator } from '../../../../src/utils/services/ColorGenerator';

export const colorGeneratorMock = Mock.of<ColorGenerator>({
  getColorForKey: jest.fn(() => 'red'),
  setColorForKey: jest.fn(),
  isColorLightForKey: jest.fn(() => false),
});
