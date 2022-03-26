import { compare } from 'compare-versions';
import { identity, memoizeWith } from 'ramda';
import { Empty, hasValue } from '../utils';

type SemVerPatternFragment = `${bigint | '*'}`;

export type SemVerPattern = SemVerPatternFragment
| `${SemVerPatternFragment}.${SemVerPatternFragment}`
| `${SemVerPatternFragment}.${SemVerPatternFragment}.${SemVerPatternFragment}`;

export interface Versions {
  maxVersion?: SemVerPattern;
  minVersion?: SemVerPattern;
}

export type SemVer = `${bigint}.${bigint}.${bigint}` | 'latest';

export const versionMatch = (versionToMatch: SemVer | Empty, { maxVersion, minVersion }: Versions): boolean => {
  if (!hasValue(versionToMatch)) {
    return false;
  }

  const matchesMinVersion = !minVersion || compare(versionToMatch, minVersion, '>=');
  const matchesMaxVersion = !maxVersion || compare(versionToMatch, maxVersion, '<=');

  return matchesMaxVersion && matchesMinVersion;
};

const versionIsValidSemVer = memoizeWith(identity, (version: string): version is SemVer => {
  try {
    return compare(version, version, '=');
  } catch (e) {
    return false;
  }
});

export const versionToPrintable = (version: string) => (!versionIsValidSemVer(version) ? version : `v${version}`);

export const versionToSemVer = (defaultValue: SemVer = 'latest') =>
  (version: string): SemVer => (versionIsValidSemVer(version) ? version : defaultValue);
