import reducer, {
  FILTER_TAGS,
  filterTags,
  LIST_TAGS,
  LIST_TAGS_ERROR,
  LIST_TAGS_START, listTags,
} from '../../../src/tags/reducers/tagsList';
import { TAG_DELETED } from '../../../src/tags/reducers/tagDelete';
import { TAG_EDITED } from '../../../src/tags/reducers/tagEdit';

describe('tagsListReducer', () => {
  describe('reducer', () => {
    it('returns loading on LIST_TAGS_START', () => {
      expect(reducer({}, { type: LIST_TAGS_START })).toEqual({
        loading: true,
        error: false,
      });
    });

    it('returns error on LIST_TAGS_ERROR', () => {
      expect(reducer({}, { type: LIST_TAGS_ERROR })).toEqual({
        loading: false,
        error: true,
      });
    });

    it('returns provided tags as filtered and regular tags on LIST_TAGS', () => {
      const tags = [ 'foo', 'bar', 'baz' ];

      expect(reducer({}, { type: LIST_TAGS, tags })).toEqual({
        tags,
        filteredTags: tags,
        loading: false,
        error: false,
      });
    });

    it('removes provided tag from filtered and regular tags on TAG_DELETED', () => {
      const tags = [ 'foo', 'bar', 'baz' ];
      const tag = 'foo';
      const expectedTags = [ 'bar', 'baz' ];

      expect(reducer({ tags, filteredTags: tags }, { type: TAG_DELETED, tag })).toEqual({
        tags: expectedTags,
        filteredTags: expectedTags,
      });
    });

    it('renames provided tag from filtered and regular tags on TAG_EDITED', () => {
      const tags = [ 'foo', 'bar', 'baz' ];
      const oldName = 'bar';
      const newName = 'renamed';
      const expectedTags = [ 'foo', 'renamed', 'baz' ].sort();

      expect(reducer({ tags, filteredTags: tags }, { type: TAG_EDITED, oldName, newName })).toEqual({
        tags: expectedTags,
        filteredTags: expectedTags,
      });
    });

    it('filters original list of tags by provided search term on FILTER_TAGS', () => {
      const tags = [ 'foo', 'bar', 'baz', 'foo2', 'fo' ];
      const searchTerm = 'fo';
      const filteredTags = [ 'foo', 'foo2', 'fo' ];

      expect(reducer({ tags }, { type: FILTER_TAGS, searchTerm })).toEqual({
        tags,
        filteredTags,
      });
    });
  });

  describe('filterTags', () => {
    it('creates expected action', () => expect(filterTags('foo')).toEqual({ type: FILTER_TAGS, searchTerm: 'foo' }));
  });

  describe('listTags', () => {
    const dispatch = jest.fn();
    const getState = jest.fn(() => ({}));
    const buildShlinkApiClient = jest.fn();
    const listTagsMock = jest.fn();

    afterEach(() => {
      dispatch.mockReset();
      getState.mockClear();
      buildShlinkApiClient.mockReset();
      listTagsMock.mockReset();
    });

    const assertNoAction = async (tagsList) => {
      getState.mockReturnValue({ tagsList });

      await listTags(buildShlinkApiClient, false)()(dispatch, getState);

      expect(buildShlinkApiClient).not.toHaveBeenCalled();
      expect(dispatch).not.toHaveBeenCalled();
      expect(getState).toHaveBeenCalledTimes(1);
    };

    it('does nothing when loading', async () => await assertNoAction({ loading: true }));
    it('does nothing when list is not empty', async () => await assertNoAction({ loading: false, tags: [ 'foo', 'bar' ] }));

    it('dispatches loaded lists when no error occurs', async () => {
      const tags = [ 'foo', 'bar', 'baz' ];

      listTagsMock.mockResolvedValue({ tags, stats: [] });
      buildShlinkApiClient.mockReturnValue({ listTags: listTagsMock });

      await listTags(buildShlinkApiClient, true)()(dispatch, getState);

      expect(buildShlinkApiClient).toHaveBeenCalledTimes(1);
      expect(getState).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, { type: LIST_TAGS_START });
      expect(dispatch).toHaveBeenNthCalledWith(2, { type: LIST_TAGS, tags, stats: {} });
    });

    const assertErrorResult = async () => {
      await listTags(buildShlinkApiClient, true)()(dispatch, getState);

      expect(buildShlinkApiClient).toHaveBeenCalledTimes(1);
      expect(getState).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, { type: LIST_TAGS_START });
      expect(dispatch).toHaveBeenNthCalledWith(2, { type: LIST_TAGS_ERROR });
    };

    it('dispatches error when error occurs on list call', async () => {
      listTagsMock.mockRejectedValue(new Error());
      buildShlinkApiClient.mockReturnValue({ listTags: listTagsMock });

      await assertErrorResult();

      expect(listTagsMock).toHaveBeenCalledTimes(1);
    });

    it('dispatches error when error occurs on build call', async () => {
      buildShlinkApiClient.mockImplementation(() => {
        throw new Error();
      });

      await assertErrorResult();

      expect(listTagsMock).not.toHaveBeenCalled();
    });
  });
});
