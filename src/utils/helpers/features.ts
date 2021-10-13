import { isReachableServer, SelectedServer } from '../../servers/data';
import { versionMatch, Versions } from './version';

const serverMatchesVersions = (versions: Versions) => (selectedServer: SelectedServer): boolean =>
  isReachableServer(selectedServer) && versionMatch(selectedServer.version, versions);

export const supportsQrCodeSizeInQuery = serverMatchesVersions({ minVersion: '2.5.0' });

export const supportsShortUrlTitle = serverMatchesVersions({ minVersion: '2.6.0' });

export const supportsOrphanVisits = supportsShortUrlTitle;

export const supportsQrCodeMargin = supportsShortUrlTitle;

export const supportsTagsInPatch = supportsShortUrlTitle;

export const supportsBotVisits = serverMatchesVersions({ minVersion: '2.7.0' });

export const supportsCrawlableVisits = supportsBotVisits;

export const supportsQrErrorCorrection = serverMatchesVersions({ minVersion: '2.8.0' });

export const supportsDomainRedirects = supportsQrErrorCorrection;

export const supportsForwardQuery = serverMatchesVersions({ minVersion: '2.9.0' });
