import { versionMatch } from '../../../src/utils/helpers/version';

describe('version', () => {
  describe('versionMatch', () => {
    it.each([
      [ undefined, {}, false ],
      [ null, {}, false ],
      [ '', {}, false ],
      [[], {}, false ],
      [ '2.8.3', {}, true ],
      [ '2.8.3', { minVersion: '2.0.0' }, true ],
      [ '2.0.0', { minVersion: '2.0.0' }, true ],
      [ '1.8.0', { maxVersion: '1.8.0' }, true ],
      [ '1.7.1', { maxVersion: '1.8.0' }, true ],
      [ '1.7.3', { minVersion: '1.7.0', maxVersion: '1.8.0' }, true ],
      [ '1.8.3', { minVersion: '2.0.0' }, false ],
      [ '1.8.3', { maxVersion: '1.8.0' }, false ],
      [ '1.8.3', { minVersion: '1.7.0', maxVersion: '1.8.0' }, false ],
    ])('properly matches versions based on what is provided', (version, versionConstraints, expected) => {
      expect(versionMatch(version, versionConstraints)).toEqual(expected);
    });
  });
});
