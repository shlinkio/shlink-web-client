import { Mock } from 'ts-mockery';
import { ColorGenerator } from '../../../../src/utils/services/ColorGenerator';

export const colorGeneratorMock = Mock.of<ColorGenerator>({
  getColorForKey: vi.fn(() => 'red'),
  setColorForKey: vi.fn(),
  isColorLightForKey: vi.fn(() => false),
});
