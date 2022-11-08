import { Mock } from 'ts-mockery';
import {
  TagsList,
  filterTags,
  listTags as listTagsCreator,
  reducer as reducerCreator,
} from '../../../src/tags/reducers/tagsList';
import { ShlinkState } from '../../../src/container/types';
import { ShortUrl } from '../../../src/short-urls/data';
import { CREATE_SHORT_URL } from '../../../src/short-urls/reducers/shortUrlCreation';
import { tagEdited } from '../../../src/tags/reducers/tagEdit';
import { tagDeleted } from '../../../src/tags/reducers/tagDelete';

describe('tagsListReducer', () => {
  const state = (props: Partial<TagsList>) => Mock.of<TagsList>(props);
  const buildShlinkApiClient = jest.fn();
  const listTags = listTagsCreator(buildShlinkApiClient, true);
  const reducer = reducerCreator(listTags);

  afterEach(jest.clearAllMocks);

  describe('reducer', () => {
    it('returns loading on LIST_TAGS_START', () => {
      expect(reducer(undefined, { type: listTags.pending.toString() })).toEqual(expect.objectContaining({
        loading: true,
        error: false,
      }));
    });

    it('returns error on LIST_TAGS_ERROR', () => {
      expect(reducer(undefined, { type: listTags.rejected.toString() })).toEqual(expect.objectContaining({
        loading: false,
        error: true,
      }));
    });

    it('returns provided tags as filtered and regular tags on LIST_TAGS', () => {
      const tags = ['foo', 'bar', 'baz'];

      expect(reducer(undefined, {
        type: listTags.fulfilled.toString(),
        payload: { tags },
      })).toEqual({
        tags,
        filteredTags: tags,
        loading: false,
        error: false,
      });
    });

    it('removes provided tag from filtered and regular tags on TAG_DELETED', () => {
      const tags = ['foo', 'bar', 'baz'];
      const tag = 'foo';
      const expectedTags = ['bar', 'baz'];

      expect(reducer(
        state({ tags, filteredTags: tags }),
        { type: tagDeleted.toString(), payload: tag },
      )).toEqual({
        tags: expectedTags,
        filteredTags: expectedTags,
      });
    });

    it('renames provided tag from filtered and regular tags on TAG_EDITED', () => {
      const tags = ['foo', 'bar', 'baz'];
      const oldName = 'bar';
      const newName = 'renamed';
      const expectedTags = ['foo', 'renamed', 'baz'].sort();

      expect(reducer(
        state({ tags, filteredTags: tags }),
        {
          type: tagEdited.toString(),
          payload: { oldName, newName },
        },
      )).toEqual({
        tags: expectedTags,
        filteredTags: expectedTags,
      });
    });

    it('filters original list of tags by provided search term on FILTER_TAGS', () => {
      const tags = ['foo', 'bar', 'baz', 'Foo2', 'fo'];
      const payload = 'Fo';
      const filteredTags = ['foo', 'Foo2', 'fo'];

      expect(reducer(state({ tags }), { type: filterTags.toString(), payload })).toEqual({
        tags,
        filteredTags,
      });
    });

    it.each([
      [['foo', 'foo3', 'bar3', 'fo'], ['foo', 'bar', 'baz', 'foo2', 'fo', 'foo3', 'bar3']],
      [['foo', 'bar'], ['foo', 'bar', 'baz', 'foo2', 'fo']],
      [['new', 'tag'], ['foo', 'bar', 'baz', 'foo2', 'fo', 'new', 'tag']],
    ])('appends new short URL\'s tags to the list of tags on CREATE_SHORT_URL', (shortUrlTags, expectedTags) => {
      const tags = ['foo', 'bar', 'baz', 'foo2', 'fo'];
      const payload = Mock.of<ShortUrl>({ tags: shortUrlTags });

      expect(reducer(state({ tags }), { type: `${CREATE_SHORT_URL}/fulfilled`, payload })).toEqual({
        tags: expectedTags,
      });
    });
  });

  describe('filterTags', () => {
    it('creates expected action', () => expect(filterTags('foo')).toEqual({ type: filterTags.toString(), payload: 'foo' }));
  });

  describe('listTags', () => {
    const dispatch = jest.fn();
    const getState = jest.fn(() => Mock.all<ShlinkState>());
    const listTagsMock = jest.fn();

    const assertNoAction = async (tagsList: TagsList) => {
      getState.mockReturnValue(Mock.of<ShlinkState>({ tagsList }));

      await listTagsCreator(buildShlinkApiClient, false)()(dispatch, getState, {});

      expect(buildShlinkApiClient).not.toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(getState).toHaveBeenCalledTimes(1);
    };

    it('does nothing when loading', async () => assertNoAction(state({ loading: true })));
    it(
      'does nothing when list is not empty',
      async () => assertNoAction(state({ loading: false, tags: ['foo', 'bar'] })),
    );

    it('dispatches loaded lists when no error occurs', async () => {
      const tags = ['foo', 'bar', 'baz'];

      listTagsMock.mockResolvedValue({ tags, stats: [] });
      buildShlinkApiClient.mockReturnValue({ listTags: listTagsMock });

      await listTags()(dispatch, getState, {});

      expect(buildShlinkApiClient).toHaveBeenCalledTimes(1);
      expect(getState).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, expect.objectContaining({ type: listTags.pending.toString() }));
      expect(dispatch).toHaveBeenNthCalledWith(2, expect.objectContaining({
        type: listTags.fulfilled.toString(),
        payload: { tags, stats: {} },
      }));
    });

    const assertErrorResult = async () => {
      await listTags()(dispatch, getState, {});

      expect(buildShlinkApiClient).toHaveBeenCalledTimes(1);
      expect(getState).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, expect.objectContaining({ type: listTags.pending.toString() }));
      expect(dispatch).toHaveBeenNthCalledWith(2, expect.objectContaining({ type: listTags.rejected.toString() }));
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
