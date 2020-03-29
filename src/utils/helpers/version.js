import { compare } from 'compare-versions';
import { identity, memoizeWith } from 'ramda';
import { hasValue } from '../utils';

export const versionMatch = (versionToMatch, { maxVersion, minVersion }) => {
  if (!hasValue(versionToMatch)) {
    return false;
  }

  const matchesMinVersion = !minVersion || compare(versionToMatch, minVersion, '>=');
  const matchesMaxVersion = !maxVersion || compare(versionToMatch, maxVersion, '<=');

  return !!(matchesMaxVersion && matchesMinVersion);
};

const versionIsValidSemVer = memoizeWith(identity, (version) => {
  try {
    return compare(version, version, '=');
  } catch (e) {
    return false;
  }
});

export const versionToPrintable = (version) => !versionIsValidSemVer(version) ? version : `v${version}`;

export const versionToSemVer = (defaultValue = 'latest') =>
  (version) => versionIsValidSemVer(version) ? version : defaultValue;
