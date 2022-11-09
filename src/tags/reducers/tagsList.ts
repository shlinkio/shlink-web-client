import { createAction, createSlice } from '@reduxjs/toolkit';
import { isEmpty, reject } from 'ramda';
import { createNewVisits } from '../../visits/reducers/visitCreation';
import { createAsyncThunk } from '../../utils/helpers/redux';
import { ShlinkTags } from '../../api/types';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { CreateVisit, Stats } from '../../visits/types';
import { parseApiError } from '../../api/utils';
import { TagStats } from '../data';
import { createShortUrl } from '../../short-urls/reducers/shortUrlCreation';
import { tagDeleted } from './tagDelete';
import { tagEdited } from './tagEdit';
import { ProblemDetailsError } from '../../api/types/errors';

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

  tagStats.visitsCount += increase;
  theStats[tag] = tagStats; // eslint-disable-line no-param-reassign

  return theStats;
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

export const reducer = (
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

    builder.addCase(tagDeleted, (state, { payload: tag }) => ({
      ...state,
      tags: rejectTag(state.tags, tag),
      filteredTags: rejectTag(state.filteredTags, tag),
    }));
    builder.addCase(tagEdited, (state, { payload }) => ({
      ...state,
      tags: state.tags.map(renameTag(payload.oldName, payload.newName)).sort(),
      filteredTags: state.filteredTags.map(renameTag(payload.oldName, payload.newName)).sort(),
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
}).reducer;
