import { groupBy, pipe } from 'ramda';
import { Visit, OrphanVisit, CreateVisit } from './index';

export const isOrphanVisit = (visit: Visit): visit is OrphanVisit => visit.hasOwnProperty('visitedUrl');

interface GroupedNewVisits {
  orphanVisits: CreateVisit[];
  regularVisits: CreateVisit[];
}

export const groupNewVisitsByType = pipe(
  groupBy((newVisit: CreateVisit) => isOrphanVisit(newVisit.visit) ? 'orphanVisits' : 'regularVisits'),
  (result): GroupedNewVisits => ({ orphanVisits: [], regularVisits: [], ...result }),
);
