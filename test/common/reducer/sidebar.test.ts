import { Mock } from 'ts-mockery';
import reducer, {
  Sidebar,
  SIDEBAR_NOT_PRESENT,
  SIDEBAR_PRESENT,
  sidebarNotPresent,
  sidebarPresent,
} from '../../../src/common/reducers/sidebar';

describe('sidebarReducer', () => {
  describe('reducer', () => {
    it.each([
      [SIDEBAR_PRESENT, { sidebarPresent: true }],
      [SIDEBAR_NOT_PRESENT, { sidebarPresent: false }],
    ])('returns expected on %s', (type, expected) => {
      expect(reducer(Mock.all<Sidebar>(), { type })).toEqual(expected);
    });
  });

  describe('sidebarPresent', () => {
    it('returns expected action', () => {
      expect(sidebarPresent()).toEqual({ type: SIDEBAR_PRESENT });
    });
  });

  describe('sidebarNotPresent', () => {
    it('returns expected action', () => {
      expect(sidebarNotPresent()).toEqual({ type: SIDEBAR_NOT_PRESENT });
    });
  });
});
