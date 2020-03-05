import { compare } from 'compare-versions';
import { identity, memoizeWith } from 'ramda';

export const compareVersions = (firstVersion, operator, secondVersion) => compare(
  firstVersion,
  secondVersion,
  operator,
);

const versionIsValidSemVer = memoizeWith(identity, (version) => {
  try {
    return compareVersions(version, '=', version);
  } catch (e) {
    return false;
  }
});

export const versionToPrintable = (version) => !versionIsValidSemVer(version) ? version : `v${version}`;

export const versionToSemVer = (defaultValue = 'latest') =>
  (version) => versionIsValidSemVer(version) ? version : defaultValue;
