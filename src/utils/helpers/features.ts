import { isReachableServer, SelectedServer } from '../../servers/data';
import { versionMatch, Versions } from './version';

const serverMatchesVersions = (versions: Versions) => (selectedServer: SelectedServer): boolean =>
  isReachableServer(selectedServer) && versionMatch(selectedServer.version, versions);

export const supportsSettingShortCodeLength = serverMatchesVersions({ minVersion: '2.1.0' });

export const supportsTagVisits = serverMatchesVersions({ minVersion: '2.2.0' });

export const supportsListingDomains = serverMatchesVersions({ minVersion: '2.4.0' });

export const supportsQrCodeSvgFormat = supportsListingDomains;

export const supportsValidateUrl = supportsListingDomains;

export const supportsQrCodeSizeInQuery = serverMatchesVersions({ minVersion: '2.5.0' });

export const supportsShortUrlTitle = serverMatchesVersions({ minVersion: '2.6.0' });

export const supportsOrphanVisits = supportsShortUrlTitle;

export const supportsQrCodeMargin = supportsShortUrlTitle;

export const supportsTagsInPatch = supportsShortUrlTitle;

export const supportsBotVisits = serverMatchesVersions({ minVersion: '2.7.0' });

export const supportsCrawlableVisits = supportsBotVisits;
