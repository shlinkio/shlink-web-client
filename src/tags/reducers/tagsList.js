import { handleActions } from 'redux-actions';
import { isEmpty, reject } from 'ramda';
import PropTypes from 'prop-types';
import { TAG_DELETED } from './tagDelete';
import { TAG_EDITED } from './tagEdit';

/* eslint-disable padding-line-between-statements */
export const LIST_TAGS_START = 'shlink/tagsList/LIST_TAGS_START';
export const LIST_TAGS_ERROR = 'shlink/tagsList/LIST_TAGS_ERROR';
export const LIST_TAGS = 'shlink/tagsList/LIST_TAGS';
export const FILTER_TAGS = 'shlink/tagsList/FILTER_TAGS';
/* eslint-enable padding-line-between-statements */

export const TagsListType = PropTypes.shape({
  tags: PropTypes.arrayOf(PropTypes.string),
  filteredTags: PropTypes.arrayOf(PropTypes.string),
  stats: PropTypes.object, // Record
  loading: PropTypes.bool,
  error: PropTypes.bool,
});

const initialState = {
  tags: [],
  filteredTags: [],
  stats: {},
  loading: false,
  error: false,
};

const renameTag = (oldName, newName) => (tag) => tag === oldName ? newName : tag;
const rejectTag = (tags, tagToReject) => reject((tag) => tag === tagToReject, tags);

export default handleActions({
  [LIST_TAGS_START]: (state) => ({ ...state, loading: true, error: false }),
  [LIST_TAGS_ERROR]: (state) => ({ ...state, loading: false, error: true }),
  [LIST_TAGS]: (state, { tags, stats }) => ({ stats, tags, filteredTags: tags, loading: false, error: false }),
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
}, initialState);

export const listTags = (buildShlinkApiClient, force = true) => () => async (dispatch, getState) => {
  const { tagsList } = getState();

  if (!force && (tagsList.loading || !isEmpty(tagsList.tags))) {
    return;
  }

  dispatch({ type: LIST_TAGS_START });

  try {
    const { listTags } = buildShlinkApiClient(getState);
    const { tags, stats = [] } = await listTags();
    const processedStats = stats.reduce((acc, { tag, shortUrlsCount, visitsCount }) => {
      acc[tag] = { shortUrlsCount, visitsCount };

      return acc;
    }, {});

    dispatch({ tags, stats: processedStats, type: LIST_TAGS });
  } catch (e) {
    dispatch({ type: LIST_TAGS_ERROR });
  }
};

export const filterTags = (searchTerm) => ({
  type: FILTER_TAGS,
  searchTerm,
});
