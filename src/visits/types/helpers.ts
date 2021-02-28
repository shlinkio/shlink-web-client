import { groupBy, pipe } from 'ramda';
import { Visit, OrphanVisit, CreateVisit } from './index';

export const isOrphanVisit = (visit: Visit): visit is OrphanVisit => visit.hasOwnProperty('visitedUrl');

export interface GroupedNewVisits {
  orphanVisits: CreateVisit[];
  regularVisits: CreateVisit[];
}

export const groupNewVisitsByType = pipe(
  groupBy((newVisit: CreateVisit) => isOrphanVisit(newVisit.visit) ? 'orphanVisits' : 'regularVisits'),
  // @ts-ignore-error Type declaration on groupBy is not correct. It can return undefined props
  (result): GroupedNewVisits => ({ orphanVisits: [], regularVisits: [], ...result }),
);
