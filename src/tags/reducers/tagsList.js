import { handleActions } from 'redux-actions';
import { isEmpty, reject } from 'ramda';
import { buildShlinkApiClientWithAxios as buildShlinkApiClient } from '../../utils/services/ShlinkApiClientBuilder';
import { TAG_DELETED } from './tagDelete';
import { TAG_EDITED } from './tagEdit';

/* eslint-disable padding-line-between-statements */
const LIST_TAGS_START = 'shlink/tagsList/LIST_TAGS_START';
const LIST_TAGS_ERROR = 'shlink/tagsList/LIST_TAGS_ERROR';
const LIST_TAGS = 'shlink/tagsList/LIST_TAGS';
const FILTER_TAGS = 'shlink/tagsList/FILTER_TAGS';
/* eslint-enable padding-line-between-statements */

const defaultState = {
  tags: [],
  filteredTags: [],
  loading: false,
  error: false,
};

const renameTag = (oldName, newName) => (tag) => tag === oldName ? newName : tag;
const rejectTag = (tags, tagToReject) => reject((tag) => tag === tagToReject, tags);

export default handleActions({
  [LIST_TAGS_START]: (state) => ({ ...state, loading: true, error: false }),
  [LIST_TAGS_ERROR]: (state) => ({ ...state, loading: false, error: true }),
  [LIST_TAGS]: (state, { tags }) => ({ tags, filteredTags: tags, loading: false, error: false }),
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
}, defaultState);

export const _listTags = (buildShlinkApiClient, force = false) => async (dispatch, getState) => {
  const { tagsList, selectedServer } = getState();

  if (!force && (tagsList.loading || !isEmpty(tagsList.tags))) {
    return;
  }

  dispatch({ type: LIST_TAGS_START });

  try {
    const shlinkApiClient = buildShlinkApiClient(selectedServer);
    const tags = await shlinkApiClient.listTags();

    dispatch({ tags, type: LIST_TAGS });
  } catch (e) {
    dispatch({ type: LIST_TAGS_ERROR });
  }
};

export const listTags = () => _listTags(buildShlinkApiClient);

export const forceListTags = () => _listTags(buildShlinkApiClient, true);

export const filterTags = (searchTerm) => ({
  type: FILTER_TAGS,
  searchTerm,
});
