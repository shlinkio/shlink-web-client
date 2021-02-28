import { isEmpty, reject } from 'ramda';
import { Action, Dispatch } from 'redux';
import { CREATE_VISITS, CreateVisitsAction } from '../../visits/reducers/visitCreation';
import { buildReducer } from '../../utils/helpers/redux';
import { ProblemDetailsError, ShlinkTags } from '../../api/types';
import { GetState } from '../../container/types';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { TagStats } from '../data';
import { CreateVisit, Stats } from '../../visits/types';
import { DeleteTagAction, TAG_DELETED } from './tagDelete';
import { EditTagAction, TAG_EDITED } from './tagEdit';
import { parseApiError } from '../../api/utils';

/* eslint-disable padding-line-between-statements */
export const LIST_TAGS_START = 'shlink/tagsList/LIST_TAGS_START';
export const LIST_TAGS_ERROR = 'shlink/tagsList/LIST_TAGS_ERROR';
export const LIST_TAGS = 'shlink/tagsList/LIST_TAGS';
export const FILTER_TAGS = 'shlink/tagsList/FILTER_TAGS';
/* eslint-enable padding-line-between-statements */

type TagsStatsMap = Record<string, TagStats>;

export interface TagsList {
  tags: string[];
  filteredTags: string[];
  stats: TagsStatsMap;
  loading: boolean;
  error: boolean;
  errorData?: ProblemDetailsError;
}

interface ListTagsAction extends Action<string> {
  tags: string[];
  stats: TagsStatsMap;
}


interface ListTagsFailedAction extends Action<string> {
  errorData?: ProblemDetailsError;
}

interface FilterTagsAction extends Action<string> {
  searchTerm: string;
}

type ListTagsCombinedAction = ListTagsAction
  & DeleteTagAction
  & CreateVisitsAction
  & EditTagAction
  & FilterTagsAction
  & ListTagsFailedAction;

const initialState = {
  tags: [],
  filteredTags: [],
  stats: {},
  loading: false,
  error: false,
};

type TagIncrease = [string, number];

const renameTag = (oldName: string, newName: string) => (tag: string) => tag === oldName ? newName : tag;
const rejectTag = (tags: string[], tagToReject: string) => reject((tag) => tag === tagToReject, tags);
const increaseVisitsForTags = (tags: TagIncrease[], stats: TagsStatsMap) => tags.reduce((stats, [ tag, increase ]) => {
  if (!stats[tag]) {
    return stats;
  }

  const tagStats = stats[tag];

  tagStats.visitsCount = tagStats.visitsCount + increase;
  stats[tag] = tagStats;

  return stats;
}, { ...stats });
const calculateVisitsPerTag = (createdVisits: CreateVisit[]): TagIncrease[] => Object.entries(
  createdVisits.reduce((acc, { shortUrl }) => {
    shortUrl?.tags.forEach((tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
    });

    return acc;
  }, {} as Stats),
);

export default buildReducer<TagsList, ListTagsCombinedAction>({
  [LIST_TAGS_START]: () => ({ ...initialState, loading: true }),
  [LIST_TAGS_ERROR]: (_, { errorData }) => ({ ...initialState, error: true, errorData }),
  [LIST_TAGS]: (_, { tags, stats }) => ({ ...initialState, stats, tags, filteredTags: tags }),
  [TAG_DELETED]: (state, { tag }) => ({
    ...state,
    tags: rejectTag(state.tags, tag),
    filteredTags: rejectTag(state.filteredTags, tag),
  }),
  [TAG_EDITED]: (state, { oldName, newName }) => ({
    ...state,
    tags: state.tags.map(renameTag(oldName, newName)).sort(),
    filteredTags: state.filteredTags.map(renameTag(oldName, newName)).sort(),
  }),
  [FILTER_TAGS]: (state, { searchTerm }) => ({
    ...state,
    filteredTags: state.tags.filter((tag) => tag.toLowerCase().match(searchTerm)),
  }),
  [CREATE_VISITS]: (state, { createdVisits }) => ({
    ...state,
    stats: increaseVisitsForTags(calculateVisitsPerTag(createdVisits), state.stats),
  }),
}, initialState);

export const listTags = (buildShlinkApiClient: ShlinkApiClientBuilder, force = true) => () => async (
  dispatch: Dispatch,
  getState: GetState,
) => {
  const { tagsList } = getState();

  if (!force && (tagsList.loading || !isEmpty(tagsList.tags))) {
    return;
  }

  dispatch({ type: LIST_TAGS_START });

  try {
    const { listTags } = buildShlinkApiClient(getState);
    const { tags, stats = [] }: ShlinkTags = await listTags();
    const processedStats = stats.reduce<TagsStatsMap>((acc, { tag, shortUrlsCount, visitsCount }) => {
      acc[tag] = { shortUrlsCount, visitsCount };

      return acc;
    }, {});

    dispatch<ListTagsAction>({ tags, stats: processedStats, type: LIST_TAGS });
  } catch (e) {
    dispatch<ListTagsFailedAction>({ type: LIST_TAGS_ERROR, errorData: parseApiError(e) });
  }
};

export const filterTags = (searchTerm: string): FilterTagsAction => ({ type: FILTER_TAGS, searchTerm });
