import { Mock } from 'ts-mockery';
import { SemVer, versionMatch, Versions } from '../../../src/utils/helpers/version';
import { Empty } from '../../../src/utils/utils';

describe('version', () => {
  describe('versionMatch', () => {
    it.each([
      [undefined, Mock.all<Versions>(), false],
      [null, Mock.all<Versions>(), false],
      ['' as Empty, Mock.all<Versions>(), false],
      [[], Mock.all<Versions>(), false],
      ['2.8.3' as SemVer, Mock.all<Versions>(), true],
      ['2.8.3' as SemVer, Mock.of<Versions>({ minVersion: '2.0.0' }), true],
      ['2.0.0' as SemVer, Mock.of<Versions>({ minVersion: '2.0.0' }), true],
      ['1.8.0' as SemVer, Mock.of<Versions>({ maxVersion: '1.8.0' }), true],
      ['1.7.1' as SemVer, Mock.of<Versions>({ maxVersion: '1.8.0' }), true],
      ['1.7.3' as SemVer, Mock.of<Versions>({ minVersion: '1.7.0', maxVersion: '1.8.0' }), true],
      ['1.8.3' as SemVer, Mock.of<Versions>({ minVersion: '2.0.0' }), false],
      ['1.8.3' as SemVer, Mock.of<Versions>({ maxVersion: '1.8.0' }), false],
      ['1.8.3' as SemVer, Mock.of<Versions>({ minVersion: '1.7.0', maxVersion: '1.8.0' }), false],
    ])('properly matches versions based on what is provided', (version, versionConstraints, expected) => {
      expect(versionMatch(version, versionConstraints)).toEqual(expected);
    });
  });
});
