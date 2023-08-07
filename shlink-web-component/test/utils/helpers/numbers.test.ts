import { roundTen } from '../../../src/utils/helpers/numbers';

describe('numbers', () => {
  describe('roundTen', () => {
    it('rounds provided number to the next multiple of ten', () => {
      const expectationsPairs = [
        [10, 10],
        [12, 20],
        [158, 160],
        [5, 10],
        [-42, -40],
      ];

      expect.assertions(expectationsPairs.length);
      expectationsPairs.forEach(([number, expected]) => {
        expect(roundTen(number)).toEqual(expected);
      });
    });
  });
});
