import { memoizeWith } from '@shlinkio/data-manipulation';
import { compare } from 'compare-versions';

export type Empty = null | undefined | '' | never[];

const isEmpty = (value: Exclude<any, undefined | null>): boolean => (
  (Array.isArray(value) && value.length === 0)
  || (typeof value === 'string' && value === '')
  || (typeof value === 'object' && Object.keys(value).length === 0)
);

export const hasValue = <T>(value: T | Empty): value is T => value !== undefined && value !== null && !isEmpty(value);

type SemVerPatternFragment = `${bigint | '*'}`;

type SemVerPattern = SemVerPatternFragment
| `${SemVerPatternFragment}.${SemVerPatternFragment}`
| `${SemVerPatternFragment}.${SemVerPatternFragment}.${SemVerPatternFragment}`;

export type Versions = {
  maxVersion?: SemVerPattern;
  minVersion?: SemVerPattern;
};

export type SemVer = `${bigint}.${bigint}.${bigint}` | 'latest';

export const versionMatch = (versionToMatch: SemVer | Empty, { maxVersion, minVersion }: Versions): boolean => {
  if (!hasValue(versionToMatch)) {
    return false;
  }

  const matchesMinVersion = !minVersion || compare(versionToMatch, minVersion, '>=');
  const matchesMaxVersion = !maxVersion || compare(versionToMatch, maxVersion, '<=');

  return matchesMaxVersion && matchesMinVersion;
};

const versionIsValidSemVer = memoizeWith((v) => v, (version: string): version is SemVer => {
  try {
    return compare(version, version, '=');
  } catch {
    return false;
  }
});

export const versionToPrintable = (version: string) => (!versionIsValidSemVer(version) ? version : `v${version}`);

export const versionToSemVer = (version: string, fallback: SemVer = 'latest'): SemVer => (
  versionIsValidSemVer(version) ? version : fallback
);
