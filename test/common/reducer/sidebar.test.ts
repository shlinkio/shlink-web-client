import { sidebarNotPresent, sidebarPresent, sidebarReducer } from '../../../src/common/reducers/sidebar';

describe('sidebarReducer', () => {
  describe('reducer', () => {
    it.each([
      [sidebarPresent, { sidebarPresent: true }],
      [sidebarNotPresent, { sidebarPresent: false }],
    ])('returns expected on %s', (actionCreator, expected) => {
      expect(sidebarReducer(undefined, actionCreator())).toEqual(expected);
    });
  });
});
