import * as sinon from 'sinon';
import reducer, {
  EDIT_TAG_START,
  EDIT_TAG_ERROR,
  EDIT_TAG,
  TAG_EDITED,
  tagEdited,
  _editTag,
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

    it('returns provided state on unknown action', () =>
      expect(reducer({}, { type: 'unknown' })).toEqual({}));
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
      editTag: sinon.fake.returns(result),
    });
    const colorGenerator = {
      setColorForKey: sinon.spy(),
    };
    const dispatch = sinon.spy();
    const getState = () => ({});

    afterEach(() => {
      colorGenerator.setColorForKey.resetHistory();
      dispatch.resetHistory();
    });

    it('calls API on success', async () => {
      const expectedDispatchCalls = 2;
      const oldName = 'foo';
      const newName = 'bar';
      const color = '#ff0000';
      const apiClientMock = createApiClientMock(Promise.resolve());
      const dispatchable = _editTag(() => apiClientMock, colorGenerator, oldName, newName, color);

      await dispatchable(dispatch, getState);

      expect(apiClientMock.editTag.callCount).toEqual(1);
      expect(apiClientMock.editTag.getCall(0).args).toEqual([ oldName, newName ]);

      expect(colorGenerator.setColorForKey.callCount).toEqual(1);
      expect(colorGenerator.setColorForKey.getCall(0).args).toEqual([ newName, color ]);

      expect(dispatch.callCount).toEqual(expectedDispatchCalls);
      expect(dispatch.getCall(0).args).toEqual([{ type: EDIT_TAG_START }]);
      expect(dispatch.getCall(1).args).toEqual([{ type: EDIT_TAG, oldName, newName }]);
    });

    it('throws on error', async () => {
      const expectedDispatchCalls = 2;
      const error = 'Error';
      const oldName = 'foo';
      const newName = 'bar';
      const color = '#ff0000';
      const apiClientMock = createApiClientMock(Promise.reject(error));
      const dispatchable = _editTag(() => apiClientMock, colorGenerator, oldName, newName, color);

      try {
        await dispatchable(dispatch, getState);
      } catch (e) {
        expect(e).toEqual(error);
      }

      expect(apiClientMock.editTag.callCount).toEqual(1);
      expect(apiClientMock.editTag.getCall(0).args).toEqual([ oldName, newName ]);

      expect(colorGenerator.setColorForKey.callCount).toEqual(0);

      expect(dispatch.callCount).toEqual(expectedDispatchCalls);
      expect(dispatch.getCall(0).args).toEqual([{ type: EDIT_TAG_START }]);
      expect(dispatch.getCall(1).args).toEqual([{ type: EDIT_TAG_ERROR }]);
    });
  });
});
