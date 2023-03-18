import { Mock } from 'ts-mockery';
import type { ShlinkApiClient } from '../../../src/api/services/ShlinkApiClient';
import type { ShlinkVisitsOverview } from '../../../src/api/types';
import type { ShlinkState } from '../../../src/container/types';
import { createNewVisits } from '../../../src/visits/reducers/visitCreation';
import type {
  ParsedVisitsOverview,
  PartialVisitsSummary,
  VisitsOverview,
} from '../../../src/visits/reducers/visitsOverview';
import {
  loadVisitsOverview as loadVisitsOverviewCreator,
  visitsOverviewReducerCreator,
} from '../../../src/visits/reducers/visitsOverview';
import type { CreateVisit, OrphanVisit, Visit } from '../../../src/visits/types';

describe('visitsOverviewReducer', () => {
  const getVisitsOverview = jest.fn();
  const buildApiClientMock = () => Mock.of<ShlinkApiClient>({ getVisitsOverview });
  const loadVisitsOverview = loadVisitsOverviewCreator(buildApiClientMock);
  const { reducer } = visitsOverviewReducerCreator(loadVisitsOverview);

  beforeEach(jest.clearAllMocks);

  describe('reducer', () => {
    const state = (payload: Partial<VisitsOverview> = {}) => Mock.of<VisitsOverview>(payload);

    it('returns loading on GET_OVERVIEW_START', () => {
      const { loading } = reducer(
        state({ loading: false, error: false }),
        loadVisitsOverview.pending(''),
      );

      expect(loading).toEqual(true);
    });

    it('stops loading and returns error on GET_OVERVIEW_ERROR', () => {
      const { loading, error } = reducer(
        state({ loading: true, error: false }),
        loadVisitsOverview.rejected(null, ''),
      );

      expect(loading).toEqual(false);
      expect(error).toEqual(true);
    });

    it('return visits overview on GET_OVERVIEW', () => {
      const action = loadVisitsOverview.fulfilled(Mock.of<ParsedVisitsOverview>({
        nonOrphanVisits: { total: 100 },
      }), 'requestId');
      const { loading, error, nonOrphanVisits } = reducer(state({ loading: true, error: false }), action);

      expect(loading).toEqual(false);
      expect(error).toEqual(false);
      expect(nonOrphanVisits.total).toEqual(100);
    });

    it.each([
      [50, 53],
      [0, 3],
    ])('returns updated amounts on CREATE_VISITS', (providedOrphanVisitsCount, expectedOrphanVisitsCount) => {
      const { nonOrphanVisits, orphanVisits } = reducer(
        state({
          nonOrphanVisits: { total: 100 },
          orphanVisits: { total: providedOrphanVisitsCount },
        }),
        createNewVisits([
          Mock.of<CreateVisit>({ visit: Mock.all<Visit>() }),
          Mock.of<CreateVisit>({ visit: Mock.all<Visit>() }),
          Mock.of<CreateVisit>({
            visit: Mock.of<OrphanVisit>({ visitedUrl: '' }),
          }),
          Mock.of<CreateVisit>({
            visit: Mock.of<OrphanVisit>({ visitedUrl: '' }),
          }),
          Mock.of<CreateVisit>({
            visit: Mock.of<OrphanVisit>({ visitedUrl: '' }),
          }),
        ]),
      );

      expect(nonOrphanVisits.total).toEqual(102);
      expect(orphanVisits.total).toEqual(expectedOrphanVisitsCount);
    });

    it.each([
      [
        {} satisfies Omit<PartialVisitsSummary, 'total'>,
        {} satisfies Omit<PartialVisitsSummary, 'total'>,
        { total: 103 } satisfies PartialVisitsSummary,
        { total: 203 } satisfies PartialVisitsSummary,
      ],
      [
        { bots: 35 } satisfies Omit<PartialVisitsSummary, 'total'>,
        { bots: 35 } satisfies Omit<PartialVisitsSummary, 'total'>,
        { total: 103, bots: 37 } satisfies PartialVisitsSummary,
        { total: 203, bots: 36 } satisfies PartialVisitsSummary,
      ],
      [
        { nonBots: 41, bots: 85 } satisfies Omit<PartialVisitsSummary, 'total'>,
        { nonBots: 63, bots: 27 } satisfies Omit<PartialVisitsSummary, 'total'>,
        { total: 103, nonBots: 42, bots: 87 } satisfies PartialVisitsSummary,
        { total: 203, nonBots: 65, bots: 28 } satisfies PartialVisitsSummary,
      ],
      [
        { nonBots: 56 } satisfies Omit<PartialVisitsSummary, 'total'>,
        { nonBots: 99 } satisfies Omit<PartialVisitsSummary, 'total'>,
        { total: 103, nonBots: 57 } satisfies PartialVisitsSummary,
        { total: 203, nonBots: 101 } satisfies PartialVisitsSummary,
      ],
    ])('takes bots and non-bots into consideration when creating visits', (
      initialNonOrphanVisits,
      initialOrphanVisits,
      expectedNonOrphanVisits,
      expectedOrphanVisits,
    ) => {
      const { nonOrphanVisits, orphanVisits } = reducer(
        state({
          nonOrphanVisits: { total: 100, ...initialNonOrphanVisits },
          orphanVisits: { total: 200, ...initialOrphanVisits },
        }),
        createNewVisits([
          Mock.of<CreateVisit>({ visit: Mock.all<Visit>() }),
          Mock.of<CreateVisit>({ visit: Mock.of<Visit>({ potentialBot: true }) }),
          Mock.of<CreateVisit>({ visit: Mock.of<Visit>({ potentialBot: true }) }),
          Mock.of<CreateVisit>({
            visit: Mock.of<OrphanVisit>({ visitedUrl: '' }),
          }),
          Mock.of<CreateVisit>({
            visit: Mock.of<OrphanVisit>({ visitedUrl: '' }),
          }),
          Mock.of<CreateVisit>({
            visit: Mock.of<OrphanVisit>({ visitedUrl: '', potentialBot: true }),
          }),
        ]),
      );

      expect(nonOrphanVisits).toEqual(expectedNonOrphanVisits);
      expect(orphanVisits).toEqual(expectedOrphanVisits);
    });
  });

  describe('loadVisitsOverview', () => {
    const dispatchMock = jest.fn();
    const getState = () => Mock.of<ShlinkState>();

    it.each([
      [
        // Shlink <3.5.0
        { visitsCount: 50, orphanVisitsCount: 20 } satisfies ShlinkVisitsOverview,
        {
          nonOrphanVisits: { total: 50, nonBots: undefined, bots: undefined },
          orphanVisits: { total: 20, nonBots: undefined, bots: undefined },
        },
      ],
      [
        // Shlink >=3.5.0
        {
          nonOrphanVisits: { total: 50, nonBots: 20, bots: 30 },
          orphanVisits: { total: 50, nonBots: 20, bots: 30 },
          visitsCount: 3,
          orphanVisitsCount: 3,
        } satisfies ShlinkVisitsOverview,
        {
          nonOrphanVisits: { total: 50, nonBots: 20, bots: 30 },
          orphanVisits: { total: 50, nonBots: 20, bots: 30 },
        },
      ],
    ])('dispatches start and success when promise is resolved', async (serverResult, dispatchedPayload) => {
      const resolvedOverview = Mock.of<ShlinkVisitsOverview>(serverResult);
      getVisitsOverview.mockResolvedValue(resolvedOverview);

      await loadVisitsOverview()(dispatchMock, getState, {});

      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenNthCalledWith(2, expect.objectContaining({ payload: dispatchedPayload }));
      expect(getVisitsOverview).toHaveBeenCalledTimes(1);
    });
  });
});
