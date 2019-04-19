import reducer, {
  getShortUrlVisits,
  cancelGetShortUrlVisits,
  GET_SHORT_URL_VISITS_START,
  GET_SHORT_URL_VISITS_ERROR,
  GET_SHORT_URL_VISITS,
  GET_SHORT_URL_VISITS_LARGE,
  GET_SHORT_URL_VISITS_CANCEL,
} from '../../../src/visits/reducers/shortUrlVisits';

describe('shortUrlVisitsReducer', () => {
  describe('reducer', () => {
    it('returns loading on GET_SHORT_URL_VISITS_START', () => {
      const state = reducer({ loading: false }, { type: GET_SHORT_URL_VISITS_START });
      const { loading } = state;

      expect(loading).toEqual(true);
    });

    it('returns loadingLarge on GET_SHORT_URL_VISITS_LARGE', () => {
      const state = reducer({ loadingLarge: false }, { type: GET_SHORT_URL_VISITS_LARGE });
      const { loadingLarge } = state;

      expect(loadingLarge).toEqual(true);
    });

    it('returns cancelLoad on GET_SHORT_URL_VISITS_CANCEL', () => {
      const state = reducer({ cancelLoad: false }, { type: GET_SHORT_URL_VISITS_CANCEL });
      const { cancelLoad } = state;

      expect(cancelLoad).toEqual(true);
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
  });

  describe('getShortUrlVisits', () => {
    const buildApiClientMock = (returned) => ({
      getShortUrlVisits: jest.fn(typeof returned === 'function' ? returned : () => returned),
    });
    const dispatchMock = jest.fn();
    const getState = () => ({
      shortUrlVisits: { cancelVisits: false },
    });

    beforeEach(() => dispatchMock.mockReset());

    it('dispatches start and error when promise is rejected', async () => {
      const ShlinkApiClient = buildApiClientMock(Promise.reject());

      await getShortUrlVisits(() => ShlinkApiClient)('abc123')(dispatchMock, getState);

      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenNthCalledWith(1, { type: GET_SHORT_URL_VISITS_START });
      expect(dispatchMock).toHaveBeenNthCalledWith(2, { type: GET_SHORT_URL_VISITS_ERROR });
      expect(ShlinkApiClient.getShortUrlVisits).toHaveBeenCalledTimes(1);
    });

    it('dispatches start and success when promise is resolved', async () => {
      const visits = [{}, {}];
      const ShlinkApiClient = buildApiClientMock(Promise.resolve({
        data: visits,
        pagination: {
          currentPage: 1,
          pagesCount: 1,
        },
      }));

      await getShortUrlVisits(() => ShlinkApiClient)('abc123')(dispatchMock, getState);

      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenNthCalledWith(1, { type: GET_SHORT_URL_VISITS_START });
      expect(dispatchMock).toHaveBeenNthCalledWith(2, { type: GET_SHORT_URL_VISITS, visits });
      expect(ShlinkApiClient.getShortUrlVisits).toHaveBeenCalledTimes(1);
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

      expect(ShlinkApiClient.getShortUrlVisits).toHaveBeenCalledTimes(expectedRequests);
      expect(dispatchMock).toHaveBeenNthCalledWith(2, expect.objectContaining({
        visits: [{}, {}, {}, {}, {}, {}],
      }));
    });
  });

  describe('cancelGetShortUrlVisits', () => {
    it('just returns the action with proper type', () =>
      expect(cancelGetShortUrlVisits()).toEqual({ type: GET_SHORT_URL_VISITS_CANCEL }));
  });
});
