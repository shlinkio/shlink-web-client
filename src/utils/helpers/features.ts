import { useMemo } from 'react';
import type { SelectedServer } from '../../servers/data';
import { isReachableServer } from '../../servers/data';
import { selectServer } from '../../servers/reducers/selectedServer';
import type { SemVerPattern } from './version';
import { versionMatch } from './version';

const matchesMinVersion = (minVersion: SemVerPattern) => (selectedServer: SelectedServer): boolean =>
  isReachableServer(selectedServer) && versionMatch(selectedServer.version, { minVersion });

export const supportedFeatures = {
  forwardQuery: matchesMinVersion('2.9.0'),
  nonRestCors: matchesMinVersion('2.9.0'),
  defaultDomainRedirectsEdition: matchesMinVersion('2.10.0'),
  nonOrphanVisits: matchesMinVersion('3.0.0'),
  allTagsFiltering: matchesMinVersion('3.0.0'),
  tagsStats: matchesMinVersion('3.0.0'),
  domainVisits: matchesMinVersion('3.1.0'),
  excludeBotsOnShortUrls: matchesMinVersion('3.4.0'),
  filterDisabledUrls: matchesMinVersion('3.4.0'),
  deviceLongUrls: matchesMinVersion('3.5.0'),
} as const satisfies Record<string, ReturnType<typeof matchesMinVersion>>;

Object.freeze(supportedFeatures);

type Features = keyof typeof supportedFeatures;

export const useFeature = (feature: Features, selectedServer: SelectedServer) => useMemo(
  () => supportedFeatures[feature](selectedServer),
  [feature, selectServer],
);
