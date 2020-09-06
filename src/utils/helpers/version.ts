import { compare } from 'compare-versions';
import { identity, memoizeWith } from 'ramda';
import { Empty, hasValue } from '../utils';

export interface Versions {
  maxVersion?: string;
  minVersion?: string;
}

export const versionMatch = (versionToMatch: string | Empty, { maxVersion, minVersion }: Versions): boolean => {
  if (!hasValue(versionToMatch)) {
    return false;
  }

  const matchesMinVersion = !minVersion || compare(versionToMatch, minVersion, '>=');
  const matchesMaxVersion = !maxVersion || compare(versionToMatch, maxVersion, '<=');

  return matchesMaxVersion && matchesMinVersion;
};

const versionIsValidSemVer = memoizeWith(identity, (version: string) => {
  try {
    return compare(version, version, '=');
  } catch (e) {
    return false;
  }
});

export const versionToPrintable = (version: string) => !versionIsValidSemVer(version) ? version : `v${version}`;

export const versionToSemVer = (defaultValue = 'latest') =>
  (version: string) => versionIsValidSemVer(version) ? version : defaultValue;
