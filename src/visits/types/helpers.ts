import { countBy, filter, groupBy, pipe, prop } from 'ramda';
import { normalizeVisits } from '../services/VisitsParser';
import {
  Visit,
  OrphanVisit,
  CreateVisit,
  NormalizedVisit,
  NormalizedOrphanVisit,
  Stats,
  OrphanVisitType,
} from './index';

export const isOrphanVisit = (visit: Visit): visit is OrphanVisit => visit.hasOwnProperty('visitedUrl');

export const isNormalizedOrphanVisit = (visit: NormalizedVisit): visit is NormalizedOrphanVisit =>
  visit.hasOwnProperty('visitedUrl');

export interface GroupedNewVisits {
  orphanVisits: CreateVisit[];
  regularVisits: CreateVisit[];
}

export const groupNewVisitsByType = pipe(
  groupBy((newVisit: CreateVisit) => isOrphanVisit(newVisit.visit) ? 'orphanVisits' : 'regularVisits'),
  // @ts-expect-error Type declaration on groupBy is not correct. It can return undefined props
  (result): GroupedNewVisits => ({ orphanVisits: [], regularVisits: [], ...result }),
);

export type HighlightableProps<T extends NormalizedVisit> = T extends NormalizedOrphanVisit
  ? ('referer' | 'country' | 'city' | 'visitedUrl')
  : ('referer' | 'country' | 'city');

export const highlightedVisitsToStats = <T extends NormalizedVisit>(
  highlightedVisits: T[],
  property: HighlightableProps<T>,
): Stats => countBy(prop(property) as any, highlightedVisits);

export const normalizeAndFilterVisits = (visits: Visit[], type: OrphanVisitType | undefined) => pipe(
  normalizeVisits,
  filter((normalizedVisit) => type === undefined || (normalizedVisit as NormalizedOrphanVisit).type === type),
)(visits);
