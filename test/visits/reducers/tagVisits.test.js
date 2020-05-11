import reducer, {
  getTagVisits,
  cancelGetTagVisits,
  GET_TAG_VISITS_START,
  GET_TAG_VISITS_ERROR,
  GET_TAG_VISITS,
  GET_TAG_VISITS_LARGE,
  GET_TAG_VISITS_CANCEL,
  GET_TAG_VISITS_PROGRESS_CHANGED,
} from '../../../src/visits/reducers/tagVisits';
import { CREATE_VISIT } from '../../../src/visits/reducers/visitCreation';

describe('tagVisitsReducer', () => {
  describe('reducer', () => {
    it('returns loading on GET_TAG_VISITS_START', () => {
      const state = reducer({ loading: false }, { type: GET_TAG_VISITS_START });
      const { loading } = state;

      expect(loading).toEqual(true);
    });

    it('returns loadingLarge on GET_TAG_VISITS_LARGE', () => {
      const state = reducer({ loadingLarge: false }, { type: GET_TAG_VISITS_LARGE });
      const { loadingLarge } = state;

      expect(loadingLarge).toEqual(true);
    });

    it('returns cancelLoad on GET_TAG_VISITS_CANCEL', () => {
      const state = reducer({ cancelLoad: false }, { type: GET_TAG_VISITS_CANCEL });
      const { cancelLoad } = state;

      expect(cancelLoad).toEqual(true);
    });

    it('stops loading and returns error on GET_TAG_VISITS_ERROR', () => {
      const state = reducer({ loading: true, error: false }, { type: GET_TAG_VISITS_ERROR });
      const { loading, error } = state;

      expect(loading).toEqual(false);
      expect(error).toEqual(true);
    });

    it('return visits on GET_TAG_VISITS', () => {
      const actionVisits = [{}, {}];
      const state = reducer({ loading: true, error: false }, { type: GET_TAG_VISITS, visits: actionVisits });
      const { loading, error, visits } = state;

      expect(loading).toEqual(false);
      expect(error).toEqual(false);
      expect(visits).toEqual(actionVisits);
    });

    it.each([
      [{ tag: 'foo' }, [{}, {}, {}]],
      [{ tag: 'bar' }, [{}, {}]],
    ])('appends a new visit on CREATE_VISIT', (state, expectedVisits) => {
      const shortUrl = {
        tags: [ 'foo', 'baz' ],
      };
      const prevState = {
        ...state,
        visits: [{}, {}],
      };

      const { visits } = reducer(prevState, { type: CREATE_VISIT, shortUrl, visit: {} });

      expect(visits).toEqual(expectedVisits);
    });

    it('returns new progress on GET_TAG_VISITS_PROGRESS_CHANGED', () => {
      const state = reducer({}, { type: GET_TAG_VISITS_PROGRESS_CHANGED, progress: 85 });

      expect(state).toEqual({ progress: 85 });
    });
  });

  describe('getTagVisits', () => {
    const buildApiClientMock = (returned) => ({
      getTagVisits: jest.fn(typeof returned === 'function' ? returned : () => returned),
    });
    const dispatchMock = jest.fn();
    const getState = () => ({
      tagVisits: { cancelVisits: false },
    });

    beforeEach(jest.resetAllMocks);

    it('dispatches start and error when promise is rejected', async () => {
      const ShlinkApiClient = buildApiClientMock(Promise.reject());

      await getTagVisits(() => ShlinkApiClient)('foo')(dispatchMock, getState);

      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenNthCalledWith(1, { type: GET_TAG_VISITS_START });
      expect(dispatchMock).toHaveBeenNthCalledWith(2, { type: GET_TAG_VISITS_ERROR });
      expect(ShlinkApiClient.getTagVisits).toHaveBeenCalledTimes(1);
    });

    it.each([
      [ undefined ],
      [{}],
    ])('dispatches start and success when promise is resolved', async (query) => {
      const visits = [{}, {}];
      const tag = 'foo';
      const ShlinkApiClient = buildApiClientMock(Promise.resolve({
        data: visits,
        pagination: {
          currentPage: 1,
          pagesCount: 1,
        },
      }));

      await getTagVisits(() => ShlinkApiClient)(tag, query)(dispatchMock, getState);

      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenNthCalledWith(1, { type: GET_TAG_VISITS_START });
      expect(dispatchMock).toHaveBeenNthCalledWith(2, { type: GET_TAG_VISITS, visits, tag });
      expect(ShlinkApiClient.getTagVisits).toHaveBeenCalledTimes(1);
    });
  });

  describe('cancelGetTagVisits', () => {
    it('just returns the action with proper type', () =>
      expect(cancelGetTagVisits()).toEqual({ type: GET_TAG_VISITS_CANCEL }));
  });
});
