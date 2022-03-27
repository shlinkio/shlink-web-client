import { Mock } from 'ts-mockery';
import { GroupedNewVisits, groupNewVisitsByType, toApiParams } from '../../../src/visits/types/helpers';
import { CreateVisit, OrphanVisit, Visit, VisitsParams } from '../../../src/visits/types';
import { ShlinkVisitsParams } from '../../../src/api/types';
import { formatIsoDate, parseDate } from '../../../src/utils/helpers/date';

describe('visitsTypeHelpers', () => {
  describe('groupNewVisitsByType', () => {
    it.each([
      [[], { orphanVisits: [], regularVisits: [] }],
      ((): [CreateVisit[], GroupedNewVisits] => {
        const orphanVisits: CreateVisit[] = [
          Mock.of<CreateVisit>({
            visit: Mock.of<OrphanVisit>({ visitedUrl: '' }),
          }),
          Mock.of<CreateVisit>({
            visit: Mock.of<OrphanVisit>({ visitedUrl: '' }),
          }),
        ];
        const regularVisits: CreateVisit[] = [
          Mock.of<CreateVisit>({ visit: Mock.all<Visit>() }),
          Mock.of<CreateVisit>({ visit: Mock.all<Visit>() }),
          Mock.of<CreateVisit>({ visit: Mock.all<Visit>() }),
          Mock.of<CreateVisit>({ visit: Mock.all<Visit>() }),
          Mock.of<CreateVisit>({ visit: Mock.all<Visit>() }),
        ];

        return [
          [...orphanVisits, ...regularVisits],
          { orphanVisits, regularVisits },
        ];
      })(),
      ((): [CreateVisit[], GroupedNewVisits] => {
        const orphanVisits: CreateVisit[] = [
          Mock.of<CreateVisit>({
            visit: Mock.of<OrphanVisit>({ visitedUrl: '' }),
          }),
          Mock.of<CreateVisit>({
            visit: Mock.of<OrphanVisit>({ visitedUrl: '' }),
          }),
          Mock.of<CreateVisit>({
            visit: Mock.of<OrphanVisit>({ visitedUrl: '' }),
          }),
        ];

        return [orphanVisits, { orphanVisits, regularVisits: [] }];
      })(),
      ((): [CreateVisit[], GroupedNewVisits] => {
        const regularVisits: CreateVisit[] = [
          Mock.of<CreateVisit>({ visit: Mock.all<Visit>() }),
          Mock.of<CreateVisit>({ visit: Mock.all<Visit>() }),
          Mock.of<CreateVisit>({ visit: Mock.all<Visit>() }),
        ];

        return [regularVisits, { orphanVisits: [], regularVisits }];
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
