import { Mock } from 'ts-mockery';
import type {
  GetVisitsOverviewAction,
  VisitsOverview } from '../../../src/visits/reducers/visitsOverview';
import {
  loadVisitsOverview as loadVisitsOverviewCreator,
  visitsOverviewReducerCreator,
} from '../../../src/visits/reducers/visitsOverview';
import type { CreateVisitsAction } from '../../../src/visits/reducers/visitCreation';
import { createNewVisits } from '../../../src/visits/reducers/visitCreation';
import type { ShlinkApiClient } from '../../../src/api/services/ShlinkApiClient';
import type { ShlinkVisitsOverview } from '../../../src/api/types';
import type { ShlinkState } from '../../../src/container/types';
import type { CreateVisit, OrphanVisit, Visit } from '../../../src/visits/types';

describe('visitsOverviewReducer', () => {
  const getVisitsOverview = jest.fn();
  const buildApiClientMock = () => Mock.of<ShlinkApiClient>({ getVisitsOverview });
  const loadVisitsOverview = loadVisitsOverviewCreator(buildApiClientMock);
  const { reducer } = visitsOverviewReducerCreator(loadVisitsOverview);

  beforeEach(jest.clearAllMocks);

  describe('reducer', () => {
    const action = (type: string) =>
      Mock.of<GetVisitsOverviewAction>({ type }) as GetVisitsOverviewAction & CreateVisitsAction;
    const state = (payload: Partial<VisitsOverview> = {}) => Mock.of<VisitsOverview>(payload);

    it('returns loading on GET_OVERVIEW_START', () => {
      const { loading } = reducer(
        state({ loading: false, error: false }),
        action(loadVisitsOverview.pending.toString()),
      );

      expect(loading).toEqual(true);
    });

    it('stops loading and returns error on GET_OVERVIEW_ERROR', () => {
      const { loading, error } = reducer(
        state({ loading: true, error: false }),
        action(loadVisitsOverview.rejected.toString()),
      );

      expect(loading).toEqual(false);
      expect(error).toEqual(true);
    });

    it('return visits overview on GET_OVERVIEW', () => {
      const { loading, error, visitsCount } = reducer(state({ loading: true, error: false }), {
        type: loadVisitsOverview.fulfilled.toString(),
        payload: { visitsCount: 100 },
      });

      expect(loading).toEqual(false);
      expect(error).toEqual(false);
      expect(visitsCount).toEqual(100);
    });

    it.each([
      [50, 53],
      [0, 3],
      [undefined, 3],
    ])('returns updated amounts on CREATE_VISITS', (providedOrphanVisitsCount, expectedOrphanVisitsCount) => {
      const { visitsCount, orphanVisitsCount } = reducer(
        state({ visitsCount: 100, orphanVisitsCount: providedOrphanVisitsCount }),
        {
          type: createNewVisits.toString(),
          payload: {
            createdVisits: [
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
            ],
          },
        } as unknown as GetVisitsOverviewAction & CreateVisitsAction,
      );

      expect(visitsCount).toEqual(102);
      expect(orphanVisitsCount).toEqual(expectedOrphanVisitsCount);
    });
  });

  describe('loadVisitsOverview', () => {
    const dispatchMock = jest.fn();
    const getState = () => Mock.of<ShlinkState>();

    beforeEach(() => dispatchMock.mockReset());

    it('dispatches start and error when promise is rejected', async () => {
      getVisitsOverview.mockRejectedValue(undefined);

      await loadVisitsOverview()(dispatchMock, getState, {});

      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenNthCalledWith(1, expect.objectContaining({
        type: loadVisitsOverview.pending.toString(),
      }));
      expect(dispatchMock).toHaveBeenNthCalledWith(2, expect.objectContaining({
        type: loadVisitsOverview.rejected.toString(),
      }));
      expect(getVisitsOverview).toHaveBeenCalledTimes(1);
    });

    it('dispatches start and success when promise is resolved', async () => {
      const resolvedOverview = Mock.of<ShlinkVisitsOverview>({ visitsCount: 50 });
      getVisitsOverview.mockResolvedValue(resolvedOverview);

      await loadVisitsOverview()(dispatchMock, getState, {});

      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenNthCalledWith(1, expect.objectContaining({
        type: loadVisitsOverview.pending.toString(),
      }));
      expect(dispatchMock).toHaveBeenNthCalledWith(2, expect.objectContaining({
        type: loadVisitsOverview.fulfilled.toString(),
        payload: { visitsCount: 50 },
      }));
      expect(getVisitsOverview).toHaveBeenCalledTimes(1);
    });
  });
});
