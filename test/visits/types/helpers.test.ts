import { Mock } from 'ts-mockery';
import { GroupedNewVisits, groupNewVisitsByType } from '../../../src/visits/types/helpers';
import { CreateVisit, OrphanVisit, Visit } from '../../../src/visits/types';

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
          [ ...orphanVisits, ...regularVisits ],
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

        return [ orphanVisits, { orphanVisits, regularVisits: [] }];
      })(),
      ((): [CreateVisit[], GroupedNewVisits] => {
        const regularVisits: CreateVisit[] = [
          Mock.of<CreateVisit>({ visit: Mock.all<Visit>() }),
          Mock.of<CreateVisit>({ visit: Mock.all<Visit>() }),
          Mock.of<CreateVisit>({ visit: Mock.all<Visit>() }),
        ];

        return [ regularVisits, { orphanVisits: [], regularVisits }];
      })(),
    ])('groups new visits as expected', (createdVisits, expectedResult) => {
      expect(groupNewVisitsByType(createdVisits)).toEqual(expectedResult);
    });
  });
});
