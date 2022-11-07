import { Mock } from 'ts-mockery';
import { tagEdited, EditTagAction, tagEditReducerCreator } from '../../../src/tags/reducers/tagEdit';
import { ShlinkApiClient } from '../../../src/api/services/ShlinkApiClient';
import { ColorGenerator } from '../../../src/utils/services/ColorGenerator';
import { ShlinkState } from '../../../src/container/types';

describe('tagEditReducer', () => {
  const oldName = 'foo';
  const newName = 'bar';
  const color = '#ff0000';
  const editTagCall = jest.fn();
  const buildShlinkApiClient = () => Mock.of<ShlinkApiClient>({ editTag: editTagCall });
  const colorGenerator = Mock.of<ColorGenerator>({ setColorForKey: jest.fn() });
  const { reducer, editTag } = tagEditReducerCreator(buildShlinkApiClient, colorGenerator);

  describe('reducer', () => {
    it('returns loading on EDIT_TAG_START', () => {
      expect(reducer(undefined, Mock.of<EditTagAction>({ type: editTag.pending.toString() }))).toEqual({
        editing: true,
        edited: false,
        error: false,
      });
    });

    it('returns error on EDIT_TAG_ERROR', () => {
      expect(reducer(undefined, Mock.of<EditTagAction>({ type: editTag.rejected.toString() }))).toEqual({
        editing: false,
        edited: false,
        error: true,
      });
    });

    it('returns tag names on EDIT_TAG', () => {
      expect(reducer(undefined, {
        type: editTag.fulfilled.toString(),
        payload: { oldName, newName, color },
      })).toEqual({
        editing: false,
        edited: true,
        error: false,
        oldName: 'foo',
        newName: 'bar',
      });
    });
  });

  describe('tagEdited', () => {
    it('returns action based on provided params', () =>
      expect(tagEdited({ oldName: 'foo', newName: 'bar', color: '#ff0000' })).toEqual({
        type: tagEdited.toString(),
        payload: {
          oldName: 'foo',
          newName: 'bar',
          color: '#ff0000',
        },
      }));
  });

  describe('editTag', () => {
    const dispatch = jest.fn();
    const getState = () => Mock.of<ShlinkState>();

    afterEach(jest.clearAllMocks);

    it('calls API on success', async () => {
      editTagCall.mockResolvedValue(undefined);

      await editTag({ oldName, newName, color })(dispatch, getState, {});

      expect(editTagCall).toHaveBeenCalledTimes(1);
      expect(editTagCall).toHaveBeenCalledWith(oldName, newName);

      expect(colorGenerator.setColorForKey).toHaveBeenCalledTimes(1);
      expect(colorGenerator.setColorForKey).toHaveBeenCalledWith(newName, color);

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, expect.objectContaining({ type: editTag.pending.toString() }));
      expect(dispatch).toHaveBeenNthCalledWith(2, expect.objectContaining({
        type: editTag.fulfilled.toString(),
        payload: { oldName, newName, color },
      }));
    });

    it('throws on error', async () => {
      const error = 'Error';
      editTagCall.mockRejectedValue(error);

      try {
        await editTag({ oldName, newName, color })(dispatch, getState, {});
      } catch (e) {
        expect(e).toEqual(error);
      }

      expect(editTagCall).toHaveBeenCalledTimes(1);
      expect(editTagCall).toHaveBeenCalledWith(oldName, newName);

      expect(colorGenerator.setColorForKey).not.toHaveBeenCalled();

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, expect.objectContaining({ type: editTag.pending.toString() }));
      expect(dispatch).toHaveBeenNthCalledWith(2, expect.objectContaining({ type: editTag.rejected.toString() }));
    });
  });
});
