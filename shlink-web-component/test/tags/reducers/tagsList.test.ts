import { fromPartial } from '@total-typescript/shoehorn';
import type { ShlinkShortUrl } from '../../../src/api-contract';
import type { RootState } from '../../../src/container/store';
import { createShortUrl as createShortUrlCreator } from '../../../src/short-urls/reducers/shortUrlCreation';
import { tagDeleted } from '../../../src/tags/reducers/tagDelete';
import { tagEdited } from '../../../src/tags/reducers/tagEdit';
import type {
  TagsList } from '../../../src/tags/reducers/tagsList';
import {
  filterTags,
  listTags as listTagsCreator,
  tagsListReducerCreator,
} from '../../../src/tags/reducers/tagsList';
import { createNewVisits } from '../../../src/visits/reducers/visitCreation';
import type { CreateVisit } from '../../../src/visits/types';

describe('tagsListReducer', () => {
  const state = (props: Partial<TagsList>) => fromPartial<TagsList>(props);
  const buildShlinkApiClient = vi.fn();
  const listTags = listTagsCreator(buildShlinkApiClient, true);
  const createShortUrl = createShortUrlCreator(buildShlinkApiClient);
  const { reducer } = tagsListReducerCreator(listTags, createShortUrl);

  describe('reducer', () => {
    it('returns loading on LIST_TAGS_START', () => {
      expect(reducer(undefined, listTags.pending(''))).toEqual(expect.objectContaining({
        loading: true,
        error: false,
      }));
    });

    it('returns error on LIST_TAGS_ERROR', () => {
      expect(reducer(undefined, listTags.rejected(null, ''))).toEqual(expect.objectContaining({
        loading: false,
        error: true,
      }));
    });

    it('returns provided tags as filtered and regular tags on LIST_TAGS', () => {
      const tags = ['foo', 'bar', 'baz'];

      expect(reducer(undefined, listTags.fulfilled(fromPartial({ tags }), ''))).toEqual({
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
        tagDeleted(tag),
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
        state({
          tags,
          filteredTags: tags,
          stats: {
            [oldName]: {
              shortUrlsCount: 35,
              visitsCount: 35,
            },
          },
        }),
        tagEdited({ oldName, newName, color: '' }),
      )).toEqual({
        tags: expectedTags,
        filteredTags: expectedTags,
        stats: {
          [oldName]: {
            shortUrlsCount: 35,
            visitsCount: 35,
          },
          [newName]: {
            shortUrlsCount: 35,
            visitsCount: 35,
          },
        },
      });
    });

    it('filters original list of tags by provided search term on FILTER_TAGS', () => {
      const tags = ['foo', 'bar', 'baz', 'Foo2', 'fo'];
      const payload = 'Fo';
      const filteredTags = ['foo', 'Foo2', 'fo'];

      expect(reducer(state({ tags }), filterTags(payload))).toEqual({
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
      const payload = fromPartial<ShlinkShortUrl>({ tags: shortUrlTags });

      expect(reducer(state({ tags }), createShortUrl.fulfilled(payload, '', fromPartial({})))).toEqual({
        tags: expectedTags,
      });
    });

    it('increases amounts when visits are created', () => {
      const createdVisits: CreateVisit[] = [
        fromPartial({
          shortUrl: { tags: ['foo', 'bar'] },
          visit: { potentialBot: true },
        }),
        fromPartial({
          shortUrl: { tags: ['foo', 'bar'] },
          visit: {},
        }),
        fromPartial({
          shortUrl: { tags: ['bar'] },
          visit: {},
        }),
        fromPartial({
          shortUrl: { tags: ['baz'] },
          visit: { potentialBot: true },
        }),
      ];
      const tagStats = (total: number) => ({
        shortUrlsCount: 1,
        visitsCount: total,
        visitsSummary: {
          total,
          nonBots: total - 10,
          bots: 10,
        },
      });
      const stateBefore = state({
        stats: {
          foo: tagStats(100),
          bar: tagStats(200),
          baz: tagStats(150),
        },
      });

      expect(reducer(stateBefore, createNewVisits(createdVisits))).toEqual(expect.objectContaining({
        stats: {
          foo: {
            shortUrlsCount: 1,
            visitsCount: 100 + 2,
            visitsSummary: {
              total: 100 + 2,
              nonBots: 90 + 1,
              bots: 10 + 1,
            },
          },
          bar: {
            shortUrlsCount: 1,
            visitsCount: 200 + 3,
            visitsSummary: {
              total: 200 + 3,
              nonBots: 190 + 2,
              bots: 10 + 1,
            },
          },
          baz: {
            shortUrlsCount: 1,
            visitsCount: 150 + 1,
            visitsSummary: {
              total: 150 + 1,
              nonBots: 140,
              bots: 10 + 1,
            },
          },
        },
      }));
    });
  });

  describe('filterTags', () => {
    it('creates expected action', () => expect(filterTags('foo').payload).toEqual('foo'));
  });

  describe('listTags', () => {
    const dispatch = vi.fn();
    const getState = vi.fn(() => fromPartial<RootState>({}));
    const listTagsMock = vi.fn();

    const assertNoAction = async (tagsList: TagsList) => {
      getState.mockReturnValue(fromPartial<RootState>({ tagsList }));

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
      buildShlinkApiClient.mockReturnValue({ tagsStats: listTagsMock });

      await listTags()(dispatch, getState, {});

      expect(buildShlinkApiClient).toHaveBeenCalledTimes(1);
      expect(getState).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenLastCalledWith(expect.objectContaining({
        payload: { tags, stats: {} },
      }));
    });
  });
});
