import { sidebarNotPresent, sidebarPresent, sidebarReducer } from '../../../src/common/reducers/sidebar';

describe('sidebarReducer', () => {
  describe('reducer', () => {
    it.each([
      [sidebarPresent.toString(), { sidebarPresent: true }],
      [sidebarNotPresent.toString(), { sidebarPresent: false }],
    ])('returns expected on %s', (type, expected) => {
      expect(sidebarReducer(undefined, { type })).toEqual(expected);
    });
  });

  describe('sidebarPresent', () => {
    it('returns expected action', () => {
      expect(sidebarPresent()).toEqual({ type: sidebarPresent.toString() });
    });
  });

  describe('sidebarNotPresent', () => {
    it('returns expected action', () => {
      expect(sidebarNotPresent()).toEqual({ type: sidebarNotPresent.toString() });
    });
  });
});
