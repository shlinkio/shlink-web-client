import { isEmpty, reject } from 'ramda';
import PropTypes from 'prop-types';
import { Action, Dispatch } from 'redux';
import { CREATE_VISIT, CreateVisitAction } from '../../visits/reducers/visitCreation';
import { buildReducer } from '../../utils/helpers/redux';
import { ShlinkApiClientBuilder, ShlinkTags } from '../../utils/services/types';
import { GetState } from '../../container/types';
import { DeleteTagAction, TAG_DELETED } from './tagDelete';
import { EditTagAction, TAG_EDITED } from './tagEdit';

/* eslint-disable padding-line-between-statements */
export const LIST_TAGS_START = 'shlink/tagsList/LIST_TAGS_START';
export const LIST_TAGS_ERROR = 'shlink/tagsList/LIST_TAGS_ERROR';
export const LIST_TAGS = 'shlink/tagsList/LIST_TAGS';
export const FILTER_TAGS = 'shlink/tagsList/FILTER_TAGS';
/* eslint-enable padding-line-between-statements */

/** @deprecated Use TagsList interface instead */
export const TagsListType = PropTypes.shape({
  tags: PropTypes.arrayOf(PropTypes.string),
  filteredTags: PropTypes.arrayOf(PropTypes.string),
  stats: PropTypes.objectOf(PropTypes.shape({
    shortUrlsCount: PropTypes.number,
    visitsCount: PropTypes.number,
  })), // Record
  loading: PropTypes.bool,
  error: PropTypes.bool,
});

type TagsStats = Record<string, { shortUrlsCount: number; visitsCount: number }>;

export interface TagsList {
  tags: string[];
  filteredTags: string[];
  stats: TagsStats;
  loading: boolean;
  error: boolean;
}

interface ListTagsAction extends Action<string> {
  tags: string[];
  stats: TagsStats;
}

interface FilterTagsAction extends Action<string> {
  searchTerm: string;
}

type ListTagsCombinedAction = ListTagsAction & DeleteTagAction & CreateVisitAction & EditTagAction & FilterTagsAction;

const initialState = {
  tags: [],
  filteredTags: [],
  stats: {},
  loading: false,
  error: false,
};

const renameTag = (oldName: string, newName: string) => (tag: string) => tag === oldName ? newName : tag;
const rejectTag = (tags: string[], tagToReject: string) => reject((tag) => tag === tagToReject, tags);
const increaseVisitsForTags = (tags: string[], stats: TagsStats) => tags.reduce((stats, tag) => {
  if (!stats[tag]) {
    return stats;
  }

  const tagStats = stats[tag];

  tagStats.visitsCount = tagStats.visitsCount + 1;
  stats[tag] = tagStats;

  return stats;
}, { ...stats });

export default buildReducer<TagsList, ListTagsCombinedAction>({
  [LIST_TAGS_START]: () => ({ ...initialState, loading: true }),
  [LIST_TAGS_ERROR]: () => ({ ...initialState, error: true }),
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
  [CREATE_VISIT]: (state, { shortUrl }) => ({
    ...state,
    stats: increaseVisitsForTags(shortUrl.tags, state.stats),
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
    const processedStats = stats.reduce<TagsStats>((acc, { tag, shortUrlsCount, visitsCount }) => {
      acc[tag] = { shortUrlsCount, visitsCount };

      return acc;
    }, {});

    dispatch<ListTagsAction>({ tags, stats: processedStats, type: LIST_TAGS });
  } catch (e) {
    dispatch({ type: LIST_TAGS_ERROR });
  }
};

export const filterTags = (searchTerm: string): FilterTagsAction => ({ type: FILTER_TAGS, searchTerm });
