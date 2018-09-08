import * as sinon from 'sinon';
import reducer, {
  _getShortUrlVisits,
  GET_SHORT_URL_VISITS_START,
  GET_SHORT_URL_VISITS_ERROR,
  GET_SHORT_URL_VISITS,
} from '../../../src/visits/reducers/shortUrlVisits';

describe('shortUrlVisitsReducer', () => {
  describe('reducer', () => {
    it('returns loading on GET_SHORT_URL_VISITS_START', () => {
      const state = reducer({ loading: false }, { type: GET_SHORT_URL_VISITS_START });
      const { loading } = state;

      expect(loading).toEqual(true);
    });

    it('stops loading and returns error on GET_SHORT_URL_VISITS_ERROR', () => {
      const state = reducer({ loading: true, error: false }, { type: GET_SHORT_URL_VISITS_ERROR });
      const { loading, error } = state;

      expect(loading).toEqual(false);
      expect(error).toEqual(true);
    });

    it('return visits on GET_SHORT_URL_VISITS', () => {
      const actionVisits = [{}, {}];
      const state = reducer({ loading: true, error: false }, { type: GET_SHORT_URL_VISITS, visits: actionVisits });
      const { loading, error, visits } = state;

      expect(loading).toEqual(false);
      expect(error).toEqual(false);
      expect(visits).toEqual(actionVisits);
    });

    it('returns default state on unknown action', () => {
      const defaultState = {
        visits: [],
        loading: false,
        error: false,
      };
      const state = reducer(defaultState, { type: 'unknown' });

      expect(state).toEqual(defaultState);
    });
  });

  describe('getShortUrlVisits', () => {
    const buildApiClientMock = (returned) => ({
      getShortUrlVisits: sinon.fake.returns(returned),
    });
    const dispatchMock = sinon.spy();

    beforeEach(() => dispatchMock.resetHistory());

    it('dispatches start and error when promise is rejected', async () => {
      const ShlinkApiClient = buildApiClientMock(Promise.reject());
      const expectedDispatchCalls = 2;

      await _getShortUrlVisits(ShlinkApiClient, 'abc123')(dispatchMock);

      const [ firstCallArg ] = dispatchMock.getCall(0).args;
      const { type: firstCallType } = firstCallArg;

      const [ secondCallArg ] = dispatchMock.getCall(1).args;
      const { type: secondCallType } = secondCallArg;

      expect(dispatchMock.callCount).toEqual(expectedDispatchCalls);
      expect(ShlinkApiClient.getShortUrlVisits.callCount).toEqual(1);
      expect(firstCallType).toEqual(GET_SHORT_URL_VISITS_START);
      expect(secondCallType).toEqual(GET_SHORT_URL_VISITS_ERROR);
    });

    it('dispatches start and success when promise is resolved', async () => {
      const resolvedVisits = [{}, {}];
      const ShlinkApiClient = buildApiClientMock(Promise.resolve(resolvedVisits));
      const expectedDispatchCalls = 2;

      await _getShortUrlVisits(ShlinkApiClient, 'abc123')(dispatchMock);

      const [ firstCallArg ] = dispatchMock.getCall(0).args;
      const { type: firstCallType } = firstCallArg;

      const [ secondCallArg ] = dispatchMock.getCall(1).args;
      const { type: secondCallType, visits } = secondCallArg;

      expect(dispatchMock.callCount).toEqual(expectedDispatchCalls);
      expect(ShlinkApiClient.getShortUrlVisits.callCount).toEqual(1);
      expect(firstCallType).toEqual(GET_SHORT_URL_VISITS_START);
      expect(secondCallType).toEqual(GET_SHORT_URL_VISITS);
      expect(visits).toEqual(resolvedVisits);
    });
  });
});
