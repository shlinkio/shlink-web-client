import { Mock } from 'ts-mockery';
import { ColorGenerator } from '../../../../src/utils/services/ColorGenerator';

export const colorGeneratorMock = Mock.of<ColorGenerator>({
  getColorForKey: jest.fn(() => 'red'),
  setColorForKey: jest.fn(),
  isColorLightForKey: jest.fn(() => false),
});
