import { createAction, createSlice } from '@reduxjs/toolkit';
import { isEmpty, reject } from 'ramda';
import type { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import type { ShlinkTags } from '../../api/types';
import type { ProblemDetailsError } from '../../api/types/errors';
import { parseApiError } from '../../api/utils';
import type { createShortUrl } from '../../short-urls/reducers/shortUrlCreation';
import { createAsyncThunk } from '../../utils/helpers/redux';
import { createNewVisits } from '../../visits/reducers/visitCreation';
import type { CreateVisit, Stats } from '../../visits/types';
import type { TagStats } from '../data';
import { tagDeleted } from './tagDelete';
import { tagEdited } from './tagEdit';

const REDUCER_PREFIX = 'shlink/tagsList';

type TagsStatsMap = Record<string, TagStats>;

export interface TagsList {
  tags: string[];
  filteredTags: string[];
  stats: TagsStatsMap;
  loading: boolean;
  error: boolean;
  errorData?: ProblemDetailsError;
}

interface ListTags {
  tags: string[];
  stats: TagsStatsMap;
}

const initialState: TagsList = {
  tags: [],
  filteredTags: [],
  stats: {},
  loading: false,
  error: false,
};

type TagIncrease = [string, number];

const renameTag = (oldName: string, newName: string) => (tag: string) => (tag === oldName ? newName : tag);
const rejectTag = (tags: string[], tagToReject: string) => reject((tag) => tag === tagToReject, tags);
const increaseVisitsForTags = (tags: TagIncrease[], stats: TagsStatsMap) => tags.reduce((theStats, [tag, increase]) => {
  if (!theStats[tag]) {
    return theStats;
  }

  const tagStats = theStats[tag];

  return {
    ...theStats,
    [tag]: {
      ...tagStats,
      visitsCount: tagStats.visitsCount + increase,
    },
  };
}, { ...stats });
const calculateVisitsPerTag = (createdVisits: CreateVisit[]): TagIncrease[] => Object.entries(
  createdVisits.reduce<Stats>((acc, { shortUrl }) => {
    shortUrl?.tags.forEach((tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
    });

    return acc;
  }, {}),
);

export const listTags = (buildShlinkApiClient: ShlinkApiClientBuilder, force = true) => createAsyncThunk(
  `${REDUCER_PREFIX}/listTags`,
  async (_: void, { getState }): Promise<ListTags> => {
    const { tagsList } = getState();

    if (!force && !isEmpty(tagsList.tags)) {
      return tagsList;
    }

    const { listTags: shlinkListTags } = buildShlinkApiClient(getState);
    const { tags, stats = [] }: ShlinkTags = await shlinkListTags();
    const processedStats = stats.reduce<TagsStatsMap>((acc, { tag, shortUrlsCount, visitsCount }) => {
      acc[tag] = { shortUrlsCount, visitsCount };

      return acc;
    }, {});

    return { tags, stats: processedStats };
  },
);

export const filterTags = createAction<string>(`${REDUCER_PREFIX}/filterTags`);

export const tagsListReducerCreator = (
  listTagsThunk: ReturnType<typeof listTags>,
  createShortUrlThunk: ReturnType<typeof createShortUrl>,
) => createSlice({
  name: REDUCER_PREFIX,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(filterTags, (state, { payload: searchTerm }) => ({
      ...state,
      filteredTags: state.tags.filter((tag) => tag.toLowerCase().match(searchTerm.toLowerCase())),
    }));

    builder.addCase(listTagsThunk.pending, (state) => ({ ...state, loading: true, error: false }));
    builder.addCase(listTagsThunk.rejected, (_, { error }) => (
      { ...initialState, error: true, errorData: parseApiError(error) }
    ));
    builder.addCase(listTagsThunk.fulfilled, (_, { payload }) => (
      { ...initialState, stats: payload.stats, tags: payload.tags, filteredTags: payload.tags }
    ));

    builder.addCase(tagDeleted, ({ tags, filteredTags, ...rest }, { payload: tag }) => ({
      ...rest,
      tags: rejectTag(tags, tag),
      filteredTags: rejectTag(filteredTags, tag),
    }));
    builder.addCase(tagEdited, ({ tags, filteredTags, stats, ...rest }, { payload }) => ({
      ...rest,
      stats: {
        ...stats,
        [payload.newName]: stats[payload.oldName],
      },
      tags: tags.map(renameTag(payload.oldName, payload.newName)).sort(),
      filteredTags: filteredTags.map(renameTag(payload.oldName, payload.newName)).sort(),
    }));
    builder.addCase(createNewVisits, (state, { payload }) => ({
      ...state,
      stats: increaseVisitsForTags(calculateVisitsPerTag(payload.createdVisits), state.stats),
    }));

    builder.addCase(createShortUrlThunk.fulfilled, ({ tags: stateTags, ...rest }, { payload }) => ({
      ...rest,
      tags: stateTags.concat(payload.tags.filter((tag: string) => !stateTags.includes(tag))), // More performant than [ ...new Set(...) ]
    }));
  },
});
