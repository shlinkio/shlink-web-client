import { Mock } from 'ts-mockery';
import { tagDeleted, tagDeleteReducerCreator } from '../../../src/tags/reducers/tagDelete';
import { ShlinkApiClient } from '../../../src/api/services/ShlinkApiClient';
import { ShlinkState } from '../../../src/container/types';

describe('tagDeleteReducer', () => {
  const deleteTagsCall = jest.fn();
  const buildShlinkApiClient = () => Mock.of<ShlinkApiClient>({ deleteTags: deleteTagsCall });
  const { reducer, deleteTag } = tagDeleteReducerCreator(buildShlinkApiClient);

  beforeEach(jest.clearAllMocks);

  describe('reducer', () => {
    it('returns loading on DELETE_TAG_START', () => {
      expect(reducer(undefined, { type: deleteTag.pending.toString() })).toEqual({
        deleting: true,
        deleted: false,
        error: false,
      });
    });

    it('returns error on DELETE_TAG_ERROR', () => {
      expect(reducer(undefined, { type: deleteTag.rejected.toString() })).toEqual({
        deleting: false,
        deleted: false,
        error: true,
      });
    });

    it('returns tag names on DELETE_TAG', () => {
      expect(reducer(undefined, { type: deleteTag.fulfilled.toString() })).toEqual({
        deleting: false,
        deleted: true,
        error: false,
      });
    });
  });

  describe('tagDeleted', () => {
    it('returns action based on provided params', () =>
      expect(tagDeleted('foo')).toEqual({
        type: tagDeleted.toString(),
        payload: 'foo',
      }));
  });

  describe('deleteTag', () => {
    const dispatch = jest.fn();
    const getState = () => Mock.all<ShlinkState>();

    it('calls API on success', async () => {
      const tag = 'foo';
      deleteTagsCall.mockResolvedValue(undefined);

      await deleteTag(tag)(dispatch, getState, {});

      expect(deleteTagsCall).toHaveBeenCalledTimes(1);
      expect(deleteTagsCall).toHaveBeenNthCalledWith(1, [tag]);

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, expect.objectContaining({ type: deleteTag.pending.toString() }));
      expect(dispatch).toHaveBeenNthCalledWith(2, expect.objectContaining({ type: deleteTag.fulfilled.toString() }));
    });

    it('throws on error', async () => {
      const error = 'Error';
      const tag = 'foo';
      deleteTagsCall.mockRejectedValue(error);

      try {
        await deleteTag(tag)(dispatch, getState, {});
      } catch (e) {
        expect(e).toEqual(error);
      }

      expect(deleteTagsCall).toHaveBeenCalledTimes(1);
      expect(deleteTagsCall).toHaveBeenNthCalledWith(1, [tag]);

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, expect.objectContaining({ type: deleteTag.pending.toString() }));
      expect(dispatch).toHaveBeenNthCalledWith(2, expect.objectContaining({ type: deleteTag.rejected.toString() }));
    });
  });
});
