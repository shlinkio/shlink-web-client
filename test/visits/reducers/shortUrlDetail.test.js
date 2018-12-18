import * as sinon from 'sinon';
import reducer, {
  getShortUrlDetail,
  GET_SHORT_URL_DETAIL_START,
  GET_SHORT_URL_DETAIL_ERROR,
  GET_SHORT_URL_DETAIL,
} from '../../../src/visits/reducers/shortUrlDetail';

describe('shortUrlDetailReducer', () => {
  describe('reducer', () => {
    it('returns loading on GET_SHORT_URL_DETAIL_START', () => {
      const state = reducer({ loading: false }, { type: GET_SHORT_URL_DETAIL_START });
      const { loading } = state;

      expect(loading).toEqual(true);
    });

    it('stops loading and returns error on GET_SHORT_URL_DETAIL_ERROR', () => {
      const state = reducer({ loading: true, error: false }, { type: GET_SHORT_URL_DETAIL_ERROR });
      const { loading, error } = state;

      expect(loading).toEqual(false);
      expect(error).toEqual(true);
    });

    it('return short URL on GET_SHORT_URL_DETAIL', () => {
      const actionShortUrl = { longUrl: 'foo', shortCode: 'bar' };
      const state = reducer({ loading: true, error: false }, { type: GET_SHORT_URL_DETAIL, shortUrl: actionShortUrl });
      const { loading, error, shortUrl } = state;

      expect(loading).toEqual(false);
      expect(error).toEqual(false);
      expect(shortUrl).toEqual(actionShortUrl);
    });

    it('returns default state on unknown action', () => {
      const defaultState = {
        shortUrl: {},
        loading: false,
        error: false,
      };
      const state = reducer(defaultState, { type: 'unknown' });

      expect(state).toEqual(defaultState);
    });
  });

  describe('getShortUrlDetail', () => {
    const buildApiClientMock = (returned) => ({
      getShortUrl: sinon.fake.returns(returned),
    });
    const dispatchMock = sinon.spy();
    const getState = () => ({});

    beforeEach(() => dispatchMock.resetHistory());

    it('dispatches start and error when promise is rejected', async () => {
      const ShlinkApiClient = buildApiClientMock(Promise.reject());
      const expectedDispatchCalls = 2;

      await getShortUrlDetail(() => ShlinkApiClient)('abc123')(dispatchMock, getState);

      const [ firstCallArg ] = dispatchMock.getCall(0).args;
      const { type: firstCallType } = firstCallArg;

      const [ secondCallArg ] = dispatchMock.getCall(1).args;
      const { type: secondCallType } = secondCallArg;

      expect(dispatchMock.callCount).toEqual(expectedDispatchCalls);
      expect(ShlinkApiClient.getShortUrl.callCount).toEqual(1);
      expect(firstCallType).toEqual(GET_SHORT_URL_DETAIL_START);
      expect(secondCallType).toEqual(GET_SHORT_URL_DETAIL_ERROR);
    });

    it('dispatches start and success when promise is resolved', async () => {
      const resolvedShortUrl = { longUrl: 'foo', shortCode: 'bar' };
      const ShlinkApiClient = buildApiClientMock(Promise.resolve(resolvedShortUrl));
      const expectedDispatchCalls = 2;

      await getShortUrlDetail(() => ShlinkApiClient)('abc123')(dispatchMock, getState);

      const [ firstCallArg ] = dispatchMock.getCall(0).args;
      const { type: firstCallType } = firstCallArg;

      const [ secondCallArg ] = dispatchMock.getCall(1).args;
      const { type: secondCallType, shortUrl } = secondCallArg;

      expect(dispatchMock.callCount).toEqual(expectedDispatchCalls);
      expect(ShlinkApiClient.getShortUrl.callCount).toEqual(1);
      expect(firstCallType).toEqual(GET_SHORT_URL_DETAIL_START);
      expect(secondCallType).toEqual(GET_SHORT_URL_DETAIL);
      expect(shortUrl).toEqual(resolvedShortUrl);
    });
  });
});
