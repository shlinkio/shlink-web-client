import { fromPartial } from '@total-typescript/shoehorn';
import type { CreateVisit, OrphanVisit, VisitsParams } from '../../../shlink-web-component/visits/types';
import type { GroupedNewVisits } from '../../../shlink-web-component/visits/types/helpers';
import { groupNewVisitsByType, toApiParams } from '../../../shlink-web-component/visits/types/helpers';
import type { ShlinkVisitsParams } from '../../../src/api/types';
import { formatIsoDate, parseDate } from '../../../src/utils/helpers/date';

describe('visitsTypeHelpers', () => {
  describe('groupNewVisitsByType', () => {
    it.each([
      [[], { orphanVisits: [], nonOrphanVisits: [] }],
      ((): [CreateVisit[], GroupedNewVisits] => {
        const orphanVisits: CreateVisit[] = [
          fromPartial({ visit: fromPartial<OrphanVisit>({ visitedUrl: '' }) }),
          fromPartial({ visit: fromPartial<OrphanVisit>({ visitedUrl: '' }) }),
        ];
        const nonOrphanVisits: CreateVisit[] = [
          fromPartial({ visit: {} }),
          fromPartial({ visit: {} }),
          fromPartial({ visit: {} }),
          fromPartial({ visit: {} }),
          fromPartial({ visit: {} }),
        ];

        return [
          [...orphanVisits, ...nonOrphanVisits],
          { orphanVisits, nonOrphanVisits },
        ];
      })(),
      ((): [CreateVisit[], GroupedNewVisits] => {
        const orphanVisits: CreateVisit[] = [
          fromPartial({ visit: fromPartial<OrphanVisit>({ visitedUrl: '' }) }),
          fromPartial({ visit: fromPartial<OrphanVisit>({ visitedUrl: '' }) }),
          fromPartial({ visit: fromPartial<OrphanVisit>({ visitedUrl: '' }) }),
        ];

        return [orphanVisits, { orphanVisits, nonOrphanVisits: [] }];
      })(),
      ((): [CreateVisit[], GroupedNewVisits] => {
        const nonOrphanVisits: CreateVisit[] = [
          fromPartial({ visit: {} }),
          fromPartial({ visit: {} }),
          fromPartial({ visit: {} }),
        ];

        return [nonOrphanVisits, { orphanVisits: [], nonOrphanVisits }];
      })(),
    ])('groups new visits as expected', (createdVisits, expectedResult) => {
      expect(groupNewVisitsByType(createdVisits)).toEqual(expectedResult);
    });
  });

  describe('toApiParams', () => {
    it.each([
      [{ page: 5, itemsPerPage: 100 } as VisitsParams, { page: 5, itemsPerPage: 100 } as ShlinkVisitsParams],
      [
        {
          page: 1,
          itemsPerPage: 30,
          filter: { excludeBots: true },
        } as VisitsParams,
        { page: 1, itemsPerPage: 30, excludeBots: true } as ShlinkVisitsParams,
      ],
      (() => {
        const endDate = parseDate('2020-05-05', 'yyyy-MM-dd');

        return [
          {
            page: 20,
            itemsPerPage: 1,
            dateRange: { endDate },
          } as VisitsParams,
          { page: 20, itemsPerPage: 1, endDate: formatIsoDate(endDate) } as ShlinkVisitsParams,
        ];
      })(),
      (() => {
        const startDate = parseDate('2020-05-05', 'yyyy-MM-dd');
        const endDate = parseDate('2021-10-30', 'yyyy-MM-dd');

        return [
          {
            page: 20,
            itemsPerPage: 1,
            dateRange: { startDate, endDate },
            filter: { excludeBots: false },
          } as VisitsParams,
          {
            page: 20,
            itemsPerPage: 1,
            startDate: formatIsoDate(startDate),
            endDate: formatIsoDate(endDate),
          } as ShlinkVisitsParams,
        ];
      })(),
    ])('converts param as expected', (visitsParams, expectedResult) => {
      expect(toApiParams(visitsParams)).toEqual(expectedResult);
    });
  });
});
