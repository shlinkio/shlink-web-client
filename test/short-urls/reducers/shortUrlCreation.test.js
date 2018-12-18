import * as sinon from 'sinon';
import reducer, {
  CREATE_SHORT_URL_START,
  CREATE_SHORT_URL_ERROR,
  CREATE_SHORT_URL,
  RESET_CREATE_SHORT_URL,
  _createShortUrl,
  resetCreateShortUrl,
} from '../../../src/short-urls/reducers/shortUrlCreation';

describe('shortUrlCreationReducer', () => {
  describe('reducer', () => {
    it('returns loading on CREATE_SHORT_URL_START', () => {
      expect(reducer({}, { type: CREATE_SHORT_URL_START })).toEqual({
        saving: true,
        error: false,
      });
    });

    it('returns error on CREATE_SHORT_URL_ERROR', () => {
      expect(reducer({}, { type: CREATE_SHORT_URL_ERROR })).toEqual({
        saving: false,
        error: true,
      });
    });

    it('returns result on CREATE_SHORT_URL', () => {
      expect(reducer({}, { type: CREATE_SHORT_URL, result: 'foo' })).toEqual({
        saving: false,
        error: false,
        result: 'foo',
      });
    });

    it('returns default state on RESET_CREATE_SHORT_URL', () => {
      expect(reducer({}, { type: RESET_CREATE_SHORT_URL })).toEqual({
        result: null,
        saving: false,
        error: false,
      });
    });

    it('returns provided state on unknown action', () =>
      expect(reducer({}, { type: 'unknown' })).toEqual({}));
  });

  describe('resetCreateShortUrl', () => {
    it('returns proper action', () =>
      expect(resetCreateShortUrl()).toEqual({ type: RESET_CREATE_SHORT_URL }));
  });

  describe('createShortUrl', () => {
    const createApiClientMock = (result) => ({
      createShortUrl: sinon.fake.returns(result),
    });
    const dispatch = sinon.spy();
    const getState = () => ({});

    afterEach(() => dispatch.resetHistory());

    it('calls API on success', async () => {
      const expectedDispatchCalls = 2;
      const result = 'foo';
      const apiClientMock = createApiClientMock(Promise.resolve(result));
      const dispatchable = _createShortUrl(() => apiClientMock, {});

      await dispatchable(dispatch, getState);

      expect(apiClientMock.createShortUrl.callCount).toEqual(1);

      expect(dispatch.callCount).toEqual(expectedDispatchCalls);
      expect(dispatch.getCall(0).args).toEqual([{ type: CREATE_SHORT_URL_START }]);
      expect(dispatch.getCall(1).args).toEqual([{ type: CREATE_SHORT_URL, result }]);
    });

    it('throws on error', async () => {
      const expectedDispatchCalls = 2;
      const error = 'Error';
      const apiClientMock = createApiClientMock(Promise.reject(error));
      const dispatchable = _createShortUrl(() => apiClientMock, {});

      try {
        await dispatchable(dispatch, getState);
      } catch (e) {
        expect(e).toEqual(error);
      }

      expect(apiClientMock.createShortUrl.callCount).toEqual(1);

      expect(dispatch.callCount).toEqual(expectedDispatchCalls);
      expect(dispatch.getCall(0).args).toEqual([{ type: CREATE_SHORT_URL_START }]);
      expect(dispatch.getCall(1).args).toEqual([{ type: CREATE_SHORT_URL_ERROR }]);
    });
  });
});
