import { Mock } from 'ts-mockery';
import reducer, {
  getTagVisits,
  cancelGetTagVisits,
  GET_TAG_VISITS_START,
  GET_TAG_VISITS_ERROR,
  GET_TAG_VISITS,
  GET_TAG_VISITS_LARGE,
  GET_TAG_VISITS_CANCEL,
  GET_TAG_VISITS_PROGRESS_CHANGED,
  TagVisits,
} from '../../../src/visits/reducers/tagVisits';
import { CREATE_VISITS } from '../../../src/visits/reducers/visitCreation';
import { rangeOf } from '../../../src/utils/utils';
import { Visit } from '../../../src/visits/types';
import { ShlinkVisits } from '../../../src/utils/services/types';
import ShlinkApiClient from '../../../src/utils/services/ShlinkApiClient';
import { ShlinkState } from '../../../src/container/types';

describe('tagVisitsReducer', () => {
  const visitsMocks = rangeOf(2, () => Mock.all<Visit>());

  describe('reducer', () => {
    const buildState = (data: Partial<TagVisits>) => Mock.of<TagVisits>(data);

    it('returns loading on GET_TAG_VISITS_START', () => {
      const state = reducer(buildState({ loading: false }), { type: GET_TAG_VISITS_START } as any);
      const { loading } = state;

      expect(loading).toEqual(true);
    });

    it('returns loadingLarge on GET_TAG_VISITS_LARGE', () => {
      const state = reducer(buildState({ loadingLarge: false }), { type: GET_TAG_VISITS_LARGE } as any);
      const { loadingLarge } = state;

      expect(loadingLarge).toEqual(true);
    });

    it('returns cancelLoad on GET_TAG_VISITS_CANCEL', () => {
      const state = reducer(buildState({ cancelLoad: false }), { type: GET_TAG_VISITS_CANCEL } as any);
      const { cancelLoad } = state;

      expect(cancelLoad).toEqual(true);
    });

    it('stops loading and returns error on GET_TAG_VISITS_ERROR', () => {
      const state = reducer(buildState({ loading: true, error: false }), { type: GET_TAG_VISITS_ERROR } as any);
      const { loading, error } = state;

      expect(loading).toEqual(false);
      expect(error).toEqual(true);
    });

    it('return visits on GET_TAG_VISITS', () => {
      const actionVisits = [{}, {}];
      const state = reducer(
        buildState({ loading: true, error: false }),
        { type: GET_TAG_VISITS, visits: actionVisits } as any,
      );
      const { loading, error, visits } = state;

      expect(loading).toEqual(false);
      expect(error).toEqual(false);
      expect(visits).toEqual(actionVisits);
    });

    it.each([
      [{ tag: 'foo' }, [ ...visitsMocks, {}]],
      [{ tag: 'bar' }, visitsMocks ],
    ])('appends a new visit on CREATE_VISIT', (state, expectedVisits) => {
      const shortUrl = {
        tags: [ 'foo', 'baz' ],
      };
      const prevState = buildState({
        ...state,
        visits: visitsMocks,
      });

      const { visits } = reducer(prevState, { type: CREATE_VISITS, createdVisits: [{ shortUrl, visit: {} }] } as any);

      expect(visits).toEqual(expectedVisits);
    });

    it('returns new progress on GET_TAG_VISITS_PROGRESS_CHANGED', () => {
      const state = reducer(undefined, { type: GET_TAG_VISITS_PROGRESS_CHANGED, progress: 85 } as any);

      expect(state).toEqual(expect.objectContaining({ progress: 85 }));
    });
  });

  describe('getTagVisits', () => {
    type GetVisitsReturn = Promise<ShlinkVisits> | ((shortCode: string, query: any) => Promise<ShlinkVisits>);

    const buildApiClientMock = (returned: GetVisitsReturn) => Mock.of<ShlinkApiClient>({
      getTagVisits: jest.fn(typeof returned === 'function' ? returned : async () => returned),
    });
    const dispatchMock = jest.fn();
    const getState = () => Mock.of<ShlinkState>({
      tagVisits: { cancelLoad: false },
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
      const visits = visitsMocks;
      const tag = 'foo';
      const ShlinkApiClient = buildApiClientMock(Promise.resolve({
        data: visitsMocks,
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
