import { isReachableServer, SelectedServer } from '../../servers/data';
import { SemVerPattern, versionMatch } from './version';

const serverMatchesMinVersion = (minVersion: SemVerPattern) => (selectedServer: SelectedServer): boolean =>
  isReachableServer(selectedServer) && versionMatch(selectedServer.version, { minVersion });

export const supportsForwardQuery = serverMatchesMinVersion('2.9.0');
export const supportsNonRestCors = supportsForwardQuery;
export const supportsDefaultDomainRedirectsEdition = serverMatchesMinVersion('2.10.0');
export const supportsNonOrphanVisits = serverMatchesMinVersion('3.0.0');
export const supportsAllTagsFiltering = supportsNonOrphanVisits;
export const supportsDomainVisits = serverMatchesMinVersion('3.1.0');
export const supportsExcludeBotsOnShortUrls = serverMatchesMinVersion('3.4.0');
export const supportsFilterDisabledUrls = supportsExcludeBotsOnShortUrls;
