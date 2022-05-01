import { isReachableServer, SelectedServer } from '../../servers/data';
import { SemVerPattern, versionMatch } from './version';

const serverMatchesMinVersion = (minVersion: SemVerPattern) => (selectedServer: SelectedServer): boolean =>
  isReachableServer(selectedServer) && versionMatch(selectedServer.version, { minVersion });

export const supportsShortUrlTitle = serverMatchesMinVersion('2.6.0');
export const supportsBotVisits = serverMatchesMinVersion('2.7.0');
export const supportsCrawlableVisits = supportsBotVisits;
export const supportsQrErrorCorrection = serverMatchesMinVersion('2.8.0');
export const supportsDomainRedirects = supportsQrErrorCorrection;
export const supportsForwardQuery = serverMatchesMinVersion('2.9.0');
export const supportsDefaultDomainRedirectsEdition = serverMatchesMinVersion('2.10.0');
export const supportsNonOrphanVisits = serverMatchesMinVersion('3.0.0');
export const supportsAllTagsFiltering = supportsNonOrphanVisits;
export const supportsDomainVisits = serverMatchesMinVersion('3.1.0');
