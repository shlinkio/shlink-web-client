import type { ShlinkVisitsParams } from '@shlinkio/shlink-web-component/api-contract';
import { countBy, groupBy, pipe, prop } from 'ramda';
import { formatIsoDate } from '../../utils/dates/helpers/date';
import type { CreateVisit, NormalizedOrphanVisit, NormalizedVisit, OrphanVisit, Stats, Visit, VisitsParams } from './index';

export const isOrphanVisit = (visit: Visit): visit is OrphanVisit => (visit as OrphanVisit).visitedUrl !== undefined;

export const isNormalizedOrphanVisit = (visit: NormalizedVisit): visit is NormalizedOrphanVisit =>
  (visit as NormalizedOrphanVisit).visitedUrl !== undefined;

export interface GroupedNewVisits {
  orphanVisits: CreateVisit[];
  nonOrphanVisits: CreateVisit[];
}

export const groupNewVisitsByType = pipe(
  groupBy((newVisit: CreateVisit) => (isOrphanVisit(newVisit.visit) ? 'orphanVisits' : 'nonOrphanVisits')),
  // @ts-expect-error Type declaration on groupBy is not correct. It can return undefined props
  (result): GroupedNewVisits => ({ orphanVisits: [], nonOrphanVisits: [], ...result }),
);

export type HighlightableProps<T extends NormalizedVisit> = T extends NormalizedOrphanVisit
  ? ('referer' | 'country' | 'city' | 'visitedUrl')
  : ('referer' | 'country' | 'city');

export const highlightedVisitsToStats = <T extends NormalizedVisit>(
  highlightedVisits: T[],
  property: HighlightableProps<T>,
): Stats => countBy(prop(property) as any, highlightedVisits);

export const toApiParams = ({ page, itemsPerPage, filter, dateRange }: VisitsParams): ShlinkVisitsParams => {
  const startDate = (dateRange?.startDate && formatIsoDate(dateRange?.startDate)) ?? undefined;
  const endDate = (dateRange?.endDate && formatIsoDate(dateRange?.endDate)) ?? undefined;
  const excludeBots = filter?.excludeBots || undefined;

  return { page, itemsPerPage, startDate, endDate, excludeBots };
};
