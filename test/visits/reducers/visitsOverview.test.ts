import { Mock } from 'ts-mockery';
import reducer, {
  GET_OVERVIEW_START,
  GET_OVERVIEW_ERROR,
  GET_OVERVIEW,
  GetVisitsOverviewAction,
  VisitsOverview,
  loadVisitsOverview,
} from '../../../src/visits/reducers/visitsOverview';
import { CreateVisitsAction } from '../../../src/visits/reducers/visitCreation';
import ShlinkApiClient from '../../../src/utils/services/ShlinkApiClient';
import { ShlinkVisitsOverview } from '../../../src/utils/services/types';
import { ShlinkState } from '../../../src/container/types';

describe('visitsOverview', () => {
  describe('reducer', () => {
    const action = (type: string) =>
      Mock.of<GetVisitsOverviewAction>({ type }) as GetVisitsOverviewAction & CreateVisitsAction;
    const state = (payload: Partial<VisitsOverview> = {}) => Mock.of<VisitsOverview>(payload);

    it('returns loading on GET_OVERVIEW_START', () => {
      const { loading } = reducer(state({ loading: false, error: false }), action(GET_OVERVIEW_START));

      expect(loading).toEqual(true);
    });

    it('stops loading and returns error on GET_OVERVIEW_ERROR', () => {
      const { loading, error } = reducer(state({ loading: true, error: false }), action(GET_OVERVIEW_ERROR));

      expect(loading).toEqual(false);
      expect(error).toEqual(true);
    });

    it('return visits overview on GET_OVERVIEW', () => {
      const { loading, error, visitsCount } = reducer(
        state({ loading: true, error: false }),
        { type: GET_OVERVIEW, visitsCount: 100 } as unknown as GetVisitsOverviewAction & CreateVisitsAction,
      );

      expect(loading).toEqual(false);
      expect(error).toEqual(false);
      expect(visitsCount).toEqual(100);
    });
  });

  describe('loadVisitsOverview', () => {
    const buildApiClientMock = (returned: Promise<ShlinkVisitsOverview>) => Mock.of<ShlinkApiClient>({
      getVisitsOverview: jest.fn(async () => returned),
    });
    const dispatchMock = jest.fn();
    const getState = () => Mock.of<ShlinkState>();

    beforeEach(() => dispatchMock.mockReset());

    it('dispatches start and error when promise is rejected', async () => {
      const ShlinkApiClient = buildApiClientMock(Promise.reject());

      await loadVisitsOverview(() => ShlinkApiClient)()(dispatchMock, getState);

      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenNthCalledWith(1, { type: GET_OVERVIEW_START });
      expect(dispatchMock).toHaveBeenNthCalledWith(2, { type: GET_OVERVIEW_ERROR });
      expect(ShlinkApiClient.getVisitsOverview).toHaveBeenCalledTimes(1);
    });

    it('dispatches start and success when promise is resolved', async () => {
      const resolvedOverview = Mock.of<ShlinkVisitsOverview>({ visitsCount: 50 });
      const ShlinkApiClient = buildApiClientMock(Promise.resolve(resolvedOverview));

      await loadVisitsOverview(() => ShlinkApiClient)()(dispatchMock, getState);

      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenNthCalledWith(1, { type: GET_OVERVIEW_START });
      expect(dispatchMock).toHaveBeenNthCalledWith(2, { type: GET_OVERVIEW, visitsCount: 50 });
      expect(ShlinkApiClient.getVisitsOverview).toHaveBeenCalledTimes(1);
    });
  });
});
