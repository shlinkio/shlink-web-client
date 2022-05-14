import { Mock } from 'ts-mockery';
import reducer, {
  DELETE_TAG_START,
  DELETE_TAG_ERROR,
  DELETE_TAG,
  TAG_DELETED,
  tagDeleted,
  deleteTag,
} from '../../../src/tags/reducers/tagDelete';
import ShlinkApiClient from '../../../src/api/services/ShlinkApiClient';
import { ShlinkState } from '../../../src/container/types';

describe('tagDeleteReducer', () => {
  describe('reducer', () => {
    it('returns loading on DELETE_TAG_START', () => {
      expect(reducer(undefined, { type: DELETE_TAG_START })).toEqual({
        deleting: true,
        error: false,
      });
    });

    it('returns error on DELETE_TAG_ERROR', () => {
      expect(reducer(undefined, { type: DELETE_TAG_ERROR })).toEqual({
        deleting: false,
        error: true,
      });
    });

    it('returns tag names on DELETE_TAG', () => {
      expect(reducer(undefined, { type: DELETE_TAG })).toEqual({
        deleting: false,
        error: false,
      });
    });
  });

  describe('tagDeleted', () => {
    it('returns action based on provided params', () =>
      expect(tagDeleted('foo')).toEqual({
        type: TAG_DELETED,
        tag: 'foo',
      }));
  });

  describe('deleteTag', () => {
    const createApiClientMock = (result: Promise<any>) => Mock.of<ShlinkApiClient>({
      deleteTags: jest.fn(async () => result),
    });
    const dispatch = jest.fn();
    const getState = () => Mock.all<ShlinkState>();

    afterEach(() => dispatch.mockReset());

    it('calls API on success', async () => {
      const tag = 'foo';
      const apiClientMock = createApiClientMock(Promise.resolve());
      const dispatchable = deleteTag(() => apiClientMock)(tag);

      await dispatchable(dispatch, getState);

      expect(apiClientMock.deleteTags).toHaveBeenCalledTimes(1);
      expect(apiClientMock.deleteTags).toHaveBeenNthCalledWith(1, [tag]);

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, { type: DELETE_TAG_START });
      expect(dispatch).toHaveBeenNthCalledWith(2, { type: DELETE_TAG });
    });

    it('throws on error', async () => {
      const error = 'Error';
      const tag = 'foo';
      const apiClientMock = createApiClientMock(Promise.reject(error));
      const dispatchable = deleteTag(() => apiClientMock)(tag);

      try {
        await dispatchable(dispatch, getState);
      } catch (e) {
        expect(e).toEqual(error);
      }

      expect(apiClientMock.deleteTags).toHaveBeenCalledTimes(1);
      expect(apiClientMock.deleteTags).toHaveBeenNthCalledWith(1, [tag]);

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, { type: DELETE_TAG_START });
      expect(dispatch).toHaveBeenNthCalledWith(2, { type: DELETE_TAG_ERROR });
    });
  });
});
