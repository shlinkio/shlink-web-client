import reducer, {
  EDIT_TAG_START,
  EDIT_TAG_ERROR,
  EDIT_TAG,
  TAG_EDITED,
  tagEdited,
  editTag,
} from '../../../src/tags/reducers/tagEdit';

describe('tagEditReducer', () => {
  describe('reducer', () => {
    it('returns loading on EDIT_TAG_START', () => {
      expect(reducer({}, { type: EDIT_TAG_START })).toEqual({
        editing: true,
        error: false,
      });
    });

    it('returns error on EDIT_TAG_ERROR', () => {
      expect(reducer({}, { type: EDIT_TAG_ERROR })).toEqual({
        editing: false,
        error: true,
      });
    });

    it('returns tag names on EDIT_TAG', () => {
      expect(reducer({}, { type: EDIT_TAG, oldName: 'foo', newName: 'bar' })).toEqual({
        editing: false,
        error: false,
        oldName: 'foo',
        newName: 'bar',
      });
    });
  });

  describe('tagEdited', () => {
    it('returns action based on provided params', () =>
      expect(tagEdited('foo', 'bar', '#ff0000')).toEqual({
        type: TAG_EDITED,
        oldName: 'foo',
        newName: 'bar',
        color: '#ff0000',
      }));
  });

  describe('editTag', () => {
    const createApiClientMock = (result) => ({
      editTag: jest.fn(() => result),
    });
    const colorGenerator = {
      setColorForKey: jest.fn(),
    };
    const dispatch = jest.fn();
    const getState = () => ({});

    afterEach(() => {
      colorGenerator.setColorForKey.mockReset();
      dispatch.mockReset();
    });

    it('calls API on success', async () => {
      const expectedDispatchCalls = 2;
      const oldName = 'foo';
      const newName = 'bar';
      const color = '#ff0000';
      const apiClientMock = createApiClientMock(Promise.resolve());
      const dispatchable = editTag(() => apiClientMock, colorGenerator)(oldName, newName, color);

      await dispatchable(dispatch, getState);

      expect(apiClientMock.editTag).toHaveBeenCalledTimes(1);
      expect(apiClientMock.editTag).toHaveBeenCalledWith(oldName, newName);

      expect(colorGenerator.setColorForKey).toHaveBeenCalledTimes(1);
      expect(colorGenerator.setColorForKey).toHaveBeenCalledWith(newName, color);

      expect(dispatch).toHaveBeenCalledTimes(expectedDispatchCalls);
      expect(dispatch).toHaveBeenNthCalledWith(1, { type: EDIT_TAG_START });
      expect(dispatch).toHaveBeenNthCalledWith(2, { type: EDIT_TAG, oldName, newName });
    });

    it('throws on error', async () => {
      const error = 'Error';
      const oldName = 'foo';
      const newName = 'bar';
      const color = '#ff0000';
      const apiClientMock = createApiClientMock(Promise.reject(error));
      const dispatchable = editTag(() => apiClientMock, colorGenerator)(oldName, newName, color);

      try {
        await dispatchable(dispatch, getState);
      } catch (e) {
        expect(e).toEqual(error);
      }

      expect(apiClientMock.editTag).toHaveBeenCalledTimes(1);
      expect(apiClientMock.editTag).toHaveBeenCalledWith(oldName, newName);

      expect(colorGenerator.setColorForKey).not.toHaveBeenCalled();

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, { type: EDIT_TAG_START });
      expect(dispatch).toHaveBeenNthCalledWith(2, { type: EDIT_TAG_ERROR });
    });
  });
});
