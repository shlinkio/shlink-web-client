import * as sinon from 'sinon';
import reducer, {
  getShortUrlVisits,
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
      getShortUrlVisits: typeof returned === 'function' ? sinon.fake(returned) : sinon.fake.returns(returned),
    });
    const dispatchMock = sinon.spy();
    const getState = () => ({});

    beforeEach(() => dispatchMock.resetHistory());

    it('dispatches start and error when promise is rejected', async () => {
      const ShlinkApiClient = buildApiClientMock(Promise.reject());
      const expectedDispatchCalls = 2;

      await getShortUrlVisits(() => ShlinkApiClient)('abc123')(dispatchMock, getState);

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
      const ShlinkApiClient = buildApiClientMock(Promise.resolve({
        data: resolvedVisits,
        pagination: {
          currentPage: 1,
          pagesCount: 1,
        },
      }));
      const expectedDispatchCalls = 2;

      await getShortUrlVisits(() => ShlinkApiClient)('abc123')(dispatchMock, getState);

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

    it('performs multiple API requests when response contains more pages', async () => {
      const expectedRequests = 3;
      const ShlinkApiClient = buildApiClientMock((shortCode, { page }) =>
        Promise.resolve({
          data: [{}, {}],
          pagination: {
            currentPage: page,
            pagesCount: expectedRequests,
          },
        }));

      await getShortUrlVisits(() => ShlinkApiClient)('abc123')(dispatchMock, getState);

      const [ secondCallArg ] = dispatchMock.getCall(1).args;
      const { visits } = secondCallArg;

      expect(ShlinkApiClient.getShortUrlVisits.callCount).toEqual(expectedRequests);
      expect(visits).toEqual([{}, {}, {}, {}, {}, {}]);
    });
  });
});
