import { fromPartial } from '@total-typescript/shoehorn';
import type { Empty, SemVer, Versions } from '../../../src/utils/helpers/version';
import { versionMatch } from '../../../src/utils/helpers/version';

describe('version', () => {
  describe('versionMatch', () => {
    it.each([
      [undefined, fromPartial<Versions>({}), false],
      [null, fromPartial<Versions>({}), false],
      ['' as Empty, fromPartial<Versions>({}), false],
      [[], fromPartial<Versions>({}), false],
      ['2.8.3' as SemVer, fromPartial<Versions>({}), true],
      ['2.8.3' as SemVer, fromPartial<Versions>({ minVersion: '2.0.0' }), true],
      ['2.0.0' as SemVer, fromPartial<Versions>({ minVersion: '2.0.0' }), true],
      ['1.8.0' as SemVer, fromPartial<Versions>({ maxVersion: '1.8.0' }), true],
      ['1.7.1' as SemVer, fromPartial<Versions>({ maxVersion: '1.8.0' }), true],
      ['1.7.3' as SemVer, fromPartial<Versions>({ minVersion: '1.7.0', maxVersion: '1.8.0' }), true],
      ['1.8.3' as SemVer, fromPartial<Versions>({ minVersion: '2.0.0' }), false],
      ['1.8.3' as SemVer, fromPartial<Versions>({ maxVersion: '1.8.0' }), false],
      ['1.8.3' as SemVer, fromPartial<Versions>({ minVersion: '1.7.0', maxVersion: '1.8.0' }), false],
    ])('properly matches versions based on what is provided', (version, versionConstraints, expected) => {
      expect(versionMatch(version, versionConstraints)).toEqual(expected);
    });
  });
});
